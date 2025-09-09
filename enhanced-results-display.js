// Enhanced Results Display for P.A.T.R.I.C.I.A
// Beautiful, interactive presentation of comprehensive personality analysis

class EnhancedResultsDisplay {
    constructor() {
        this.resultsEngine = new EnhancedResultsEngine();
        this.currentView = 'overview';
        this.initializeCharts();
    }

    initializeCharts() {
        // Chart.js configuration for beautiful visualizations
        this.chartColors = {
            primary: 'rgba(139, 108, 193, 0.8)',
            secondary: 'rgba(166, 146, 212, 0.8)',
            accent: 'rgba(244, 160, 156, 0.8)',
            success: 'rgba(106, 168, 154, 0.8)',
            warning: 'rgba(255, 193, 84, 0.8)',
            danger: 'rgba(255, 107, 107, 0.8)'
        };
    }

    displayEnhancedResults(results) {
        // Generate comprehensive analysis
        const analysis = this.resultsEngine.generateComprehensiveResults(
            results.responses || {},
            results.scores || {},
            results.rawScores || {}
        );

        // Create main results container
        const container = document.getElementById('resultsContainer');
        container.innerHTML = this.createResultsStructure(analysis, results);

        // Initialize interactive elements
        this.initializeInteractiveElements();
        
        // Render visualizations
        this.renderVisualizations(analysis, results);
        
        // Add animations
        this.addResultsAnimations();
    }

    createResultsStructure(analysis, results) {
        return `
            <div class="enhanced-results-container">
                <!-- Hero Section -->
                <div class="results-hero">
                    <div class="hero-background">
                        <div class="animated-gradient"></div>
                        <div class="floating-shapes"></div>
                    </div>
                    <div class="hero-content">
                        <h1 class="results-title animated-title">
                            ${analysis.executiveSummary.headline}
                        </h1>
                        <p class="results-subtitle">
                            ${analysis.executiveSummary.coreMessage}
                        </p>
                        <div class="personality-badge">
                            <div class="badge-icon">${this.getPersonalityIcon(analysis.executiveSummary.primaryPattern)}</div>
                            <div class="badge-label">${analysis.executiveSummary.primaryPattern?.name || 'Unique Profile'}</div>
                        </div>
                    </div>
                </div>

                <!-- Navigation Tabs -->
                <div class="results-navigation">
                    <button class="nav-tab active" data-view="overview">
                        <span class="tab-icon">📊</span>
                        <span class="tab-label">Overview</span>
                    </button>
                    <button class="nav-tab" data-view="traits">
                        <span class="tab-icon">🎯</span>
                        <span class="tab-label">Traits Analysis</span>
                    </button>
                    <button class="nav-tab" data-view="strengths">
                        <span class="tab-icon">💪</span>
                        <span class="tab-label">Strengths</span>
                    </button>
                    <button class="nav-tab" data-view="growth">
                        <span class="tab-icon">🌱</span>
                        <span class="tab-label">Growth Areas</span>
                    </button>
                    <button class="nav-tab" data-view="career">
                        <span class="tab-icon">💼</span>
                        <span class="tab-label">Career</span>
                    </button>
                    <button class="nav-tab" data-view="relationships">
                        <span class="tab-icon">❤️</span>
                        <span class="tab-label">Relationships</span>
                    </button>
                    <button class="nav-tab" data-view="action">
                        <span class="tab-icon">🚀</span>
                        <span class="tab-label">Action Plan</span>
                    </button>
                </div>

                <!-- Content Sections -->
                <div class="results-content">
                    <!-- Overview Section -->
                    <div class="content-section active" id="overview-section">
                        ${this.createOverviewSection(analysis, results)}
                    </div>

                    <!-- Traits Analysis Section -->
                    <div class="content-section" id="traits-section">
                        ${this.createTraitsSection(analysis)}
                    </div>

                    <!-- Strengths Section -->
                    <div class="content-section" id="strengths-section">
                        ${this.createStrengthsSection(analysis)}
                    </div>

                    <!-- Growth Section -->
                    <div class="content-section" id="growth-section">
                        ${this.createGrowthSection(analysis)}
                    </div>

                    <!-- Career Section -->
                    <div class="content-section" id="career-section">
                        ${this.createCareerSection(analysis)}
                    </div>

                    <!-- Relationships Section -->
                    <div class="content-section" id="relationships-section">
                        ${this.createRelationshipsSection(analysis)}
                    </div>

                    <!-- Action Plan Section -->
                    <div class="content-section" id="action-section">
                        ${this.createActionPlanSection(analysis)}
                    </div>
                </div>

                <!-- Download and Share Options -->
                <div class="results-actions">
                    <button class="action-btn primary" onclick="downloadDetailedReport()">
                        <span class="btn-icon">📄</span>
                        <span>Download Full Report</span>
                    </button>
                    <button class="action-btn secondary" onclick="shareResults()">
                        <span class="btn-icon">🔗</span>
                        <span>Share Results</span>
                    </button>
                    <button class="action-btn tertiary" onclick="scheduleCoaching()">
                        <span class="btn-icon">🎯</span>
                        <span>Get Personalized Coaching</span>
                    </button>
                </div>
            </div>
        `;
    }

    createOverviewSection(analysis, results) {
        return `
            <div class="overview-container">
                <!-- Personality Radar Chart -->
                <div class="chart-card">
                    <h3 class="card-title">Your Personality Profile</h3>
                    <div class="chart-container">
                        <canvas id="personalityRadar"></canvas>
                    </div>
                    <div class="chart-legend" id="radarLegend"></div>
                </div>

                <!-- Key Insights -->
                <div class="insights-card">
                    <h3 class="card-title">Key Insights</h3>
                    <div class="insights-grid">
                        ${analysis.executiveSummary.keyStrengths.map(strength => `
                            <div class="insight-item">
                                <div class="insight-icon">✨</div>
                                <div class="insight-text">${strength}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Personality Pattern -->
                <div class="pattern-card">
                    <h3 class="card-title">Your Personality Pattern</h3>
                    <div class="pattern-visualization">
                        <div class="pattern-name">${analysis.personalityPattern?.name || 'Unique Profile'}</div>
                        <div class="pattern-description">
                            ${analysis.personalityPattern?.description || ''}
                        </div>
                        <div class="pattern-strengths">
                            <strong>Strengths:</strong> ${analysis.personalityPattern?.strengths || ''}
                        </div>
                        <div class="pattern-environment">
                            <strong>Ideal Environment:</strong> ${analysis.personalityPattern?.ideal_environment || ''}
                        </div>
                        <div class="pattern-advice">
                            <strong>Watch Out For:</strong> ${analysis.personalityPattern?.watch_out || ''}
                        </div>
                    </div>
                </div>

                <!-- Comparative Analysis -->
                <div class="comparison-card">
                    <h3 class="card-title">How You Compare</h3>
                    <div class="comparison-chart">
                        <canvas id="comparisonChart"></canvas>
                    </div>
                    <div class="uniqueness-score">
                        <div class="score-label">Uniqueness Score</div>
                        <div class="score-value">${analysis.comparativeAnalysis?.uniquenessScore || 75}%</div>
                        <div class="score-description">
                            Your personality combination is relatively ${
                                (analysis.comparativeAnalysis?.uniquenessScore || 75) > 70 ? 'rare' : 'common'
                            }
                        </div>
                    </div>
                </div>

                <!-- Narrative Summary -->
                <div class="narrative-card">
                    <h3 class="card-title">Your Story</h3>
                    <div class="narrative-content">
                        ${analysis.narrativeReport || this.generateDefaultNarrative(results)}
                    </div>
                </div>
            </div>
        `;
    }

    createTraitsSection(analysis) {
        const traits = analysis.detailedTraits || {};
        
        return `
            <div class="traits-container">
                <div class="traits-intro">
                    <h2>Deep Dive into Your Traits</h2>
                    <p>Understanding each dimension of your personality in detail</p>
                </div>
                
                ${Object.entries(traits).map(([trait, data]) => `
                    <div class="trait-card expanded">
                        <div class="trait-header">
                            <div class="trait-name">${this.formatTraitName(trait)}</div>
                            <div class="trait-score-display">
                                <div class="score-bar">
                                    <div class="score-fill" style="width: ${data.score}%"></div>
                                </div>
                                <div class="score-label">${Math.round(data.score)}%</div>
                            </div>
                        </div>
                        
                        <div class="trait-body">
                            <div class="trait-interpretation">
                                <div class="interpretation-label">${data.interpretation?.label || ''}</div>
                                <p class="interpretation-text">${data.interpretation?.description || ''}</p>
                            </div>
                            
                            <div class="trait-details-grid">
                                <div class="detail-section">
                                    <h4>Your Strengths</h4>
                                    <ul class="strengths-list">
                                        ${(data.interpretation?.strengths || []).map(s => `
                                            <li><span class="strength-icon">💎</span> ${s}</li>
                                        `).join('')}
                                    </ul>
                                </div>
                                
                                <div class="detail-section">
                                    <h4>Potential Challenges</h4>
                                    <ul class="challenges-list">
                                        ${(data.interpretation?.challenges || []).map(c => `
                                            <li><span class="challenge-icon">⚠️</span> ${c}</li>
                                        `).join('')}
                                    </ul>
                                </div>
                                
                                <div class="detail-section">
                                    <h4>Growth Opportunities</h4>
                                    <p class="growth-text">${data.interpretation?.growth || ''}</p>
                                </div>
                                
                                <div class="detail-section">
                                    <h4>Career Fit</h4>
                                    <div class="career-tags">
                                        ${(data.interpretation?.careers || []).map(c => `
                                            <span class="career-tag">${c}</span>
                                        `).join('')}
                                    </div>
                                </div>
                                
                                <div class="detail-section">
                                    <h4>In Relationships</h4>
                                    <p class="relationship-text">${data.interpretation?.relationships || ''}</p>
                                </div>
                            </div>
                            
                            <div class="development-tips">
                                <h4>Development Tips</h4>
                                ${(data.developmentTips || []).map(tip => `
                                    <div class="tip-item">
                                        <span class="tip-icon">💡</span>
                                        <span class="tip-text">${tip}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    createStrengthsSection(analysis) {
        const strengths = analysis.strengthsProfile || [];
        
        return `
            <div class="strengths-container">
                <div class="strengths-hero">
                    <h2>Your Unique Strengths</h2>
                    <p>These are your superpowers - the qualities that make you exceptional</p>
                </div>
                
                <div class="strengths-grid">
                    ${strengths.map((strength, index) => `
                        <div class="strength-card" style="animation-delay: ${index * 0.1}s">
                            <div class="strength-icon-container">
                                ${this.getStrengthIcon(strength.title)}
                            </div>
                            <h3 class="strength-title">${strength.title}</h3>
                            <p class="strength-description">${strength.description}</p>
                            <div class="strength-applications">
                                <h4>Best Applied In:</h4>
                                <div class="application-tags">
                                    ${strength.applications.map(app => `
                                        <span class="app-tag">${app}</span>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="strength-combinations">
                    <h3>Powerful Combinations</h3>
                    <p>When your strengths work together, they create unique advantages:</p>
                    <div class="combination-cards">
                        ${this.generateStrengthCombinations(strengths)}
                    </div>
                </div>
            </div>
        `;
    }

    createGrowthSection(analysis) {
        const growthAreas = analysis.growthAreas || [];
        
        return `
            <div class="growth-container">
                <div class="growth-intro">
                    <h2>Your Growth Journey</h2>
                    <p>Every strength has a shadow side. Here's where you can level up:</p>
                </div>
                
                <div class="growth-areas">
                    ${growthAreas.map((area, index) => `
                        <div class="growth-card">
                            <div class="growth-header">
                                <div class="growth-number">${index + 1}</div>
                                <h3 class="growth-title">${area.area}</h3>
                            </div>
                            
                            <div class="growth-current">
                                <h4>Current Situation</h4>
                                <p>${area.current}</p>
                            </div>
                            
                            <div class="growth-recommendation">
                                <h4>Recommendation</h4>
                                <p>${area.recommendation}</p>
                            </div>
                            
                            <div class="growth-exercises">
                                <h4>Practical Exercises</h4>
                                <ul class="exercise-list">
                                    ${area.exercises.map(exercise => `
                                        <li>
                                            <input type="checkbox" id="exercise-${index}-${exercise}">
                                            <label for="exercise-${index}-${exercise}">${exercise}</label>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                            
                            <div class="growth-progress">
                                <button class="track-progress-btn">Track My Progress</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="growth-resources">
                    <h3>Recommended Resources</h3>
                    ${this.generateGrowthResources(growthAreas)}
                </div>
            </div>
        `;
    }

    createCareerSection(analysis) {
        const career = analysis.careerInsights || {};
        
        return `
            <div class="career-container">
                <div class="career-header">
                    <h2>Your Career Blueprint</h2>
                    <p>Aligning your personality with professional success</p>
                </div>
                
                <div class="career-fit-chart">
                    <h3>Career Type Alignment</h3>
                    <canvas id="careerFitChart"></canvas>
                </div>
                
                <div class="ideal-roles">
                    <h3>Your Ideal Roles</h3>
                    <div class="roles-grid">
                        ${(career.idealRoles || []).map(role => `
                            <div class="role-card">
                                <div class="fit-score">${role.fitScore}% Fit</div>
                                <h4>${this.formatCareerType(role.type)}</h4>
                                <p>${role.description}</p>
                                <div class="specific-roles">
                                    ${(role.specificRoles || []).map(r => `
                                        <span class="role-tag">${r}</span>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="work-environment">
                    <h3>Your Ideal Work Environment</h3>
                    <div class="environment-grid">
                        <div class="env-factor">
                            <div class="factor-icon">🏢</div>
                            <div class="factor-label">Structure</div>
                            <div class="factor-value">${career.workEnvironment?.structure || 'Flexible'}</div>
                        </div>
                        <div class="env-factor">
                            <div class="factor-icon">👥</div>
                            <div class="factor-label">Social</div>
                            <div class="factor-value">${career.workEnvironment?.social || 'Balanced'}</div>
                        </div>
                        <div class="env-factor">
                            <div class="factor-icon">⚡</div>
                            <div class="factor-label">Pace</div>
                            <div class="factor-value">${career.workEnvironment?.pace || 'Moderate'}</div>
                        </div>
                        <div class="env-factor">
                            <div class="factor-icon">💡</div>
                            <div class="factor-label">Innovation</div>
                            <div class="factor-value">${career.workEnvironment?.innovation || 'Traditional'}</div>
                        </div>
                    </div>
                </div>
                
                <div class="leadership-style">
                    <h3>Your Leadership Style</h3>
                    ${this.createLeadershipProfile(career.leadershipStyle)}
                </div>
                
                <div class="team-dynamics">
                    <h3>Your Role in Teams</h3>
                    <div class="team-profile">
                        <div class="team-role">
                            <h4>Natural Role</h4>
                            <p>${career.teamDynamics?.role || 'Contributor'}</p>
                        </div>
                        <div class="team-contribution">
                            <h4>Key Contribution</h4>
                            <p>${career.teamDynamics?.contribution || 'Reliable execution'}</p>
                        </div>
                        <div class="team-challenges">
                            <h4>Watch Out For</h4>
                            <p>${career.teamDynamics?.challenges || 'Over-commitment'}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createRelationshipsSection(analysis) {
        const relationships = analysis.relationshipInsights || {};
        
        return `
            <div class="relationships-container">
                <div class="relationships-header">
                    <h2>Your Relationship Dynamics</h2>
                    <p>Understanding how you connect, communicate, and care</p>
                </div>
                
                <div class="relationship-style">
                    <h3>Your Relationship Style</h3>
                    <div class="style-description">
                        ${relationships.relationshipStyle || 'You approach relationships with care and consideration.'}
                    </div>
                </div>
                
                <div class="communication-profile">
                    <h3>Communication Style</h3>
                    <div class="comm-grid">
                        <div class="comm-aspect">
                            <h4>How You Express</h4>
                            <p>${relationships.communicationStyle?.expression || 'Direct and clear'}</p>
                        </div>
                        <div class="comm-aspect">
                            <h4>How You Listen</h4>
                            <p>${relationships.communicationStyle?.listening || 'Attentive and engaged'}</p>
                        </div>
                        <div class="comm-aspect">
                            <h4>Conflict Approach</h4>
                            <p>${relationships.conflictApproach || 'Seeks resolution'}</p>
                        </div>
                    </div>
                </div>
                
                <div class="intimacy-needs">
                    <h3>Your Intimacy Needs</h3>
                    <div class="needs-spectrum">
                        ${this.createIntimacySpectrum(relationships.intimacyNeeds)}
                    </div>
                </div>
                
                <div class="ideal-partner">
                    <h3>Ideal Partner Traits</h3>
                    <div class="partner-traits">
                        ${(relationships.idealPartnerTraits || []).map(trait => `
                            <div class="partner-trait">
                                <span class="trait-icon">💝</span>
                                <span class="trait-text">${trait}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="relationship-growth">
                    <h3>Growth Opportunities in Relationships</h3>
                    <div class="growth-cards">
                        ${(relationships.growthOpportunities || []).map(opp => `
                            <div class="rel-growth-card">
                                <h4>${opp.area}</h4>
                                <p>${opp.description}</p>
                                <div class="practice-tip">
                                    <strong>Try This:</strong> ${opp.practice}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    createActionPlanSection(analysis) {
        const actionPlan = analysis.actionPlan || {};
        
        return `
            <div class="action-plan-container">
                <div class="action-header">
                    <h2>Your Personalized Action Plan</h2>
                    <p>Concrete steps to leverage your strengths and address growth areas</p>
                </div>
                
                <div class="timeline-container">
                    <div class="timeline-section">
                        <div class="timeline-marker">
                            <div class="marker-icon">🎯</div>
                            <div class="marker-label">Next 30 Days</div>
                        </div>
                        <div class="timeline-content">
                            <h3>Immediate Actions</h3>
                            <div class="action-items">
                                ${(actionPlan.immediate || []).map(action => `
                                    <div class="action-item">
                                        <input type="checkbox" id="immediate-${action.action}">
                                        <label for="immediate-${action.action}">
                                            <div class="action-title">${action.action}</div>
                                            <div class="action-outcome">Expected: ${action.expected_outcome}</div>
                                            <div class="action-effort">Effort: ${action.effort_required}</div>
                                        </label>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="timeline-section">
                        <div class="timeline-marker">
                            <div class="marker-icon">📈</div>
                            <div class="marker-label">3 Months</div>
                        </div>
                        <div class="timeline-content">
                            <h3>Short-Term Goals</h3>
                            <div class="action-items">
                                ${(actionPlan.shortTerm || []).map(action => `
                                    <div class="action-item">
                                        <input type="checkbox" id="short-${action.action}">
                                        <label for="short-${action.action}">
                                            <div class="action-title">${action.action}</div>
                                            <div class="action-outcome">Expected: ${action.expected_outcome}</div>
                                            <div class="action-milestone">Milestone: ${action.milestone}</div>
                                        </label>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="timeline-section">
                        <div class="timeline-marker">
                            <div class="marker-icon">🚀</div>
                            <div class="marker-label">1 Year</div>
                        </div>
                        <div class="timeline-content">
                            <h3>Long-Term Transformation</h3>
                            <div class="action-items">
                                ${(actionPlan.longTerm || []).map(action => `
                                    <div class="action-item">
                                        <input type="checkbox" id="long-${action.action}">
                                        <label for="long-${action.action}">
                                            <div class="action-title">${action.action}</div>
                                            <div class="action-outcome">Expected: ${action.expected_outcome}</div>
                                            <div class="action-transformation">Transformation: ${action.transformation}</div>
                                        </label>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="accountability-section">
                    <h3>Stay Accountable</h3>
                    <div class="accountability-options">
                        <button class="accountability-btn">
                            <span class="btn-icon">📅</span>
                            <span>Set Reminders</span>
                        </button>
                        <button class="accountability-btn">
                            <span class="btn-icon">👥</span>
                            <span>Find Accountability Partner</span>
                        </button>
                        <button class="accountability-btn">
                            <span class="btn-icon">📊</span>
                            <span>Track Progress</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Visualization methods
    renderVisualizations(analysis, results) {
        this.renderPersonalityRadar(results.scores);
        this.renderComparisonChart(analysis.comparativeAnalysis);
        this.renderCareerFitChart(analysis.careerInsights);
    }

    renderPersonalityRadar(scores) {
        const ctx = document.getElementById('personalityRadar')?.getContext('2d');
        if (!ctx) return;

        const traits = ['extraversion', 'agreeableness', 'conscientiousness', 'neuroticism', 'openness'];
        const data = traits.map(trait => scores[trait] || 50);
        const labels = traits.map(t => t.charAt(0).toUpperCase() + t.slice(1));

        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Your Profile',
                    data: data,
                    backgroundColor: 'rgba(139, 108, 193, 0.2)',
                    borderColor: 'rgba(139, 108, 193, 1)',
                    pointBackgroundColor: 'rgba(139, 108, 193, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(139, 108, 193, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        min: 0,
                        max: 100,
                        ticks: { stepSize: 20 }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    // Helper methods
    getPersonalityIcon(pattern) {
        const icons = {
            "The Architect": "🏗️",
            "The Harmonizer": "🤝",
            "The Pioneer": "🚀",
            "The Guardian": "🛡️",
            "The Analyst": "🔬",
            "The Catalyst": "⚡"
        };
        return icons[pattern?.name] || "🌟";
    }

    formatTraitName(trait) {
        return trait.charAt(0).toUpperCase() + trait.slice(1).replace(/_/g, ' ');
    }

    getStrengthIcon(strengthTitle) {
        const icons = {
            "Reliable Team Player": "🤝",
            "Creative Catalyst": "💡",
            "Steady Achiever": "🎯",
            default: "⭐"
        };
        return `<span class="strength-icon">${icons[strengthTitle] || icons.default}</span>`;
    }

    generateDefaultNarrative(results) {
        return `Your personality reveals a unique combination of traits that shape how you experience 
                and interact with the world. This comprehensive assessment has identified key patterns 
                in your responses that point to specific strengths, preferences, and growth opportunities. 
                Your results suggest someone who brings valuable qualities to both personal and professional 
                settings.`;
    }

    initializeInteractiveElements() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
            });
        });

        // Checkbox tracking
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.trackProgress(e.target.id, e.target.checked);
            });
        });
    }

    switchView(view) {
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.view === view);
        });

        // Update active section
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.toggle('active', section.id === `${view}-section`);
        });

        this.currentView = view;
    }

    addResultsAnimations() {
        // Animate elements on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.strength-card, .growth-card, .role-card').forEach(el => {
            observer.observe(el);
        });
    }

    trackProgress(itemId, checked) {
        // Save progress to local storage
        const progress = JSON.parse(localStorage.getItem('patricia_progress') || '{}');
        progress[itemId] = checked;
        localStorage.setItem('patricia_progress', JSON.stringify(progress));
    }
}

// Export for use
window.EnhancedResultsDisplay = EnhancedResultsDisplay;