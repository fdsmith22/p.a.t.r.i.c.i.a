/**
 * Behavioral Tracker - Advanced behavioral analytics and biometric capture
 * Tracks mouse movements, keyboard dynamics, attention patterns, and micro-behaviors
 */

export class BehavioralTracker {
    constructor(options = {}) {
        this.options = {
            trackMouse: options.trackMouse !== false,
            trackKeyboard: options.trackKeyboard !== false,
            trackScroll: options.trackScroll !== false,
            trackFocus: options.trackFocus !== false,
            trackClicks: options.trackClicks !== false,
            trackTouch: options.trackTouch !== false,
            sampleRate: options.sampleRate || 60, // Hz for mouse tracking
            ...options
        };
        
        this.isTracking = false;
        this.sessionData = {
            events: [],
            mouseTrail: [],
            keystrokes: [],
            scrollPatterns: [],
            focusChanges: [],
            clicks: [],
            touches: [],
            startTime: null,
            endTime: null
        };
        
        this.lastMouseTime = 0;
        this.mouseSampleInterval = 1000 / this.options.sampleRate;
        
        // Behavioral metrics
        this.metrics = {
            mouseVelocity: [],
            mouseAcceleration: [],
            dwellTimes: [],
            hesitations: [],
            corrections: [],
            attentionSpans: []
        };
        
        // Bind event handlers
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    }
    
    /**
     * Start behavioral tracking
     */
    start(container = document) {
        if (this.isTracking) return;
        
        this.isTracking = true;
        this.sessionData.startTime = performance.now();
        this.container = container;
        
        // Mouse tracking
        if (this.options.trackMouse) {
            container.addEventListener('mousemove', this.handleMouseMove, { passive: true });
        }
        
        // Click tracking
        if (this.options.trackClicks) {
            container.addEventListener('click', this.handleClick, true);
        }
        
        // Keyboard tracking
        if (this.options.trackKeyboard) {
            container.addEventListener('keydown', this.handleKeyDown);
            container.addEventListener('keyup', this.handleKeyUp);
        }
        
        // Scroll tracking
        if (this.options.trackScroll) {
            window.addEventListener('scroll', this.handleScroll, { passive: true });
        }
        
        // Focus tracking
        if (this.options.trackFocus) {
            container.addEventListener('focus', this.handleFocus, true);
            container.addEventListener('blur', this.handleBlur, true);
        }
        
        // Touch tracking
        if (this.options.trackTouch && 'ontouchstart' in window) {
            container.addEventListener('touchstart', this.handleTouchStart, { passive: true });
            container.addEventListener('touchmove', this.handleTouchMove, { passive: true });
            container.addEventListener('touchend', this.handleTouchEnd, { passive: true });
        }
        
        // Page visibility tracking
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        
        this.logEvent('tracking_started');
    }
    
    /**
     * Stop behavioral tracking
     */
    stop() {
        if (!this.isTracking) return;
        
        this.isTracking = false;
        this.sessionData.endTime = performance.now();
        
        // Remove event listeners
        if (this.container) {
            this.container.removeEventListener('mousemove', this.handleMouseMove);
            this.container.removeEventListener('click', this.handleClick);
            this.container.removeEventListener('keydown', this.handleKeyDown);
            this.container.removeEventListener('keyup', this.handleKeyUp);
            this.container.removeEventListener('focus', this.handleFocus);
            this.container.removeEventListener('blur', this.handleBlur);
            this.container.removeEventListener('touchstart', this.handleTouchStart);
            this.container.removeEventListener('touchmove', this.handleTouchMove);
            this.container.removeEventListener('touchend', this.handleTouchEnd);
        }
        
        window.removeEventListener('scroll', this.handleScroll);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        
        this.logEvent('tracking_stopped');
        
        // Calculate final metrics
        this.calculateMetrics();
    }
    
    /**
     * Handle mouse movement
     */
    handleMouseMove(event) {
        const now = performance.now();
        
        // Sample rate limiting
        if (now - this.lastMouseTime < this.mouseSampleInterval) return;
        
        this.lastMouseTime = now;
        const timestamp = now - this.sessionData.startTime;
        
        const mouseData = {
            x: event.clientX,
            y: event.clientY,
            pageX: event.pageX,
            pageY: event.pageY,
            timestamp: timestamp,
            target: this.getElementSelector(event.target)
        };
        
        this.sessionData.mouseTrail.push(mouseData);
        
        // Calculate velocity if we have previous position
        if (this.sessionData.mouseTrail.length > 1) {
            const prev = this.sessionData.mouseTrail[this.sessionData.mouseTrail.length - 2];
            const distance = Math.sqrt(
                Math.pow(mouseData.x - prev.x, 2) + 
                Math.pow(mouseData.y - prev.y, 2)
            );
            const timeDelta = mouseData.timestamp - prev.timestamp;
            const velocity = distance / timeDelta;
            
            this.metrics.mouseVelocity.push({
                velocity: velocity,
                timestamp: timestamp
            });
            
            // Calculate acceleration
            if (this.metrics.mouseVelocity.length > 1) {
                const prevVelocity = this.metrics.mouseVelocity[this.metrics.mouseVelocity.length - 2];
                const acceleration = (velocity - prevVelocity.velocity) / timeDelta;
                
                this.metrics.mouseAcceleration.push({
                    acceleration: acceleration,
                    timestamp: timestamp
                });
            }
        }
    }
    
    /**
     * Handle click events
     */
    handleClick(event) {
        const timestamp = performance.now() - this.sessionData.startTime;
        
        const clickData = {
            x: event.clientX,
            y: event.clientY,
            button: event.button,
            target: this.getElementSelector(event.target),
            timestamp: timestamp,
            doubleClick: this.isDoubleClick(timestamp)
        };
        
        this.sessionData.clicks.push(clickData);
        this.logEvent('click', clickData);
    }
    
    /**
     * Handle keydown events
     */
    handleKeyDown(event) {
        const timestamp = performance.now() - this.sessionData.startTime;
        
        const keyData = {
            key: event.key,
            code: event.code,
            timestamp: timestamp,
            target: this.getElementSelector(event.target),
            modifiers: {
                shift: event.shiftKey,
                ctrl: event.ctrlKey,
                alt: event.altKey,
                meta: event.metaKey
            }
        };
        
        // Track keystroke for typing dynamics
        this.sessionData.keystrokes.push({
            ...keyData,
            type: 'down'
        });
        
        // Detect corrections (backspace/delete)
        if (event.key === 'Backspace' || event.key === 'Delete') {
            this.metrics.corrections.push(timestamp);
        }
    }
    
    /**
     * Handle keyup events
     */
    handleKeyUp(event) {
        const timestamp = performance.now() - this.sessionData.startTime;
        
        this.sessionData.keystrokes.push({
            key: event.key,
            code: event.code,
            timestamp: timestamp,
            type: 'up'
        });
        
        // Calculate dwell time (key hold duration)
        const lastDown = this.sessionData.keystrokes
            .filter(k => k.type === 'down' && k.code === event.code)
            .pop();
            
        if (lastDown) {
            const dwellTime = timestamp - lastDown.timestamp;
            this.metrics.dwellTimes.push({
                key: event.key,
                duration: dwellTime,
                timestamp: timestamp
            });
        }
    }
    
    /**
     * Handle scroll events
     */
    handleScroll(event) {
        const timestamp = performance.now() - this.sessionData.startTime;
        
        this.sessionData.scrollPatterns.push({
            scrollX: window.scrollX,
            scrollY: window.scrollY,
            timestamp: timestamp,
            velocity: this.calculateScrollVelocity()
        });
    }
    
    /**
     * Handle focus events
     */
    handleFocus(event) {
        const timestamp = performance.now() - this.sessionData.startTime;
        
        this.sessionData.focusChanges.push({
            type: 'focus',
            target: this.getElementSelector(event.target),
            timestamp: timestamp
        });
        
        // Track attention span
        if (this.lastBlurTime) {
            const attentionSpan = timestamp - this.lastBlurTime;
            this.metrics.attentionSpans.push(attentionSpan);
        }
    }
    
    /**
     * Handle blur events
     */
    handleBlur(event) {
        const timestamp = performance.now() - this.sessionData.startTime;
        
        this.sessionData.focusChanges.push({
            type: 'blur',
            target: this.getElementSelector(event.target),
            timestamp: timestamp
        });
        
        this.lastBlurTime = timestamp;
    }
    
    /**
     * Handle touch start
     */
    handleTouchStart(event) {
        const timestamp = performance.now() - this.sessionData.startTime;
        
        for (let touch of event.touches) {
            this.sessionData.touches.push({
                type: 'start',
                identifier: touch.identifier,
                x: touch.clientX,
                y: touch.clientY,
                force: touch.force || 0,
                timestamp: timestamp
            });
        }
    }
    
    /**
     * Handle touch move
     */
    handleTouchMove(event) {
        const timestamp = performance.now() - this.sessionData.startTime;
        
        for (let touch of event.touches) {
            this.sessionData.touches.push({
                type: 'move',
                identifier: touch.identifier,
                x: touch.clientX,
                y: touch.clientY,
                force: touch.force || 0,
                timestamp: timestamp
            });
        }
    }
    
    /**
     * Handle touch end
     */
    handleTouchEnd(event) {
        const timestamp = performance.now() - this.sessionData.startTime;
        
        for (let touch of event.changedTouches) {
            this.sessionData.touches.push({
                type: 'end',
                identifier: touch.identifier,
                x: touch.clientX,
                y: touch.clientY,
                timestamp: timestamp
            });
        }
    }
    
    /**
     * Handle visibility change
     */
    handleVisibilityChange() {
        const timestamp = performance.now() - this.sessionData.startTime;
        
        this.logEvent('visibility_change', {
            hidden: document.hidden,
            timestamp: timestamp
        });
        
        // Track tab switches as potential distraction
        if (document.hidden) {
            this.metrics.hesitations.push({
                type: 'tab_switch',
                timestamp: timestamp
            });
        }
    }
    
    /**
     * Log custom event
     */
    logEvent(type, data = {}) {
        this.sessionData.events.push({
            type: type,
            data: data,
            timestamp: performance.now() - (this.sessionData.startTime || 0)
        });
    }
    
    /**
     * Get element selector for tracking
     */
    getElementSelector(element) {
        if (!element) return null;
        
        let selector = element.tagName.toLowerCase();
        
        if (element.id) {
            selector += `#${element.id}`;
        }
        
        if (element.className && typeof element.className === 'string') {
            selector += `.${element.className.split(' ').join('.')}`;
        }
        
        return selector;
    }
    
    /**
     * Check if click is a double click
     */
    isDoubleClick(timestamp) {
        if (this.sessionData.clicks.length === 0) return false;
        
        const lastClick = this.sessionData.clicks[this.sessionData.clicks.length - 1];
        return (timestamp - lastClick.timestamp) < 500; // 500ms threshold
    }
    
    /**
     * Calculate scroll velocity
     */
    calculateScrollVelocity() {
        if (this.sessionData.scrollPatterns.length < 2) return 0;
        
        const current = this.sessionData.scrollPatterns[this.sessionData.scrollPatterns.length - 1];
        const previous = this.sessionData.scrollPatterns[this.sessionData.scrollPatterns.length - 2];
        
        const deltaY = current.scrollY - previous.scrollY;
        const deltaTime = current.timestamp - previous.timestamp;
        
        return deltaY / deltaTime;
    }
    
    /**
     * Calculate comprehensive behavioral metrics
     */
    calculateMetrics() {
        const duration = this.sessionData.endTime - this.sessionData.startTime;
        
        return {
            // Timing metrics
            totalDuration: duration,
            activeTime: this.calculateActiveTime(),
            idleTime: this.calculateIdleTime(),
            
            // Mouse metrics
            mouseDistance: this.calculateMouseDistance(),
            averageMouseVelocity: this.calculateAverageVelocity(),
            mouseAccelerationPatterns: this.analyzeAcceleration(),
            mouseIdleTimes: this.calculateMouseIdleTimes(),
            
            // Keyboard metrics
            typingSpeed: this.calculateTypingSpeed(),
            averageDwellTime: this.calculateAverageDwellTime(),
            correctionRate: this.metrics.corrections.length / this.sessionData.keystrokes.length,
            
            // Interaction metrics
            clickCount: this.sessionData.clicks.length,
            doubleClickCount: this.sessionData.clicks.filter(c => c.doubleClick).length,
            focusChanges: this.sessionData.focusChanges.length,
            
            // Attention metrics
            averageAttentionSpan: this.calculateAverageAttentionSpan(),
            distractionEvents: this.metrics.hesitations.length,
            
            // Scroll metrics
            scrollEvents: this.sessionData.scrollPatterns.length,
            averageScrollVelocity: this.calculateAverageScrollVelocity(),
            
            // Touch metrics (mobile)
            touchEvents: this.sessionData.touches.length,
            averageTouchPressure: this.calculateAverageTouchPressure()
        };
    }
    
    /**
     * Calculate active time (time with user interaction)
     */
    calculateActiveTime() {
        const allEvents = [
            ...this.sessionData.clicks,
            ...this.sessionData.keystrokes,
            ...this.sessionData.scrollPatterns
        ].sort((a, b) => a.timestamp - b.timestamp);
        
        if (allEvents.length < 2) return 0;
        
        let activeTime = 0;
        let lastEventTime = allEvents[0].timestamp;
        
        for (let event of allEvents) {
            const gap = event.timestamp - lastEventTime;
            if (gap < 5000) { // Consider active if events within 5 seconds
                activeTime += gap;
            }
            lastEventTime = event.timestamp;
        }
        
        return activeTime;
    }
    
    /**
     * Calculate idle time
     */
    calculateIdleTime() {
        const duration = this.sessionData.endTime - this.sessionData.startTime;
        return duration - this.calculateActiveTime();
    }
    
    /**
     * Calculate total mouse distance traveled
     */
    calculateMouseDistance() {
        let totalDistance = 0;
        
        for (let i = 1; i < this.sessionData.mouseTrail.length; i++) {
            const prev = this.sessionData.mouseTrail[i - 1];
            const curr = this.sessionData.mouseTrail[i];
            
            const distance = Math.sqrt(
                Math.pow(curr.x - prev.x, 2) + 
                Math.pow(curr.y - prev.y, 2)
            );
            
            totalDistance += distance;
        }
        
        return totalDistance;
    }
    
    /**
     * Calculate average mouse velocity
     */
    calculateAverageVelocity() {
        if (this.metrics.mouseVelocity.length === 0) return 0;
        
        const sum = this.metrics.mouseVelocity.reduce((acc, v) => acc + v.velocity, 0);
        return sum / this.metrics.mouseVelocity.length;
    }
    
    /**
     * Analyze acceleration patterns
     */
    analyzeAcceleration() {
        if (this.metrics.mouseAcceleration.length === 0) return null;
        
        const accelerations = this.metrics.mouseAcceleration.map(a => a.acceleration);
        
        return {
            mean: accelerations.reduce((a, b) => a + b, 0) / accelerations.length,
            max: Math.max(...accelerations),
            min: Math.min(...accelerations),
            std: this.calculateStandardDeviation(accelerations)
        };
    }
    
    /**
     * Calculate mouse idle times
     */
    calculateMouseIdleTimes() {
        const idleTimes = [];
        
        for (let i = 1; i < this.sessionData.mouseTrail.length; i++) {
            const gap = this.sessionData.mouseTrail[i].timestamp - 
                        this.sessionData.mouseTrail[i - 1].timestamp;
            
            if (gap > 1000) { // Idle if no movement for > 1 second
                idleTimes.push(gap);
            }
        }
        
        return idleTimes;
    }
    
    /**
     * Calculate typing speed (WPM)
     */
    calculateTypingSpeed() {
        const keyPresses = this.sessionData.keystrokes.filter(k => 
            k.type === 'down' && k.key.length === 1
        );
        
        if (keyPresses.length < 2) return 0;
        
        const duration = keyPresses[keyPresses.length - 1].timestamp - keyPresses[0].timestamp;
        const minutes = duration / 60000;
        const words = keyPresses.length / 5; // Average word length
        
        return words / minutes;
    }
    
    /**
     * Calculate average dwell time
     */
    calculateAverageDwellTime() {
        if (this.metrics.dwellTimes.length === 0) return 0;
        
        const sum = this.metrics.dwellTimes.reduce((acc, d) => acc + d.duration, 0);
        return sum / this.metrics.dwellTimes.length;
    }
    
    /**
     * Calculate average attention span
     */
    calculateAverageAttentionSpan() {
        if (this.metrics.attentionSpans.length === 0) return 0;
        
        const sum = this.metrics.attentionSpans.reduce((a, b) => a + b, 0);
        return sum / this.metrics.attentionSpans.length;
    }
    
    /**
     * Calculate average scroll velocity
     */
    calculateAverageScrollVelocity() {
        if (this.sessionData.scrollPatterns.length === 0) return 0;
        
        const velocities = this.sessionData.scrollPatterns
            .map(s => Math.abs(s.velocity))
            .filter(v => v > 0);
        
        if (velocities.length === 0) return 0;
        
        return velocities.reduce((a, b) => a + b, 0) / velocities.length;
    }
    
    /**
     * Calculate average touch pressure
     */
    calculateAverageTouchPressure() {
        const touches = this.sessionData.touches.filter(t => t.force > 0);
        
        if (touches.length === 0) return 0;
        
        const sum = touches.reduce((acc, t) => acc + t.force, 0);
        return sum / touches.length;
    }
    
    /**
     * Calculate standard deviation
     */
    calculateStandardDeviation(values) {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
        const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
        return Math.sqrt(avgSquaredDiff);
    }
    
    /**
     * Get complete tracking data
     */
    getData() {
        return {
            session: this.sessionData,
            metrics: this.calculateMetrics(),
            patterns: this.analyzePatterns()
        };
    }
    
    /**
     * Analyze behavioral patterns for personality insights
     */
    analyzePatterns() {
        return {
            impulsivity: this.analyzeImpulsivity(),
            precision: this.analyzePrecision(),
            consistency: this.analyzeConsistency(),
            engagement: this.analyzeEngagement(),
            anxiety: this.analyzeAnxiety()
        };
    }
    
    /**
     * Analyze impulsivity based on click and movement patterns
     */
    analyzeImpulsivity() {
        const quickClicks = this.sessionData.clicks.filter((c, i) => {
            if (i === 0) return false;
            return c.timestamp - this.sessionData.clicks[i - 1].timestamp < 500;
        }).length;
        
        const highVelocityMoves = this.metrics.mouseVelocity.filter(v => v.velocity > 2).length;
        
        return {
            score: (quickClicks + highVelocityMoves) / (this.sessionData.clicks.length + this.metrics.mouseVelocity.length),
            quickClicks: quickClicks,
            highVelocityMoves: highVelocityMoves
        };
    }
    
    /**
     * Analyze precision based on corrections and mouse patterns
     */
    analyzePrecision() {
        const correctionRate = this.metrics.corrections.length / Math.max(1, this.sessionData.keystrokes.length);
        const mouseJitter = this.calculateMouseJitter();
        
        return {
            score: 1 - (correctionRate + mouseJitter) / 2,
            correctionRate: correctionRate,
            mouseJitter: mouseJitter
        };
    }
    
    /**
     * Calculate mouse jitter (rapid direction changes)
     */
    calculateMouseJitter() {
        if (this.metrics.mouseAcceleration.length < 2) return 0;
        
        let directionChanges = 0;
        for (let i = 1; i < this.metrics.mouseAcceleration.length; i++) {
            const curr = this.metrics.mouseAcceleration[i].acceleration;
            const prev = this.metrics.mouseAcceleration[i - 1].acceleration;
            
            if (Math.sign(curr) !== Math.sign(prev)) {
                directionChanges++;
            }
        }
        
        return directionChanges / this.metrics.mouseAcceleration.length;
    }
    
    /**
     * Analyze consistency in behavior patterns
     */
    analyzeConsistency() {
        const velocityStd = this.metrics.mouseVelocity.length > 0 ? 
            this.calculateStandardDeviation(this.metrics.mouseVelocity.map(v => v.velocity)) : 0;
        
        const dwellTimeStd = this.metrics.dwellTimes.length > 0 ?
            this.calculateStandardDeviation(this.metrics.dwellTimes.map(d => d.duration)) : 0;
        
        return {
            score: 1 / (1 + velocityStd + dwellTimeStd),
            velocityVariance: velocityStd,
            dwellTimeVariance: dwellTimeStd
        };
    }
    
    /**
     * Analyze engagement level
     */
    analyzeEngagement() {
        const activeRatio = this.calculateActiveTime() / 
            (this.sessionData.endTime - this.sessionData.startTime);
        
        const interactionRate = (this.sessionData.clicks.length + this.sessionData.keystrokes.length) /
            ((this.sessionData.endTime - this.sessionData.startTime) / 1000);
        
        return {
            score: (activeRatio + Math.min(1, interactionRate / 5)) / 2,
            activeRatio: activeRatio,
            interactionRate: interactionRate
        };
    }
    
    /**
     * Analyze anxiety indicators
     */
    analyzeAnxiety() {
        const hesitationCount = this.metrics.hesitations.length;
        const correctionRate = this.metrics.corrections.length / Math.max(1, this.sessionData.keystrokes.length);
        const mouseIdleCount = this.calculateMouseIdleTimes().length;
        
        return {
            score: (hesitationCount + correctionRate * 10 + mouseIdleCount) / 
                   (this.sessionData.events.length || 1),
            hesitations: hesitationCount,
            corrections: correctionRate,
            mouseIdles: mouseIdleCount
        };
    }
}

// Export singleton instance
export const behavioralTracker = new BehavioralTracker();