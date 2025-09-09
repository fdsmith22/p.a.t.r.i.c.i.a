// Enhanced Results Engine for P.A.T.R.I.C.I.A
// Provides deep, meaningful personality analysis based on user responses

class EnhancedResultsEngine {
    constructor() {
        this.initializeAnalysisFrameworks();
    }

    initializeAnalysisFrameworks() {
        // Comprehensive trait interpretation framework
        this.traitInterpretations = {
            extraversion: {
                veryLow: { range: [0, 20], 
                    label: "Deeply Introverted",
                    description: "You find deep fulfillment in solitude and quiet reflection. Your inner world is rich and complex.",
                    strengths: ["Deep thinking", "Self-sufficiency", "Careful observation", "Quality over quantity in relationships"],
                    challenges: ["May miss networking opportunities", "Can appear distant to others", "Risk of isolation"],
                    growth: "Consider scheduling small social activities that align with your interests.",
                    careers: ["Research", "Writing", "Programming", "Art", "Analysis"],
                    relationships: "You thrive with understanding partners who respect your need for space."
                },
                low: { range: [20, 40],
                    label: "Reserved",
                    description: "You prefer meaningful one-on-one connections over large social gatherings.",
                    strengths: ["Good listener", "Thoughtful communicator", "Deep relationships", "Independent worker"],
                    challenges: ["Networking can be draining", "May be overlooked in groups", "Slow to open up"],
                    growth: "Practice sharing your thoughts in comfortable settings first.",
                    careers: ["Counseling", "Technical fields", "Design", "Accounting", "Library sciences"],
                    relationships: "You value depth and authenticity in your connections."
                },
                medium: { range: [40, 60],
                    label: "Balanced Ambivert",
                    description: "You adapt your social energy to the situation, equally comfortable alone or with others.",
                    strengths: ["Versatile", "Adaptable", "Broad social range", "Flexible work style"],
                    challenges: ["May feel pulled in different directions", "Energy management needed"],
                    growth: "Learn to recognize and honor your energy needs in the moment.",
                    careers: ["Management", "Teaching", "Consulting", "Healthcare", "Sales support"],
                    relationships: "You can connect with diverse personality types."
                },
                high: { range: [60, 80],
                    label: "Socially Energized",
                    description: "You gain energy from social interactions and enjoy being around people.",
                    strengths: ["Natural networker", "Team energizer", "Quick to connect", "Enthusiasm"],
                    challenges: ["May struggle with alone time", "Can overwhelm introverts", "Risk of burnout"],
                    growth: "Develop practices for self-reflection and quiet processing.",
                    careers: ["Sales", "Public relations", "Event planning", "Teaching", "Hospitality"],
                    relationships: "You bring warmth and energy to your connections."
                },
                veryHigh: { range: [80, 100],
                    label: "Highly Extraverted",
                    description: "You thrive in dynamic social environments and feel most alive when engaging with others.",
                    strengths: ["Charismatic leader", "Excellent networker", "High energy", "Inspiring presence"],
                    challenges: ["Difficulty with solitary work", "May dominate conversations", "Need constant stimulation"],
                    growth: "Practice mindful listening and create space for others to share.",
                    careers: ["Entertainment", "Politics", "CEO/Leadership", "Public speaking", "Sales leadership"],
                    relationships: "Your enthusiasm is contagious but remember to create space for quieter voices."
                }
            },
            agreeableness: {
                veryLow: { range: [0, 20],
                    label: "Highly Independent",
                    description: "You prioritize logic and objectivity over emotional considerations.",
                    strengths: ["Strong negotiator", "Objective thinker", "Direct communicator", "Competitive edge"],
                    challenges: ["May seem cold or uncaring", "Difficulty with teamwork", "Relationship friction"],
                    growth: "Practice expressing appreciation and considering others' emotional needs.",
                    careers: ["Law", "Business strategy", "Criticism/Analysis", "Military", "Surgery"],
                    relationships: "You value honesty over harmony but may need to soften your approach."
                },
                low: { range: [20, 40],
                    label: "Skeptical Realist",
                    description: "You question others' motives and prefer honest feedback over sugar-coating.",
                    strengths: ["Critical thinking", "Problem identification", "Honest feedback", "Self-advocacy"],
                    challenges: ["Trust issues", "Can appear cynical", "Conflict-prone"],
                    growth: "Look for opportunities to give others the benefit of the doubt.",
                    careers: ["Investigation", "Quality control", "Auditing", "Research", "Journalism"],
                    relationships: "You value authenticity but may need to balance criticism with support."
                },
                medium: { range: [40, 60],
                    label: "Diplomatically Balanced",
                    description: "You balance concern for others with your own needs effectively.",
                    strengths: ["Fair mediator", "Balanced perspective", "Selective trust", "Appropriate boundaries"],
                    challenges: ["May struggle with extreme positions", "Decision paralysis in conflicts"],
                    growth: "Trust your judgment when you need to take a stand.",
                    careers: ["Human resources", "Mediation", "Management", "Counseling", "Teaching"],
                    relationships: "You maintain healthy boundaries while showing care for others."
                },
                high: { range: [60, 80],
                    label: "Compassionate Helper",
                    description: "You naturally empathize with others and seek to help when possible.",
                    strengths: ["Team player", "Trustworthy", "Supportive", "Conflict resolver"],
                    challenges: ["Difficulty saying no", "May be taken advantage of", "Avoid necessary conflicts"],
                    growth: "Practice assertiveness and setting healthy boundaries.",
                    careers: ["Nursing", "Social work", "Customer service", "Teaching", "Nonprofit work"],
                    relationships: "Your warmth draws people to you but ensure reciprocity."
                },
                veryHigh: { range: [80, 100],
                    label: "Deeply Altruistic",
                    description: "You consistently put others' needs before your own and seek harmony.",
                    strengths: ["Exceptional empathy", "Natural healer", "Peace-maker", "Selfless"],
                    challenges: ["Self-neglect", "Exploitation risk", "Suppressed anger", "Burnout"],
                    growth: "Your needs matter too - practice self-compassion and self-care.",
                    careers: ["Humanitarian work", "Counseling", "Chaplaincy", "Hospice care", "Community organizing"],
                    relationships: "Your giving nature is beautiful but ensure you're also receiving support."
                }
            },
            conscientiousness: {
                veryLow: { range: [0, 20],
                    label: "Free Spirit",
                    description: "You prefer spontaneity and flexibility over structure and planning.",
                    strengths: ["Adaptable", "Creative", "Present-focused", "Low stress about details"],
                    challenges: ["Missed deadlines", "Disorganization", "Unreliability perception"],
                    growth: "Identify one or two key areas where structure would most benefit you.",
                    careers: ["Art", "Emergency response", "Improvisation", "Adventure guide", "Freelance creative"],
                    relationships: "You bring spontaneity but may need to meet partners halfway on planning."
                },
                low: { range: [20, 40],
                    label: "Flexible Improviser",
                    description: "You work best with loose guidelines rather than rigid structures.",
                    strengths: ["Goes with flow", "Creative solutions", "Stress resilient", "Flexible"],
                    challenges: ["Procrastination", "Incomplete projects", "Time management"],
                    growth: "Experiment with simple organizational tools that don't feel restrictive.",
                    careers: ["Creative fields", "Startups", "Field research", "Performance", "Consulting"],
                    relationships: "You're easygoing but may need to show more follow-through on commitments."
                },
                medium: { range: [40, 60],
                    label: "Balanced Organizer",
                    description: "You balance structure with flexibility depending on the situation.",
                    strengths: ["Realistic goals", "Adaptable planning", "Measured approach", "Work-life balance"],
                    challenges: ["May lack drive for excellence", "Inconsistent productivity"],
                    growth: "Identify your peak performance conditions and optimize for them.",
                    careers: ["Project management", "Teaching", "General management", "Nursing", "Technical writing"],
                    relationships: "You're reliable without being rigid, offering stability with flexibility."
                },
                high: { range: [60, 80],
                    label: "Achievement-Oriented",
                    description: "You set high standards for yourself and work diligently to meet them.",
                    strengths: ["Reliable", "Goal achiever", "Detail-oriented", "Strong work ethic"],
                    challenges: ["Perfectionism", "Difficulty delegating", "Work-life imbalance"],
                    growth: "Remember that 'good enough' is sometimes perfect for the situation.",
                    careers: ["Engineering", "Accounting", "Law", "Medicine", "Research"],
                    relationships: "Your reliability is valued but remember to be flexible with others."
                },
                veryHigh: { range: [80, 100],
                    label: "Perfectionist Achiever",
                    description: "You have exceptionally high standards and an intense drive for excellence.",
                    strengths: ["Exceptional quality", "Maximum reliability", "Leadership through example", "Detail mastery"],
                    challenges: ["Burnout risk", "Analysis paralysis", "Critical of others", "Stress"],
                    growth: "Practice self-compassion and recognize the value of imperfection.",
                    careers: ["Surgery", "Quality assurance", "Research science", "Architecture", "CEO"],
                    relationships: "Your dedication is admirable but avoid imposing your standards on others."
                }
            },
            neuroticism: {
                veryLow: { range: [0, 20],
                    label: "Unshakeable",
                    description: "You maintain remarkable emotional stability even in challenging situations.",
                    strengths: ["Crisis management", "Emotional anchor", "Clear thinking under pressure", "Resilient"],
                    challenges: ["May seem detached", "Others may feel you don't understand their struggles"],
                    growth: "Practice expressing vulnerability to deepen connections.",
                    careers: ["Emergency medicine", "Air traffic control", "Military leadership", "Crisis counseling"],
                    relationships: "Your stability is grounding but show you can relate to others' emotions."
                },
                low: { range: [20, 40],
                    label: "Emotionally Stable",
                    description: "You handle stress well and rarely feel overwhelmed by emotions.",
                    strengths: ["Steady presence", "Rational thinking", "Low anxiety", "Quick recovery"],
                    challenges: ["May minimize others' feelings", "Could miss emotional cues"],
                    growth: "Develop deeper emotional vocabulary and empathy practices.",
                    careers: ["Management", "Piloting", "Finance", "Engineering", "Coaching"],
                    relationships: "You're a calming presence but ensure you validate others' feelings."
                },
                medium: { range: [40, 60],
                    label: "Emotionally Balanced",
                    description: "You experience a normal range of emotions without being overwhelmed.",
                    strengths: ["Emotional awareness", "Relatable", "Appropriate responses", "Empathetic"],
                    challenges: ["Occasional anxiety", "Some stress sensitivity"],
                    growth: "Develop a toolkit of coping strategies for challenging times.",
                    careers: ["Teaching", "Healthcare", "Counseling", "Human resources", "Marketing"],
                    relationships: "You connect through shared emotional experiences."
                },
                high: { range: [60, 80],
                    label: "Emotionally Sensitive",
                    description: "You experience emotions deeply and are highly attuned to your environment.",
                    strengths: ["Deep empathy", "Artistic sensitivity", "Intuitive", "Passionate"],
                    challenges: ["Anxiety prone", "Mood swings", "Stress sensitivity", "Rumination"],
                    growth: "Develop mindfulness and grounding practices for emotional regulation.",
                    careers: ["Art", "Writing", "Therapy", "Music", "Design"],
                    relationships: "Your emotional depth creates intimate connections but maintain boundaries."
                },
                veryHigh: { range: [80, 100],
                    label: "Highly Sensitive",
                    description: "You experience intense emotions and are deeply affected by your environment.",
                    strengths: ["Profound empathy", "Creative depth", "Emotional intelligence", "Intuitive gifts"],
                    challenges: ["Overwhelming emotions", "High anxiety", "Depression risk", "Difficulty with criticism"],
                    growth: "Your sensitivity is a gift - create supportive structures to manage intensity.",
                    careers: ["Creative arts", "Poetry", "Counseling (with support)", "Spiritual work"],
                    relationships: "You need understanding partners who honor your emotional intensity."
                }
            },
            openness: {
                veryLow: { range: [0, 20],
                    label: "Traditional Grounded",
                    description: "You strongly prefer familiar, proven approaches and concrete thinking.",
                    strengths: ["Practical", "Consistent", "Traditional values", "Clear preferences"],
                    challenges: ["Resistance to change", "Limited creativity", "Closed to new experiences"],
                    growth: "Try one small new experience monthly to gently expand comfort zone.",
                    careers: ["Accounting", "Administration", "Military", "Farming", "Skilled trades"],
                    relationships: "You offer stability but may need to embrace your partner's interests."
                },
                low: { range: [20, 40],
                    label: "Conventionally Minded",
                    description: "You prefer practical, tried-and-true methods over experimentation.",
                    strengths: ["Realistic", "Practical solutions", "Consistent", "Down-to-earth"],
                    challenges: ["May miss innovations", "Limited artistic appreciation", "Routine-bound"],
                    growth: "Occasionally challenge yourself with unfamiliar experiences.",
                    careers: ["Banking", "Insurance", "Manufacturing", "Retail management", "Government"],
                    relationships: "You value tradition but try to appreciate others' creative expressions."
                },
                medium: { range: [40, 60],
                    label: "Selectively Open",
                    description: "You balance practicality with selective openness to new ideas.",
                    strengths: ["Balanced perspective", "Selective innovation", "Practical creativity", "Adaptable"],
                    challenges: ["May miss extremes of innovation or tradition"],
                    growth: "Identify areas where more openness would benefit you most.",
                    careers: ["Business management", "Marketing", "Education", "Healthcare", "Technology"],
                    relationships: "You appreciate both stability and growth in relationships."
                },
                high: { range: [60, 80],
                    label: "Intellectually Curious",
                    description: "You actively seek new experiences and enjoy exploring ideas.",
                    strengths: ["Creative", "Innovative", "Culturally aware", "Intellectual"],
                    challenges: ["May lack focus", "Constantly seeking novelty", "Impatience with routine"],
                    growth: "Balance exploration with completion of existing projects.",
                    careers: ["Research", "Innovation", "Arts", "Academia", "Entrepreneurship"],
                    relationships: "You bring excitement and growth but value partners who ground you."
                },
                veryHigh: { range: [80, 100],
                    label: "Visionary Explorer",
                    description: "You live for new experiences, ideas, and creative expression.",
                    strengths: ["Highly creative", "Visionary thinking", "Cultural appreciation", "Revolutionary ideas"],
                    challenges: ["Difficulty with routine", "May seem impractical", "Constant change-seeking"],
                    growth: "Create structure to channel your creativity productively.",
                    careers: ["Artist", "Philosopher", "Inventor", "Futurist", "Revolutionary leader"],
                    relationships: "You inspire growth but need partners who can handle constant evolution."
                }
            }
        };

        // Personality type combinations and their synergies
        this.personalityPatterns = {
            "The Architect": {
                pattern: { openness: "high", conscientiousness: "high", extraversion: "low" },
                description: "You combine creative vision with disciplined execution, preferring to work independently on complex, meaningful projects.",
                strengths: "Innovative problem-solving, strategic thinking, quality output",
                ideal_environment: "Autonomous roles with intellectual challenges",
                watch_out: "Don't isolate yourself completely; collaboration can enhance your ideas"
            },
            "The Harmonizer": {
                pattern: { agreeableness: "high", neuroticism: "low", extraversion: "medium" },
                description: "You naturally create harmony in groups while maintaining emotional stability, making you an ideal mediator.",
                strengths: "Conflict resolution, team building, emotional intelligence",
                ideal_environment: "Collaborative settings with interpersonal focus",
                watch_out: "Don't sacrifice your own needs for group harmony"
            },
            "The Pioneer": {
                pattern: { openness: "high", extraversion: "high", conscientiousness: "low" },
                description: "You're a dynamic innovator who thrives on new experiences and social energy, though structure isn't your strength.",
                strengths: "Innovation, networking, adaptability, enthusiasm",
                ideal_environment: "Dynamic, changing environments with creative freedom",
                watch_out: "Partner with detail-oriented people to execute your visions"
            },
            "The Guardian": {
                pattern: { conscientiousness: "high", agreeableness: "high", neuroticism: "low" },
                description: "You're the reliable backbone of any organization, combining dedication with genuine care for others.",
                strengths: "Reliability, supportiveness, steady leadership, trustworthiness",
                ideal_environment: "Stable organizations with clear values and team focus",
                watch_out: "Don't forget to advocate for your own advancement"
            },
            "The Analyst": {
                pattern: { openness: "medium", conscientiousness: "high", agreeableness: "low" },
                description: "You approach problems with logic and precision, valuing accuracy over social considerations.",
                strengths: "Critical thinking, objective analysis, quality control, efficiency",
                ideal_environment: "Data-driven roles with clear metrics for success",
                watch_out: "Remember that emotional intelligence is also valuable"
            },
            "The Catalyst": {
                pattern: { extraversion: "high", openness: "high", neuroticism: "high" },
                description: "You're an intense, passionate force for change, feeling everything deeply and expressing it boldly.",
                strengths: "Inspiration, creativity, emotional depth, transformative energy",
                ideal_environment: "Creative or cause-driven organizations that value passion",
                watch_out: "Create stability practices to manage your emotional intensity"
            }
        };

        // Career alignment matrix
        this.careerAlignment = {
            leadership: {
                optimal_traits: { extraversion: "high", conscientiousness: "high", neuroticism: "low" },
                description: "Natural leaders combine social confidence with reliability and emotional stability"
            },
            creative: {
                optimal_traits: { openness: "high", neuroticism: "medium-high", conscientiousness: "medium" },
                description: "Creatives need imagination and emotional depth with enough discipline to produce"
            },
            analytical: {
                optimal_traits: { conscientiousness: "high", openness: "medium", agreeableness: "low-medium" },
                description: "Analysts need precision and objectivity with moderate intellectual curiosity"
            },
            helping: {
                optimal_traits: { agreeableness: "high", neuroticism: "medium", extraversion: "medium-high" },
                description: "Helpers combine empathy with emotional understanding and social energy"
            },
            technical: {
                optimal_traits: { conscientiousness: "high", openness: "medium", extraversion: "low-medium" },
                description: "Technical roles need precision and moderate innovation with focus ability"
            }
        };

        // Relationship dynamics
        this.relationshipDynamics = {
            complementary: [
                { trait1: "high_extraversion", trait2: "low_extraversion", dynamic: "Balance of social energy" },
                { trait1: "high_openness", trait2: "high_conscientiousness", dynamic: "Vision meets execution" },
                { trait1: "high_agreeableness", trait2: "low_agreeableness", dynamic: "Compassion meets assertiveness" }
            ],
            challenging: [
                { trait1: "high_neuroticism", trait2: "high_neuroticism", dynamic: "Emotional amplification" },
                { trait1: "low_agreeableness", trait2: "low_agreeableness", dynamic: "Conflict escalation" },
                { trait1: "low_conscientiousness", trait2: "low_conscientiousness", dynamic: "Mutual disorganization" }
            ],
            synergistic: [
                { trait1: "high_openness", trait2: "high_openness", dynamic: "Shared exploration" },
                { trait1: "high_conscientiousness", trait2: "high_conscientiousness", dynamic: "Mutual reliability" },
                { trait1: "low_neuroticism", trait2: "low_neuroticism", dynamic: "Stable foundation" }
            ]
        };
    }

    generateComprehensiveResults(responses, scores, rawScores) {
        const analysis = {
            corePersonality: this.analyzeCorePersonality(scores),
            detailedTraits: this.generateDetailedTraitAnalysis(scores),
            personalityPattern: this.identifyPersonalityPattern(scores),
            strengthsProfile: this.generateStrengthsProfile(scores),
            growthAreas: this.identifyGrowthAreas(scores),
            careerInsights: this.generateCareerInsights(scores),
            relationshipInsights: this.generateRelationshipInsights(scores),
            lifeStrategy: this.generateLifeStrategy(scores),
            uniqueQualities: this.identifyUniqueQualities(scores),
            actionPlan: this.createPersonalizedActionPlan(scores),
            comparativeAnalysis: this.generateComparativeAnalysis(scores),
            psychologicalProfile: this.createPsychologicalProfile(scores, rawScores)
        };

        return this.formatComprehensiveReport(analysis);
    }

    analyzeCorePersonality(scores) {
        const dominantTraits = this.identifyDominantTraits(scores);
        const traitBalance = this.assessTraitBalance(scores);
        
        return {
            summary: this.generatePersonalitySummary(dominantTraits, traitBalance),
            dominantTraits,
            traitBalance,
            personalityType: this.determinePersonalityType(scores),
            coreMotivations: this.identifyCoreMotivations(scores),
            fundamentalNeeds: this.identifyFundamentalNeeds(scores)
        };
    }

    generateDetailedTraitAnalysis(scores) {
        const analysis = {};
        
        for (const [trait, score] of Object.entries(scores)) {
            if (this.traitInterpretations[trait]) {
                const interpretation = this.getTraitInterpretation(trait, score);
                analysis[trait] = {
                    score: score,
                    percentile: this.calculatePercentile(score),
                    interpretation: interpretation,
                    implications: this.getTraitImplications(trait, score),
                    developmentTips: this.getTraitDevelopmentTips(trait, score),
                    balanceAdvice: this.getBalanceAdvice(trait, score)
                };
            }
        }
        
        return analysis;
    }

    getTraitInterpretation(trait, score) {
        const interpretations = this.traitInterpretations[trait];
        if (!interpretations) return null;
        
        for (const [level, data] of Object.entries(interpretations)) {
            if (score >= data.range[0] && score <= data.range[1]) {
                return data;
            }
        }
        return null;
    }

    identifyPersonalityPattern(scores) {
        let bestMatch = null;
        let bestMatchScore = 0;
        
        for (const [patternName, pattern] of Object.entries(this.personalityPatterns)) {
            const matchScore = this.calculatePatternMatch(scores, pattern.pattern);
            if (matchScore > bestMatchScore) {
                bestMatchScore = matchScore;
                bestMatch = { name: patternName, ...pattern, matchScore };
            }
        }
        
        return bestMatch;
    }

    calculatePatternMatch(scores, pattern) {
        let matchScore = 0;
        let totalFactors = 0;
        
        for (const [trait, expectedLevel] of Object.entries(pattern)) {
            if (scores[trait] !== undefined) {
                const score = scores[trait];
                const levelMatch = this.matchesLevel(score, expectedLevel);
                matchScore += levelMatch;
                totalFactors++;
            }
        }
        
        return totalFactors > 0 ? (matchScore / totalFactors) * 100 : 0;
    }

    matchesLevel(score, expectedLevel) {
        const levels = {
            "low": [0, 40],
            "medium": [40, 60],
            "high": [60, 100]
        };
        
        if (levels[expectedLevel]) {
            const [min, max] = levels[expectedLevel];
            if (score >= min && score <= max) return 1;
        }
        return 0;
    }

    generateStrengthsProfile(scores) {
        const strengths = [];
        
        // Identify top traits
        const sortedTraits = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        
        // Generate strength statements based on trait combinations
        if (scores.conscientiousness > 70 && scores.agreeableness > 70) {
            strengths.push({
                title: "Reliable Team Player",
                description: "You combine dependability with genuine care for others, making you invaluable in any team.",
                applications: ["Project management", "Team leadership", "Customer relations"]
            });
        }
        
        if (scores.openness > 70 && scores.extraversion > 70) {
            strengths.push({
                title: "Creative Catalyst",
                description: "Your combination of creativity and social energy helps you inspire innovation in others.",
                applications: ["Brainstorming", "Innovation workshops", "Creative direction"]
            });
        }
        
        if (scores.neuroticism < 30 && scores.conscientiousness > 70) {
            strengths.push({
                title: "Steady Achiever",
                description: "You maintain consistent performance even under pressure, delivering reliable results.",
                applications: ["Crisis management", "High-pressure roles", "Leadership positions"]
            });
        }
        
        // Add individual trait strengths
        for (const [trait, score] of sortedTraits.slice(0, 3)) {
            const interpretation = this.getTraitInterpretation(trait, score);
            if (interpretation && interpretation.strengths) {
                strengths.push({
                    title: `${trait.charAt(0).toUpperCase() + trait.slice(1)} Strengths`,
                    description: interpretation.description,
                    applications: interpretation.strengths
                });
            }
        }
        
        return strengths;
    }

    identifyGrowthAreas(scores) {
        const growthAreas = [];
        
        // Identify challenging trait combinations
        if (scores.agreeableness > 80) {
            growthAreas.push({
                area: "Assertiveness Development",
                current: "Your high agreeableness may lead to difficulty setting boundaries.",
                recommendation: "Practice saying 'no' in low-stakes situations and gradually build assertiveness.",
                exercises: [
                    "Daily boundary-setting practice",
                    "Assertiveness training course",
                    "Role-playing difficult conversations"
                ]
            });
        }
        
        if (scores.neuroticism > 70) {
            growthAreas.push({
                area: "Emotional Regulation",
                current: "You experience emotions intensely, which can be overwhelming.",
                recommendation: "Develop mindfulness and emotional regulation techniques.",
                exercises: [
                    "Daily meditation practice",
                    "Cognitive behavioral techniques",
                    "Stress-reduction activities"
                ]
            });
        }
        
        if (scores.conscientiousness < 30) {
            growthAreas.push({
                area: "Organization Skills",
                current: "Your spontaneous nature may lead to missed opportunities.",
                recommendation: "Implement simple organizational systems that don't feel restrictive.",
                exercises: [
                    "Use a simple task app",
                    "Set three daily priorities",
                    "Create routine for important tasks"
                ]
            });
        }
        
        return growthAreas;
    }

    generateCareerInsights(scores) {
        const insights = {
            idealRoles: [],
            workEnvironment: {},
            leadershipStyle: {},
            teamDynamics: {},
            careerPath: {}
        };
        
        // Determine ideal roles based on trait combinations
        for (const [careerType, requirements] of Object.entries(this.careerAlignment)) {
            const fitScore = this.calculateCareerFit(scores, requirements.optimal_traits);
            if (fitScore > 70) {
                insights.idealRoles.push({
                    type: careerType,
                    fitScore: fitScore,
                    description: requirements.description,
                    specificRoles: this.getSpecificRoles(careerType, scores)
                });
            }
        }
        
        // Work environment preferences
        insights.workEnvironment = {
            structure: scores.conscientiousness > 60 ? "Organized and systematic" : "Flexible and adaptive",
            social: scores.extraversion > 60 ? "Collaborative and team-oriented" : "Independent and focused",
            pace: scores.neuroticism < 40 ? "High-pressure acceptable" : "Steady and predictable preferred",
            innovation: scores.openness > 60 ? "Creative and changing" : "Stable and traditional"
        };
        
        // Leadership style
        insights.leadershipStyle = this.determineLeadershipStyle(scores);
        
        // Team dynamics
        insights.teamDynamics = {
            role: this.determineTeamRole(scores),
            contribution: this.determineTeamContribution(scores),
            challenges: this.determineTeamChallenges(scores)
        };
        
        return insights;
    }

    generateRelationshipInsights(scores) {
        const insights = {
            relationshipStyle: this.determineRelationshipStyle(scores),
            attachmentPattern: this.identifyAttachmentPattern(scores),
            communicationStyle: this.determineCommunicationStyle(scores),
            conflictApproach: this.determineConflictApproach(scores),
            intimacyNeeds: this.determineIntimacyNeeds(scores),
            idealPartnerTraits: this.identifyIdealPartnerTraits(scores),
            relationshipChallenges: this.identifyRelationshipChallenges(scores),
            growthOpportunities: this.identifyRelationshipGrowth(scores)
        };
        
        return insights;
    }

    generateLifeStrategy(scores) {
        return {
            coreValues: this.identifyCoreValues(scores),
            lifePriorities: this.determineLifePriorities(scores),
            fulfillmentFactors: this.identifyFulfillmentFactors(scores),
            stressManagement: this.createStressManagementPlan(scores),
            personalGrowthPath: this.createGrowthPath(scores),
            wellbeingStrategies: this.createWellbeingStrategies(scores)
        };
    }

    createPersonalizedActionPlan(scores) {
        const plan = {
            immediate: [], // Next 30 days
            shortTerm: [], // 3 months
            longTerm: [] // 1 year
        };
        
        // Generate specific, actionable recommendations
        const topPriorities = this.identifyTopPriorities(scores);
        
        for (const priority of topPriorities) {
            plan.immediate.push({
                action: priority.immediateAction,
                expected_outcome: priority.immediateOutcome,
                effort_required: priority.effortLevel,
                resources: priority.resources
            });
            
            plan.shortTerm.push({
                action: priority.shortTermAction,
                expected_outcome: priority.shortTermOutcome,
                milestone: priority.milestone
            });
            
            plan.longTerm.push({
                action: priority.longTermAction,
                expected_outcome: priority.longTermOutcome,
                transformation: priority.expectedTransformation
            });
        }
        
        return plan;
    }

    generateComparativeAnalysis(scores) {
        return {
            populationComparison: this.compareToPopulation(scores),
            strengthsRanking: this.rankStrengths(scores),
            uniquenessScore: this.calculateUniqueness(scores),
            rareQualities: this.identifyRareQualities(scores)
        };
    }

    createPsychologicalProfile(scores, rawScores) {
        return {
            cognitiveStyle: this.analyzeCognitiveStyle(scores),
            emotionalPattern: this.analyzeEmotionalPattern(scores),
            motivationalDrivers: this.analyzeMotivationalDrivers(scores),
            defenseMechanisms: this.identifyDefenseMechanisms(scores),
            copingStrategies: this.identifyCopingStrategies(scores),
            psychologicalNeeds: this.identifyPsychologicalNeeds(scores)
        };
    }

    formatComprehensiveReport(analysis) {
        return {
            executiveSummary: this.createExecutiveSummary(analysis),
            detailedAnalysis: analysis,
            visualizations: this.prepareVisualizations(analysis),
            narrativeReport: this.createNarrativeReport(analysis),
            actionableInsights: this.extractActionableInsights(analysis),
            personalizedRecommendations: this.createPersonalizedRecommendations(analysis)
        };
    }

    createExecutiveSummary(analysis) {
        const summary = {
            headline: this.createPersonalityHeadline(analysis),
            keyStrengths: this.summarizeKeyStrengths(analysis),
            primaryPattern: analysis.personalityPattern,
            coreMessage: this.createCoreMessage(analysis),
            uniqueValue: this.identifyUniqueValue(analysis)
        };
        
        return summary;
    }

    createNarrativeReport(analysis) {
        let narrative = "";
        
        // Opening paragraph - who you are
        narrative += this.createOpeningParagraph(analysis);
        
        // Strengths section
        narrative += "\n\n" + this.createStrengthsNarrative(analysis);
        
        // Working style
        narrative += "\n\n" + this.createWorkingStyleNarrative(analysis);
        
        // Relationships
        narrative += "\n\n" + this.createRelationshipNarrative(analysis);
        
        // Growth journey
        narrative += "\n\n" + this.createGrowthNarrative(analysis);
        
        // Closing inspiration
        narrative += "\n\n" + this.createClosingInspiration(analysis);
        
        return narrative;
    }

    // Helper methods
    identifyDominantTraits(scores) {
        return Object.entries(scores)
            .sort((a, b) => Math.abs(b[1] - 50) - Math.abs(a[1] - 50))
            .slice(0, 2)
            .map(([trait, score]) => ({ trait, score, deviation: Math.abs(score - 50) }));
    }

    assessTraitBalance(scores) {
        const values = Object.values(scores);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
        return {
            balanced: variance < 400,
            variability: Math.sqrt(variance),
            interpretation: variance < 400 ? "Well-balanced personality" : "Distinctive trait pattern"
        };
    }

    calculatePercentile(score) {
        // Simplified percentile calculation - in production, use actual norms
        return Math.min(99, Math.max(1, Math.round(score)));
    }

    // Additional helper methods would continue here...
}

// Export for use in main application
window.EnhancedResultsEngine = EnhancedResultsEngine;