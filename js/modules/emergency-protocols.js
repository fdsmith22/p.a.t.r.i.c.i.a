/**
 * Emergency Protocols Module
 * Handles crisis detection and resource provision
 */

export class EmergencyProtocols {
    constructor() {
        this.crisisIndicators = {
            severe: [
                'want to die', 'kill myself', 'end it all', 'suicide',
                'not worth living', 'better off dead', 'no point',
                'self harm', 'hurt myself', 'cutting'
            ],
            moderate: [
                'hopeless', 'worthless', 'cant go on', 'giving up',
                'no way out', 'trapped', 'unbearable', 'cant cope'
            ],
            trauma: [
                'flashback', 'panic', 'triggered', 'ptsd', 
                'nightmare', 'dissociate', 'numb', 'hypervigilant'
            ]
        };
        
        this.resources = {
            crisis: {
                us: {
                    name: '988 Suicide & Crisis Lifeline',
                    phone: '988',
                    text: 'Text HOME to 741741',
                    web: 'https://988lifeline.org'
                },
                uk: {
                    name: 'Samaritans',
                    phone: '116 123',
                    email: 'jo@samaritans.org',
                    web: 'https://www.samaritans.org'
                },
                international: {
                    name: 'International Crisis Lines',
                    web: 'https://findahelpline.com'
                }
            },
            neurodivergent: {
                adhd: {
                    name: 'CHADD - ADHD Support',
                    web: 'https://chadd.org',
                    description: 'Resources and support for ADHD'
                },
                autism: {
                    name: 'Autistic Self Advocacy Network',
                    web: 'https://autisticadvocacy.org',
                    description: 'By and for autistic people'
                },
                dyslexia: {
                    name: 'International Dyslexia Association',
                    web: 'https://dyslexiaida.org',
                    description: 'Information and support for dyslexia'
                }
            },
            mentalHealth: {
                therapy: {
                    name: 'Psychology Today',
                    web: 'https://www.psychologytoday.com/us/therapists',
                    description: 'Find therapists near you'
                },
                apps: {
                    name: 'Mental Health Apps',
                    list: ['Headspace', 'Calm', 'DBT Coach', 'MindShift']
                },
                peer: {
                    name: 'NAMI - Peer Support',
                    web: 'https://www.nami.org/Support-Education/Support-Groups',
                    description: 'Peer-led support groups'
                }
            },
            trauma: {
                ptsd: {
                    name: 'PTSD Alliance',
                    web: 'http://www.ptsdalliance.org',
                    description: 'PTSD resources and support'
                },
                cptsd: {
                    name: 'Complex PTSD Resources',
                    web: 'https://cptsdfoundation.org',
                    description: 'Complex trauma support'
                },
                therapy: {
                    name: 'Trauma-Informed Therapists',
                    web: 'https://www.psychologytoday.com/us/therapists/trauma-and-ptsd',
                    description: 'Specialized trauma therapy'
                }
            }
        };
    }
    
    /**
     * Check responses for crisis indicators
     */
    checkForCrisis(text) {
        if (!text) return null;
        
        const lowerText = text.toLowerCase();
        
        // Check for severe crisis indicators
        for (const indicator of this.crisisIndicators.severe) {
            if (lowerText.includes(indicator)) {
                return {
                    level: 'severe',
                    action: 'immediate',
                    resources: this.getCrisisResources()
                };
            }
        }
        
        // Check for moderate indicators
        let moderateCount = 0;
        for (const indicator of this.crisisIndicators.moderate) {
            if (lowerText.includes(indicator)) {
                moderateCount++;
            }
        }
        
        if (moderateCount >= 2) {
            return {
                level: 'moderate',
                action: 'support',
                resources: this.getSupportResources()
            };
        }
        
        // Check for trauma indicators
        for (const indicator of this.crisisIndicators.trauma) {
            if (lowerText.includes(indicator)) {
                return {
                    level: 'trauma',
                    action: 'trauma-informed',
                    resources: this.getTraumaResources()
                };
            }
        }
        
        return null;
    }
    
    /**
     * Check assessment results for intervention needs
     */
    checkAssessmentResults(results) {
        const interventions = [];
        
        // Check for high neurodivergent indicators
        if (results.adhd_probability > 0.8) {
            interventions.push({
                type: 'adhd',
                confidence: results.adhd_probability,
                message: 'Your responses suggest strong ADHD traits',
                resources: this.resources.neurodivergent.adhd
            });
        }
        
        if (results.autism_probability > 0.8) {
            interventions.push({
                type: 'autism',
                confidence: results.autism_probability,
                message: 'Your responses suggest autistic traits',
                resources: this.resources.neurodivergent.autism
            });
        }
        
        if (results.dyslexia_indicators > 0.7) {
            interventions.push({
                type: 'dyslexia',
                confidence: results.dyslexia_indicators,
                message: 'Your responses suggest possible dyslexia',
                resources: this.resources.neurodivergent.dyslexia
            });
        }
        
        // Check mental health scores
        if (results.depression_score >= 15) { // PHQ-9 moderate-severe
            interventions.push({
                type: 'depression',
                severity: 'moderate-severe',
                message: 'Your mood responses suggest you may benefit from support',
                resources: this.resources.mentalHealth.therapy
            });
        }
        
        if (results.anxiety_score >= 15) { // GAD-7 severe
            interventions.push({
                type: 'anxiety',
                severity: 'severe',
                message: 'Your anxiety levels appear elevated',
                resources: this.resources.mentalHealth.therapy
            });
        }
        
        return interventions;
    }
    
    /**
     * Get crisis resources based on location
     */
    getCrisisResources() {
        const locale = navigator.language || 'en-US';
        const resources = [];
        
        if (locale.includes('US')) {
            resources.push(this.resources.crisis.us);
        } else if (locale.includes('GB') || locale.includes('UK')) {
            resources.push(this.resources.crisis.uk);
        }
        
        resources.push(this.resources.crisis.international);
        
        return {
            immediate: resources,
            message: 'Your wellbeing matters. Please reach out for support:',
            priority: 'high'
        };
    }
    
    /**
     * Get general support resources
     */
    getSupportResources() {
        return {
            therapy: this.resources.mentalHealth.therapy,
            peer: this.resources.mentalHealth.peer,
            apps: this.resources.mentalHealth.apps,
            message: 'Support is available. Consider these resources:',
            priority: 'medium'
        };
    }
    
    /**
     * Get trauma-specific resources
     */
    getTraumaResources() {
        return {
            ptsd: this.resources.trauma.ptsd,
            cptsd: this.resources.trauma.cptsd,
            therapy: this.resources.trauma.therapy,
            message: 'Trauma-informed support can help:',
            priority: 'medium'
        };
    }
    
    /**
     * Display intervention modal
     */
    showIntervention(intervention) {
        const modal = document.createElement('div');
        modal.className = 'intervention-modal';
        modal.innerHTML = `
            <div class="intervention-content">
                <h3>We're Here to Help</h3>
                <p>${intervention.message}</p>
                
                <div class="resource-list">
                    ${this.renderResources(intervention.resources)}
                </div>
                
                <div class="intervention-actions">
                    <button class="btn btn-primary" onclick="this.parentElement.parentElement.parentElement.remove()">
                        I'll Get Help
                    </button>
                    <button class="btn btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">
                        Continue Assessment
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Log intervention for safety tracking
        this.logIntervention(intervention);
    }
    
    /**
     * Render resources HTML
     */
    renderResources(resources) {
        if (resources.immediate) {
            return resources.immediate.map(r => `
                <div class="crisis-resource">
                    <strong>${r.name}</strong>
                    ${r.phone ? `<a href="tel:${r.phone}" class="crisis-phone">${r.phone}</a>` : ''}
                    ${r.text ? `<p>${r.text}</p>` : ''}
                    ${r.web ? `<a href="${r.web}" target="_blank">Website</a>` : ''}
                </div>
            `).join('');
        }
        
        return Object.values(resources).map(r => {
            if (r.name) {
                return `
                    <div class="support-resource">
                        <strong>${r.name}</strong>
                        ${r.description ? `<p>${r.description}</p>` : ''}
                        ${r.web ? `<a href="${r.web}" target="_blank">Learn More</a>` : ''}
                    </div>
                `;
            }
            return '';
        }).join('');
    }
    
    /**
     * Log intervention for safety tracking
     */
    logIntervention(intervention) {
        const log = {
            timestamp: new Date().toISOString(),
            type: intervention.level || intervention.type,
            action: intervention.action,
            shown: true
        };
        
        // Store in session for follow-up
        sessionStorage.setItem('intervention_log', JSON.stringify(log));
        
        console.log('[Safety] Intervention shown:', log);
    }
    
    /**
     * Check if user needs follow-up
     */
    checkFollowUp() {
        const log = sessionStorage.getItem('intervention_log');
        if (log) {
            const intervention = JSON.parse(log);
            const timeSince = Date.now() - new Date(intervention.timestamp).getTime();
            
            // Follow up after 10 minutes
            if (timeSince > 600000) {
                this.showFollowUp();
            }
        }
    }
    
    /**
     * Show follow-up check
     */
    showFollowUp() {
        const followUp = document.createElement('div');
        followUp.className = 'follow-up-banner';
        followUp.innerHTML = `
            <p>How are you feeling? Remember, support is always available.</p>
            <button onclick="this.parentElement.remove()">I'm OK</button>
        `;
        
        document.body.insertBefore(followUp, document.body.firstChild);
    }
}

// Export singleton instance
export const emergencyProtocols = new EmergencyProtocols();