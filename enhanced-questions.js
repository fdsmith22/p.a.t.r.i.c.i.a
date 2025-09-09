// Enhanced Question Formats for P.A.T.R.I.C.I.A
// Making personality assessment fun and engaging!

const questionFormats = {
    // Scenario-based questions
    scenario: (text, options) => ({
        type: 'scenario',
        prompt: text,
        responseType: 'choice',
        options: options,
        visual: 'cards'
    }),
    
    // Slider with dynamic feedback
    spectrum: (leftLabel, rightLabel, prompt) => ({
        type: 'spectrum',
        prompt: prompt,
        leftLabel: leftLabel,
        rightLabel: rightLabel,
        responseType: 'slider',
        showLiveReaction: true
    }),
    
    // Quick-fire word association
    wordChoice: (prompt, words) => ({
        type: 'wordChoice',
        prompt: prompt,
        words: words,
        responseType: 'multiSelect',
        maxSelections: 3
    }),
    
    // Visual metaphor selection
    metaphor: (prompt, images) => ({
        type: 'metaphor',
        prompt: prompt,
        images: images,
        responseType: 'imageSelect'
    }),
    
    // Emoji mood scale
    emojiScale: (prompt, context) => ({
        type: 'emojiScale',
        prompt: prompt,
        context: context,
        emojis: ['😫', '😟', '😐', '😊', '😄'],
        responseType: 'emojiPick'
    }),
    
    // Story completion
    storyComplete: (setup, options) => ({
        type: 'storyComplete',
        setup: setup,
        options: options,
        responseType: 'narrative'
    }),
    
    // Would you rather
    wouldYouRather: (optionA, optionB, trait) => ({
        type: 'wouldYouRather',
        optionA: optionA,
        optionB: optionB,
        trait: trait,
        responseType: 'binary'
    }),
    
    // Ranking/Prioritization
    rankOrder: (prompt, items) => ({
        type: 'rankOrder',
        prompt: prompt,
        items: items,
        responseType: 'dragOrder'
    }),
    
    // Time-based preference
    timeOfDay: (activity, trait) => ({
        type: 'timeOfDay',
        activity: activity,
        trait: trait,
        responseType: 'clockPick'
    }),
    
    // Percentage allocation
    allocation: (prompt, categories) => ({
        type: 'allocation',
        prompt: prompt,
        categories: categories,
        totalPoints: 100,
        responseType: 'distribute'
    })
};

// Enhanced BFI-2 Questions with varied formats
const enhancedValidatedQuestions = {
    // Extraversion Domain
    extraversion: [
        questionFormats.scenario(
            "You're at a party where you only know the host. What do you do?",
            [
                { text: "Find a quiet corner and observe", value: 1 },
                { text: "Chat with the host when they're free", value: 2 },
                { text: "Join a small group conversation", value: 3 },
                { text: "Introduce yourself to several people", value: 4 },
                { text: "Become the life of the party", value: 5 }
            ]
        ),
        questionFormats.spectrum(
            "Need alone time to recharge",
            "Get energy from being around others",
            "After a long day, what restores your energy?"
        ),
        questionFormats.wouldYouRather(
            "Spend Saturday night at a bustling concert",
            "Have a cozy movie night at home",
            "sociability"
        ),
        questionFormats.emojiScale(
            "How do you feel about surprise social gatherings?",
            "Friends show up unexpectedly at your door"
        ),
        questionFormats.allocation(
            "In your ideal week, how would you split your time?",
            ["Alone time", "Small groups (2-3 people)", "Large social gatherings", "One-on-one interactions"]
        )
    ],
    
    // Agreeableness Domain
    agreeableness: [
        questionFormats.scenario(
            "A coworker takes credit for your idea in a meeting. You:",
            [
                { text: "Publicly correct them immediately", value: 1 },
                { text: "Confront them privately after", value: 2 },
                { text: "Mention it to your manager later", value: 3 },
                { text: "Let it go but remember for next time", value: 4 },
                { text: "Assume they forgot it was your idea", value: 5 }
            ]
        ),
        questionFormats.wordChoice(
            "Which words resonate with how you handle conflict?",
            ["Compromise", "Assert", "Avoid", "Mediate", "Win", "Understand", "Defend", "Peace", "Justice", "Harmony"]
        ),
        questionFormats.spectrum(
            "People often disappoint me",
            "I believe in people's good intentions",
            "Your general view of others:"
        ),
        questionFormats.storyComplete(
            "Someone cuts in front of you in a long queue...",
            [
                "I'd firmly tell them to go to the back",
                "I'd politely point out where the line ends",
                "I'd exchange knowing looks with others but say nothing",
                "I'd assume they didn't see the queue"
            ]
        )
    ],
    
    // Conscientiousness Domain
    conscientiousness: [
        questionFormats.rankOrder(
            "How do you prefer to tackle a big project?",
            [
                "Create a detailed plan first",
                "Jump in and figure it out as I go",
                "Set major milestones only",
                "Work in bursts of inspiration",
                "Follow a strict schedule"
            ]
        ),
        questionFormats.metaphor(
            "Which workspace matches your style?",
            [
                { image: "🗂️", label: "Everything labeled and filed", value: 5 },
                { image: "📚", label: "Organized chaos", value: 3 },
                { image: "🎨", label: "Creative mess", value: 2 },
                { image: "🏢", label: "Minimalist and clean", value: 4 },
                { image: "🌪️", label: "Controlled tornado", value: 1 }
            ]
        ),
        questionFormats.timeOfDay(
            "When do you do your most important work?",
            "productivity"
        ),
        questionFormats.spectrum(
            "Deadlines stress me out",
            "Deadlines motivate me",
            "How do deadlines affect you?"
        )
    ],
    
    // Negative Emotionality Domain
    neuroticism: [
        questionFormats.emojiScale(
            "How often do you worry about things beyond your control?",
            "General anxiety levels"
        ),
        questionFormats.scenario(
            "You made a minor mistake at work. How long does it bother you?",
            [
                { text: "I forget about it within minutes", value: 1 },
                { text: "It crosses my mind a few times that day", value: 2 },
                { text: "I think about it for a day or two", value: 3 },
                { text: "It bothers me for about a week", value: 4 },
                { text: "I replay it in my mind for weeks", value: 5 }
            ]
        ),
        questionFormats.wordChoice(
            "Which emotions do you experience most frequently?",
            ["Calm", "Anxious", "Content", "Worried", "Peaceful", "Tense", "Relaxed", "Stressed", "Serene", "Nervous"]
        ),
        questionFormats.spectrum(
            "I bounce back quickly",
            "Things affect me deeply",
            "How do you handle emotional setbacks?"
        )
    ],
    
    // Open-Mindedness Domain
    openness: [
        questionFormats.wouldYouRather(
            "Visit a modern art museum",
            "Go to a science museum",
            "aesthetic appreciation"
        ),
        questionFormats.scenario(
            "You're choosing a vacation. Which appeals most?",
            [
                { text: "Same beloved beach resort as always", value: 1 },
                { text: "Similar destination, different hotel", value: 2 },
                { text: "New city in a familiar country", value: 3 },
                { text: "Completely different culture", value: 4 },
                { text: "Backpacking somewhere off the map", value: 5 }
            ]
        ),
        questionFormats.allocation(
            "How do you prefer to spend your free time?",
            ["Learning new skills", "Perfecting existing hobbies", "Exploring new places", "Relaxing with familiar activities"]
        ),
        questionFormats.wordChoice(
            "What drives your curiosity?",
            ["Philosophy", "Routine", "Innovation", "Tradition", "Experiment", "Proven", "Theory", "Practice", "Abstract", "Concrete"]
        )
    ]
};

// Enhanced Experimental Questions with creative formats
const enhancedExperimentalQuestions = {
    // Digital behavior patterns
    digitalBehavior: [
        questionFormats.scenario(
            "Your phone dies for 24 hours. Your primary feeling is:",
            [
                { text: "Relief - finally some peace!", value: 1 },
                { text: "Mild inconvenience", value: 2 },
                { text: "Moderate anxiety about missing things", value: 3 },
                { text: "Significant stress and disconnection", value: 4 },
                { text: "Panic - I need to fix this immediately!", value: 5 }
            ]
        ),
        questionFormats.allocation(
            "How do you distribute your screen time?",
            ["Social media", "Learning/Reading", "Entertainment", "Work/Productivity", "Communication"]
        ),
        questionFormats.timeOfDay(
            "When do you do your deepest thinking?",
            "cognitive_peak"
        )
    ],
    
    // Attachment patterns
    attachment: [
        questionFormats.metaphor(
            "In relationships, you're most like:",
            [
                { image: "🌊", label: "Ocean - deep and sometimes overwhelming", value: "anxious" },
                { image: "🏔️", label: "Mountain - steady and independent", value: "avoidant" },
                { image: "🌳", label: "Tree - rooted but flexible", value: "secure" },
                { image: "🌪️", label: "Storm - intense and unpredictable", value: "disorganized" }
            ]
        ),
        questionFormats.spectrum(
            "I need lots of reassurance",
            "I prefer emotional independence",
            "In close relationships:"
        )
    ],
    
    // Humor styles
    humorStyle: [
        questionFormats.scenario(
            "Your friend trips (they're okay). You:",
            [
                { text: "Help them up immediately with concern", value: "affiliative" },
                { text: "Laugh with them once they laugh", value: "self-enhancing" },
                { text: "Make a joke about their clumsiness", value: "aggressive" },
                { text: "Share your own embarrassing story", value: "self-defeating" }
            ]
        ),
        questionFormats.wordChoice(
            "What makes you laugh most?",
            ["Puns", "Sarcasm", "Slapstick", "Wit", "Irony", "Absurdity", "Roasts", "Wholesome", "Dark", "Clever"]
        )
    ],
    
    // Indigenous psychology - Ubuntu
    ubuntu: [
        questionFormats.spectrum(
            "Individual success",
            "Community thriving",
            "What matters more to you?"
        ),
        questionFormats.scenario(
            "You win a significant award. Your first thought:",
            [
                { text: "I earned this through my hard work", value: 1 },
                { text: "I'm grateful for this recognition", value: 2 },
                { text: "This reflects well on my team", value: 3 },
                { text: "I couldn't have done this without others", value: 4 },
                { text: "This belongs to my community", value: 5 }
            ]
        )
    ],
    
    // Buddhist psychology - Nonattachment
    nonattachment: [
        questionFormats.metaphor(
            "Your relationship with possessions is like:",
            [
                { image: "🏰", label: "Castle - everything has its protected place", value: 1 },
                { image: "🎒", label: "Backpack - only essentials", value: 5 },
                { image: "🏠", label: "Home - comfortable and curated", value: 3 },
                { image: "💨", label: "Wind - flowing through without holding", value: 4 },
                { image: "🏦", label: "Vault - securely accumulated", value: 2 }
            ]
        ),
        questionFormats.wouldYouRather(
            "Keep all your memories forever",
            "Experience each moment fully then let go",
            "attachment"
        )
    ],
    
    // Hindu Gunas
    gunas: [
        questionFormats.timeOfDay(
            "When do you feel most spiritually connected?",
            "spiritual_rhythm"
        ),
        questionFormats.allocation(
            "Your energy typically goes toward:",
            ["Action and achievement", "Pleasure and enjoyment", "Peace and contemplation", "Service to others"]
        )
    ],
    
    // Creativity patterns
    creativity: [
        questionFormats.scenario(
            "You need to solve a problem. You typically:",
            [
                { text: "Research proven solutions first", value: 1 },
                { text: "Modify existing approaches", value: 2 },
                { text: "Combine different ideas", value: 3 },
                { text: "Trust intuition and experiment", value: 4 },
                { text: "Invent something completely new", value: 5 }
            ]
        ),
        questionFormats.metaphor(
            "Your creative process is most like:",
            [
                { image: "⚡", label: "Lightning - sudden strikes of inspiration", value: "spontaneous" },
                { image: "🌱", label: "Garden - cultivating ideas over time", value: "incremental" },
                { image: "🧩", label: "Puzzle - connecting disparate pieces", value: "combinatorial" },
                { image: "🔬", label: "Lab - systematic experimentation", value: "methodical" }
            ]
        )
    ]
};

// Response interaction handlers
const responseHandlers = {
    // Animated card selection
    cardSelect: function(element, value) {
        element.classList.add('card-selected');
        element.style.transform = 'scale(1.05) rotate(2deg)';
        setTimeout(() => {
            element.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
    },
    
    // Live slider feedback with emoji
    sliderFeedback: function(value) {
        const emojis = ['😰', '😟', '😐', '😊', '🤗'];
        const index = Math.floor((value / 100) * 4);
        return emojis[index];
    },
    
    // Word bubble animation
    wordBubble: function(element) {
        element.classList.toggle('word-selected');
        if (element.classList.contains('word-selected')) {
            element.style.animation = 'bubble-pop 0.3s ease';
        }
    },
    
    // Drag and drop ranking
    initDragDrop: function(container) {
        const items = container.querySelectorAll('.rank-item');
        items.forEach(item => {
            item.draggable = true;
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragover', handleDragOver);
            item.addEventListener('drop', handleDrop);
            item.addEventListener('dragend', handleDragEnd);
        });
    },
    
    // Clock picker for time preference
    clockPicker: function(container) {
        const hours = Array.from({length: 24}, (_, i) => i);
        const clock = document.createElement('div');
        clock.className = 'clock-picker';
        
        hours.forEach(hour => {
            const segment = document.createElement('div');
            segment.className = 'hour-segment';
            segment.dataset.hour = hour;
            segment.style.transform = `rotate(${hour * 15}deg)`;
            
            segment.addEventListener('click', function() {
                document.querySelectorAll('.hour-segment').forEach(s => 
                    s.classList.remove('selected'));
                this.classList.add('selected');
            });
            
            clock.appendChild(segment);
        });
        
        container.appendChild(clock);
    },
    
    // Point allocation with visual bars
    pointAllocator: function(container, categories, total) {
        const allocator = document.createElement('div');
        allocator.className = 'point-allocator';
        
        categories.forEach(cat => {
            const row = document.createElement('div');
            row.className = 'allocation-row';
            
            const label = document.createElement('span');
            label.textContent = cat;
            
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = 0;
            slider.max = total;
            slider.value = total / categories.length;
            
            const valueDisplay = document.createElement('span');
            valueDisplay.className = 'value-display';
            valueDisplay.textContent = slider.value;
            
            slider.addEventListener('input', function() {
                updateAllocation(allocator, total);
                valueDisplay.textContent = this.value;
            });
            
            row.appendChild(label);
            row.appendChild(slider);
            row.appendChild(valueDisplay);
            allocator.appendChild(row);
        });
        
        container.appendChild(allocator);
    }
};

// Helper functions for drag and drop
function handleDragStart(e) {
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const dragging = document.querySelector('.dragging');
    const afterElement = getDragAfterElement(e.currentTarget.parentNode, e.clientY);
    
    if (afterElement == null) {
        e.currentTarget.parentNode.appendChild(dragging);
    } else {
        e.currentTarget.parentNode.insertBefore(dragging, afterElement);
    }
    
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) e.stopPropagation();
    return false;
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.rank-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateAllocation(container, total) {
    const sliders = container.querySelectorAll('input[type="range"]');
    let sum = 0;
    
    sliders.forEach(slider => {
        sum += parseInt(slider.value);
    });
    
    if (sum > total) {
        // Proportionally reduce values
        sliders.forEach(slider => {
            slider.value = Math.floor((parseInt(slider.value) / sum) * total);
        });
    }
}

// Export for use in main application
window.enhancedQuestions = {
    formats: questionFormats,
    validated: enhancedValidatedQuestions,
    experimental: enhancedExperimentalQuestions,
    handlers: responseHandlers
};