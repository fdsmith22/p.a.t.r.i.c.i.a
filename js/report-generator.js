/**
 * Neurlyn Report Generator
 * Creates comprehensive, personalized personality reports
 */

export class ReportGenerator {
    constructor() {
        this.traits = {
            Extraversion: {
                high: {
                    title: "The Social Energizer",
                    description: "You thrive in social situations and draw energy from interactions with others.",
                    strengths: ["Natural leadership", "Excellent communication", "Team building", "Networking ability"],
                    growth: ["Practice active listening", "Value quiet reflection time", "Develop deeper one-on-one connections"],
                    careers: ["Sales Manager", "Public Relations", "Event Coordinator", "Teacher", "Marketing Director"],
                    icon: "🌟"
                },
                medium: {
                    title: "The Adaptive Socializer",
                    description: "You balance social engagement with personal reflection effectively.",
                    strengths: ["Versatile communication", "Situational awareness", "Balanced perspective", "Flexible approach"],
                    growth: ["Identify optimal social environments", "Set clear boundaries", "Practice assertiveness"],
                    careers: ["Project Manager", "Consultant", "Designer", "Writer", "Analyst"],
                    icon: "⚖️"
                },
                low: {
                    title: "The Thoughtful Observer",
                    description: "You prefer meaningful one-on-one connections and quiet environments.",
                    strengths: ["Deep thinking", "Active listening", "Written communication", "Independent work"],
                    growth: ["Build presentation skills", "Expand comfort zone gradually", "Practice small talk"],
                    careers: ["Research Scientist", "Software Developer", "Accountant", "Librarian", "Technical Writer"],
                    icon: "🔍"
                }
            },
            Conscientiousness: {
                high: {
                    title: "The Achiever",
                    description: "You are highly organized, disciplined, and goal-oriented.",
                    strengths: ["Strong work ethic", "Attention to detail", "Reliability", "Planning ability"],
                    growth: ["Allow for flexibility", "Embrace imperfection", "Delegate when appropriate"],
                    careers: ["Executive", "Engineer", "Surgeon", "Financial Analyst", "Quality Assurance"],
                    icon: "🎯"
                },
                medium: {
                    title: "The Balanced Planner",
                    description: "You maintain a healthy balance between structure and spontaneity.",
                    strengths: ["Adaptability", "Pragmatism", "Prioritization", "Realistic goals"],
                    growth: ["Develop consistency", "Strengthen follow-through", "Refine organization systems"],
                    careers: ["Manager", "Entrepreneur", "Therapist", "Teacher", "Nurse"],
                    icon: "📊"
                },
                low: {
                    title: "The Creative Free Spirit",
                    description: "You value flexibility and spontaneity over rigid structure.",
                    strengths: ["Creativity", "Adaptability", "Open-mindedness", "Innovation"],
                    growth: ["Develop routines", "Use planning tools", "Break large tasks into steps"],
                    careers: ["Artist", "Musician", "Travel Writer", "Photographer", "Chef"],
                    icon: "🎨"
                }
            },
            Agreeableness: {
                high: {
                    title: "The Harmonizer",
                    description: "You prioritize cooperation, empathy, and maintaining positive relationships.",
                    strengths: ["Empathy", "Team collaboration", "Conflict resolution", "Trustworthiness"],
                    growth: ["Practice assertiveness", "Set healthy boundaries", "Develop negotiation skills"],
                    careers: ["Counselor", "Human Resources", "Social Worker", "Nurse", "Teacher"],
                    icon: "💝"
                },
                medium: {
                    title: "The Diplomatic Negotiator",
                    description: "You balance cooperation with healthy assertiveness.",
                    strengths: ["Fair judgment", "Balanced perspective", "Negotiation", "Objectivity"],
                    growth: ["Trust your instincts", "Practice difficult conversations", "Develop empathy further"],
                    careers: ["Lawyer", "Manager", "Mediator", "Business Analyst", "Consultant"],
                    icon: "🤝"
                },
                low: {
                    title: "The Independent Thinker",
                    description: "You value directness, honesty, and objective decision-making.",
                    strengths: ["Critical thinking", "Independence", "Direct communication", "Objective analysis"],
                    growth: ["Develop empathy", "Practice diplomacy", "Consider others' perspectives"],
                    careers: ["CEO", "Surgeon", "Military Officer", "Investigator", "Critic"],
                    icon: "⚡"
                }
            },
            Openness: {
                high: {
                    title: "The Innovator",
                    description: "You embrace new experiences, ideas, and creative expression.",
                    strengths: ["Creativity", "Curiosity", "Innovation", "Artistic appreciation"],
                    growth: ["Focus on execution", "Develop practical skills", "Complete projects"],
                    careers: ["Researcher", "Designer", "Writer", "Entrepreneur", "Professor"],
                    icon: "🚀"
                },
                medium: {
                    title: "The Practical Explorer",
                    description: "You appreciate both tradition and innovation in balanced measure.",
                    strengths: ["Balanced thinking", "Selective curiosity", "Practical creativity", "Adaptability"],
                    growth: ["Expand comfort zone", "Embrace more risks", "Explore new perspectives"],
                    careers: ["Product Manager", "Marketing", "Teacher", "Architect", "Journalist"],
                    icon: "🧭"
                },
                low: {
                    title: "The Traditionalist",
                    description: "You value proven methods, stability, and practical approaches.",
                    strengths: ["Practicality", "Consistency", "Focus", "Reliability"],
                    growth: ["Try new approaches", "Embrace change gradually", "Explore creative outlets"],
                    careers: ["Accountant", "Administrator", "Banker", "Insurance Agent", "Mechanic"],
                    icon: "🏛️"
                }
            },
            "Emotional Stability": {
                high: {
                    title: "The Steady Rock",
                    description: "You maintain emotional balance and handle stress exceptionally well.",
                    strengths: ["Stress management", "Emotional regulation", "Resilience", "Calm under pressure"],
                    growth: ["Express emotions openly", "Develop deeper empathy", "Acknowledge vulnerabilities"],
                    careers: ["Emergency Medicine", "Air Traffic Controller", "Crisis Manager", "Pilot", "Military"],
                    icon: "🗿"
                },
                medium: {
                    title: "The Emotional Navigator",
                    description: "You experience a healthy range of emotions with good coping strategies.",
                    strengths: ["Emotional awareness", "Balanced responses", "Authentic expression", "Adaptability"],
                    growth: ["Strengthen coping strategies", "Practice mindfulness", "Build resilience"],
                    careers: ["Teacher", "Manager", "Consultant", "Healthcare", "Social Services"],
                    icon: "🌊"
                },
                low: {
                    title: "The Sensitive Soul",
                    description: "You experience emotions deeply and intensely.",
                    strengths: ["Emotional depth", "Empathy", "Passion", "Artistic sensitivity"],
                    growth: ["Develop coping strategies", "Practice self-care", "Build emotional resilience"],
                    careers: ["Artist", "Writer", "Therapist", "Musician", "Actor"],
                    icon: "🌺"
                }
            }
        };

        this.archetypes = {
            "LEADER": {
                name: "The Visionary Leader",
                description: "Natural born leaders who inspire and guide others toward shared goals",
                traits: ["High Extraversion", "High Conscientiousness", "High Emotional Stability"],
                strengths: "Strategic thinking, Team building, Decision making, Crisis management",
                challenges: "May overlook details, Can be overly demanding, Risk of burnout",
                famous: "Steve Jobs, Winston Churchill, Oprah Winfrey"
            },
            "INNOVATOR": {
                name: "The Creative Innovator",
                description: "Original thinkers who challenge conventions and create new possibilities",
                traits: ["High Openness", "Medium Conscientiousness", "Medium Extraversion"],
                strengths: "Creative problem-solving, Vision, Adaptability, Pattern recognition",
                challenges: "May struggle with routine, Can be impractical, Difficulty focusing",
                famous: "Einstein, Da Vinci, Elon Musk"
            },
            "HARMONIZER": {
                name: "The Peaceful Harmonizer",
                description: "Empathetic souls who create harmony and understanding between people",
                traits: ["High Agreeableness", "Medium Emotional Stability", "Medium Extraversion"],
                strengths: "Conflict resolution, Empathy, Team cohesion, Emotional intelligence",
                challenges: "Difficulty with confrontation, May neglect own needs, Can be exploited",
                famous: "Mr. Rogers, Mother Teresa, Dalai Lama"
            },
            "ANALYST": {
                name: "The Logical Analyst",
                description: "Systematic thinkers who excel at understanding complex systems",
                traits: ["High Conscientiousness", "Low Extraversion", "High Emotional Stability"],
                strengths: "Problem analysis, Attention to detail, Objectivity, Deep focus",
                challenges: "May seem detached, Struggle with ambiguity, Perfectionism",
                famous: "Warren Buffett, Bill Gates, Marie Curie"
            },
            "EXPLORER": {
                name: "The Adventurous Explorer",
                description: "Free spirits who seek new experiences and push boundaries",
                traits: ["High Openness", "Low Conscientiousness", "High Extraversion"],
                strengths: "Adaptability, Risk-taking, Enthusiasm, Versatility",
                challenges: "Lack of follow-through, Impulsiveness, Difficulty with routine",
                famous: "Richard Branson, Anthony Bourdain, Amelia Earhart"
            },
            "GUARDIAN": {
                name: "The Reliable Guardian",
                description: "Dependable protectors who maintain stability and tradition",
                traits: ["High Conscientiousness", "High Agreeableness", "Low Openness"],
                strengths: "Reliability, Loyalty, Organization, Duty",
                challenges: "Resistance to change, Rigidity, May miss opportunities",
                famous: "Queen Elizabeth II, George Washington, Tom Hanks"
            }
        };
    }

    generateComprehensiveReport(results, responses, mode, duration) {
        const report = {
            meta: this.generateMeta(mode, duration, responses.length),
            overview: this.generateOverview(results),
            traits: this.generateDetailedTraits(results),
            archetype: this.determineArchetype(results),
            insights: this.generateInsights(results),
            comparisons: this.generateComparisons(results),
            recommendations: this.generateRecommendations(results),
            visualData: this.prepareVisualizationData(results)
        };

        return report;
    }

    generateMeta(mode, duration, responseCount) {
        return {
            date: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
            time: new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            }),
            mode: mode.charAt(0).toUpperCase() + mode.slice(1),
            duration: Math.round(duration / 60000) + ' minutes',
            questions: responseCount,
            reliability: this.calculateReliability(responseCount)
        };
    }

    generateOverview(results) {
        // Find dominant traits
        const sortedTraits = Object.entries(results)
            .sort((a, b) => b[1].score - a[1].score);
        
        const dominant = sortedTraits[0];
        const secondary = sortedTraits[1];
        const lowest = sortedTraits[sortedTraits.length - 1];

        return {
            summary: this.generatePersonalitySummary(dominant, secondary, lowest),
            dominantTrait: dominant[0],
            dominantScore: dominant[1].score,
            profile: this.generateProfileDescription(results)
        };
    }

    generatePersonalitySummary(dominant, secondary, lowest) {
        const templates = [
            `Your personality is characterized by strong ${dominant[0].toLowerCase()} (${dominant[1].score}%), complemented by notable ${secondary[0].toLowerCase()} (${secondary[1].score}%). This unique combination suggests you are someone who ${this.getTraitDescription(dominant[0], dominant[1].raw)}. Your relatively lower ${lowest[0].toLowerCase()} (${lowest[1].score}%) indicates ${this.getContrastDescription(lowest[0], lowest[1].raw)}.`,
            
            `You exhibit a distinctive personality profile with exceptional ${dominant[0].toLowerCase()} at ${dominant[1].score}%, making you naturally inclined toward ${this.getTraitTendency(dominant[0], dominant[1].raw)}. Your ${secondary[0].toLowerCase()} score of ${secondary[1].score}% further enhances your ability to ${this.getTraitAbility(secondary[0], secondary[1].raw)}.`
        ];
        
        return templates[Math.floor(Math.random() * templates.length)];
    }

    getTraitDescription(trait, score) {
        const descriptions = {
            Extraversion: {
                high: "thrives in social environments and energizes others with your enthusiasm",
                medium: "balances social interaction with thoughtful reflection",
                low: "values deep connections and meaningful solitude"
            },
            Conscientiousness: {
                high: "approaches life with discipline, organization, and unwavering determination",
                medium: "maintains flexibility while pursuing your goals",
                low: "embraces spontaneity and creative freedom"
            },
            Agreeableness: {
                high: "naturally creates harmony and builds trust in relationships",
                medium: "balances cooperation with healthy assertiveness",
                low: "values directness and objective decision-making"
            },
            Openness: {
                high: "constantly seeks new experiences and innovative solutions",
                medium: "appreciates both tradition and innovation",
                low: "values proven methods and practical approaches"
            },
            "Emotional Stability": {
                high: "maintains remarkable composure even in challenging situations",
                medium: "navigates emotions with awareness and balance",
                low: "experiences life with emotional depth and intensity"
            }
        };
        
        const level = score > 3.5 ? 'high' : score < 2.5 ? 'low' : 'medium';
        return descriptions[trait]?.[level] || "exhibits unique characteristics";
    }

    getTraitTendency(trait, score) {
        const level = score > 3.5 ? 'high' : score < 2.5 ? 'low' : 'medium';
        return this.traits[trait][level].strengths[0].toLowerCase();
    }

    getTraitAbility(trait, score) {
        const level = score > 3.5 ? 'high' : score < 2.5 ? 'low' : 'medium';
        return this.traits[trait][level].strengths[1].toLowerCase();
    }

    getContrastDescription(trait, score) {
        if (score < 2.5) {
            const highDesc = this.traits[trait].high.description;
            return `you may prefer alternatives to ${highDesc.toLowerCase().split('you ')[1]}`;
        }
        return "a balanced approach in this area";
    }

    generateProfileDescription(results) {
        let profile = "Your complete personality profile reveals ";
        const traits = [];
        
        for (const [trait, data] of Object.entries(results)) {
            const level = data.raw > 3.5 ? 'high' : data.raw < 2.5 ? 'low' : 'moderate';
            traits.push(`${level} ${trait.toLowerCase()}`);
        }
        
        profile += traits.slice(0, -1).join(', ') + ', and ' + traits[traits.length - 1] + '. ';
        profile += "This combination is found in approximately " + this.calculateRarity(results) + "% of the population.";
        
        return profile;
    }

    calculateRarity(results) {
        // Simplified rarity calculation based on extreme scores
        let rarity = 100;
        for (const data of Object.values(results)) {
            if (data.score > 80 || data.score < 20) rarity *= 0.7;
            else if (data.score > 70 || data.score < 30) rarity *= 0.85;
        }
        return Math.max(1, Math.round(rarity));
    }

    generateDetailedTraits(results) {
        const detailed = {};
        
        for (const [trait, data] of Object.entries(results)) {
            const level = data.raw > 3.5 ? 'high' : data.raw < 2.5 ? 'low' : 'medium';
            const traitInfo = this.traits[trait][level];
            
            detailed[trait] = {
                score: data.score,
                percentile: data.percentile,
                level: level,
                title: traitInfo.title,
                description: traitInfo.description,
                icon: traitInfo.icon,
                strengths: traitInfo.strengths,
                growth: traitInfo.growth,
                careers: traitInfo.careers,
                interpretation: data.interpretation,
                comparison: this.generateComparison(data.percentile)
            };
        }
        
        return detailed;
    }

    generateComparison(percentile) {
        if (percentile >= 90) return "You score higher than 90% of people in this trait";
        if (percentile >= 75) return "You score higher than 75% of people in this trait";
        if (percentile >= 60) return "You score above average in this trait";
        if (percentile >= 40) return "You score around average in this trait";
        if (percentile >= 25) return "You score below average in this trait";
        return "You score in the lower range for this trait";
    }

    determineArchetype(results) {
        let bestMatch = null;
        let bestScore = 0;
        
        for (const [key, archetype] of Object.entries(this.archetypes)) {
            let score = 0;
            
            // Calculate match score based on trait alignment
            for (const traitReq of archetype.traits) {
                const [level, traitName] = traitReq.split(' ');
                const actualScore = results[traitName]?.raw || 3;
                
                if (level === 'High' && actualScore > 3.5) score += 1;
                else if (level === 'Medium' && actualScore >= 2.5 && actualScore <= 3.5) score += 1;
                else if (level === 'Low' && actualScore < 2.5) score += 1;
            }
            
            if (score > bestScore) {
                bestScore = score;
                bestMatch = { ...archetype, matchScore: Math.round((score / archetype.traits.length) * 100) };
            }
        }
        
        return bestMatch;
    }

    generateInsights(results) {
        return {
            strengths: this.identifyTopStrengths(results),
            growth: this.identifyGrowthAreas(results),
            career: this.generateCareerInsights(results),
            relationships: this.generateRelationshipInsights(results),
            communication: this.generateCommunicationStyle(results),
            leadership: this.generateLeadershipStyle(results),
            stress: this.generateStressProfile(results),
            motivation: this.generateMotivationProfile(results)
        };
    }

    identifyTopStrengths(results) {
        const strengths = [];
        
        for (const [trait, data] of Object.entries(results)) {
            if (data.score > 70) {
                const level = data.raw > 3.5 ? 'high' : 'medium';
                strengths.push(...this.traits[trait][level].strengths.slice(0, 2));
            }
        }
        
        return [...new Set(strengths)].slice(0, 5);
    }

    identifyGrowthAreas(results) {
        const growth = [];
        
        for (const [trait, data] of Object.entries(results)) {
            const level = data.raw > 3.5 ? 'high' : data.raw < 2.5 ? 'low' : 'medium';
            growth.push(...this.traits[trait][level].growth.slice(0, 1));
        }
        
        return [...new Set(growth)].slice(0, 3);
    }

    generateCareerInsights(results) {
        const careers = new Set();
        const traits = [];
        
        for (const [trait, data] of Object.entries(results)) {
            const level = data.raw > 3.5 ? 'high' : data.raw < 2.5 ? 'low' : 'medium';
            this.traits[trait][level].careers.forEach(career => careers.add(career));
            
            if (data.score > 60) {
                traits.push(trait.toLowerCase());
            }
        }
        
        return {
            suitable: Array.from(careers).slice(0, 8),
            strengths: `Your combination of ${traits.join(' and ')} makes you well-suited for roles that require ${this.getCareerRequirements(results)}.`,
            environment: this.getIdealWorkEnvironment(results)
        };
    }

    getCareerRequirements(results) {
        const reqs = [];
        
        if (results.Extraversion?.score > 60) reqs.push("interpersonal interaction");
        if (results.Conscientiousness?.score > 60) reqs.push("organization and planning");
        if (results.Openness?.score > 60) reqs.push("creativity and innovation");
        if (results.Agreeableness?.score > 60) reqs.push("collaboration and empathy");
        if (results["Emotional Stability"]?.score > 60) reqs.push("stress management");
        
        return reqs.join(", ") || "balanced skills";
    }

    getIdealWorkEnvironment(results) {
        const envs = [];
        
        if (results.Extraversion?.raw > 3.5) {
            envs.push("collaborative open spaces");
        } else if (results.Extraversion?.raw < 2.5) {
            envs.push("quiet, private workspace");
        }
        
        if (results.Conscientiousness?.raw > 3.5) {
            envs.push("structured with clear expectations");
        } else if (results.Conscientiousness?.raw < 2.5) {
            envs.push("flexible and autonomous");
        }
        
        if (results.Openness?.raw > 3.5) {
            envs.push("innovative and dynamic");
        }
        
        return "You thrive in environments that are " + (envs.join(", ") || "balanced and adaptable");
    }

    generateRelationshipInsights(results) {
        return {
            style: this.getRelationshipStyle(results),
            strengths: this.getRelationshipStrengths(results),
            needs: this.getRelationshipNeeds(results),
            compatibility: this.getCompatibilityInsights(results)
        };
    }

    getRelationshipStyle(results) {
        const e = results.Extraversion?.raw || 3;
        const a = results.Agreeableness?.raw || 3;
        
        if (e > 3.5 && a > 3.5) return "Warm and engaging - you build connections easily and maintain them with care";
        if (e > 3.5 && a < 2.5) return "Direct and independent - you value honesty and maintain clear boundaries";
        if (e < 2.5 && a > 3.5) return "Supportive and loyal - you form deep, meaningful connections with select individuals";
        if (e < 2.5 && a < 2.5) return "Reserved and selective - you value quality over quantity in relationships";
        return "Balanced and adaptive - you adjust your approach based on the situation and person";
    }

    getRelationshipStrengths(results) {
        const strengths = [];
        
        if (results.Agreeableness?.raw > 3.5) strengths.push("empathy", "conflict resolution");
        if (results.Conscientiousness?.raw > 3.5) strengths.push("reliability", "commitment");
        if (results.Openness?.raw > 3.5) strengths.push("open communication", "growth mindset");
        if (results["Emotional Stability"]?.raw > 3.5) strengths.push("emotional support", "stability");
        if (results.Extraversion?.raw > 3.5) strengths.push("social energy", "enthusiasm");
        
        return strengths.slice(0, 4);
    }

    getRelationshipNeeds(results) {
        const needs = [];
        
        if (results.Extraversion?.raw > 3.5) needs.push("regular social interaction");
        else if (results.Extraversion?.raw < 2.5) needs.push("personal space and alone time");
        
        if (results.Agreeableness?.raw > 3.5) needs.push("harmony and appreciation");
        if (results.Conscientiousness?.raw > 3.5) needs.push("reliability and follow-through");
        if (results.Openness?.raw > 3.5) needs.push("intellectual stimulation");
        if (results["Emotional Stability"]?.raw < 2.5) needs.push("patience and understanding");
        
        return needs.slice(0, 3);
    }

    getCompatibilityInsights(results) {
        return "You connect best with people who " + this.getCompatibilityTraits(results);
    }

    getCompatibilityTraits(results) {
        const traits = [];
        
        if (results.Openness?.raw > 3.5) {
            traits.push("share your curiosity and love of learning");
        }
        if (results.Conscientiousness?.raw > 3.5) {
            traits.push("value commitment and reliability");
        }
        if (results.Agreeableness?.raw < 2.5) {
            traits.push("appreciate directness and independence");
        }
        
        return traits.join(", ") || "complement your balanced approach to life";
    }

    generateCommunicationStyle(results) {
        const e = results.Extraversion?.raw || 3;
        const a = results.Agreeableness?.raw || 3;
        const o = results.Openness?.raw || 3;
        
        let style = "";
        
        if (e > 3.5) style += "Expressive and engaging. ";
        else if (e < 2.5) style += "Thoughtful and measured. ";
        else style += "Balanced and adaptive. ";
        
        if (a > 3.5) style += "You prioritize harmony and understanding. ";
        else if (a < 2.5) style += "You value directness and clarity. ";
        
        if (o > 3.5) style += "You enjoy exploring ideas and possibilities.";
        else if (o < 2.5) style += "You prefer practical, concrete discussions.";
        
        return style;
    }

    generateLeadershipStyle(results) {
        const c = results.Conscientiousness?.raw || 3;
        const e = results.Extraversion?.raw || 3;
        const a = results.Agreeableness?.raw || 3;
        
        if (e > 3.5 && c > 3.5) return "Charismatic and organized - you inspire through vision and execution";
        if (e < 2.5 && c > 3.5) return "Leading by example - you demonstrate excellence through your work";
        if (a > 3.5 && e > 3.5) return "Servant leadership - you empower others and build consensus";
        if (c > 3.5 && a < 2.5) return "Results-driven - you focus on objectives and performance";
        return "Situational leadership - you adapt your style to meet team needs";
    }

    generateStressProfile(results) {
        const stability = results["Emotional Stability"]?.raw || 3;
        const conscientiousness = results.Conscientiousness?.raw || 3;
        
        return {
            triggers: this.getStressTriggers(results),
            responses: this.getStressResponses(stability),
            copingStrategies: this.getCopingStrategies(results)
        };
    }

    getStressTriggers(results) {
        const triggers = [];
        
        if (results.Conscientiousness?.raw > 3.5) triggers.push("disorganization", "missed deadlines");
        if (results.Agreeableness?.raw > 3.5) triggers.push("conflict", "criticism");
        if (results.Openness?.raw < 2.5) triggers.push("unexpected changes", "ambiguity");
        if (results.Extraversion?.raw < 2.5) triggers.push("overstimulation", "forced social interaction");
        
        return triggers.slice(0, 3);
    }

    getStressResponses(stability) {
        if (stability > 3.5) return "You typically remain calm and focused under pressure";
        if (stability < 2.5) return "You may experience intense emotional responses to stress";
        return "You have moderate stress responses with good recovery";
    }

    getCopingStrategies(results) {
        const strategies = [];
        
        if (results.Extraversion?.raw > 3.5) strategies.push("Talk with friends", "Social activities");
        else strategies.push("Quiet reflection", "Solo activities");
        
        if (results.Conscientiousness?.raw > 3.5) strategies.push("Planning and organizing", "Problem-solving");
        if (results.Openness?.raw > 3.5) strategies.push("Creative expression", "Learning new skills");
        if (results["Emotional Stability"]?.raw > 3.5) strategies.push("Physical exercise", "Mindfulness");
        
        return strategies.slice(0, 4);
    }

    generateMotivationProfile(results) {
        const motivators = [];
        
        if (results.Conscientiousness?.raw > 3.5) motivators.push("Achievement and recognition");
        if (results.Agreeableness?.raw > 3.5) motivators.push("Helping others succeed");
        if (results.Openness?.raw > 3.5) motivators.push("Learning and discovery");
        if (results.Extraversion?.raw > 3.5) motivators.push("Social connection and collaboration");
        if (results["Emotional Stability"]?.raw > 3.5) motivators.push("Challenge and growth");
        
        return {
            primary: motivators.slice(0, 2),
            description: `You are primarily motivated by ${motivators.slice(0, 2).join(' and ').toLowerCase()}. You find fulfillment when ${this.getMotivationContext(results)}.`
        };
    }

    getMotivationContext(results) {
        const contexts = [];
        
        if (results.Conscientiousness?.raw > 3.5) contexts.push("achieving your goals");
        if (results.Agreeableness?.raw > 3.5) contexts.push("making a positive impact");
        if (results.Openness?.raw > 3.5) contexts.push("exploring new possibilities");
        
        return contexts.join(" and ") || "pursuing meaningful work";
    }

    generateComparisons(results) {
        // Generate population comparisons
        const comparisons = {};
        
        for (const [trait, data] of Object.entries(results)) {
            comparisons[trait] = {
                score: data.score,
                percentile: data.percentile,
                population: this.getPopulationComparison(data.percentile),
                similar: this.getSimilarProfiles(trait, data.score)
            };
        }
        
        return comparisons;
    }

    getPopulationComparison(percentile) {
        if (percentile >= 95) return "Top 5% of population";
        if (percentile >= 90) return "Top 10% of population";
        if (percentile >= 75) return "Upper quartile";
        if (percentile >= 60) return "Above average";
        if (percentile >= 40) return "Average range";
        if (percentile >= 25) return "Below average";
        if (percentile >= 10) return "Lower quartile";
        return "Unique profile";
    }

    getSimilarProfiles(trait, score) {
        // Return famous personalities or professions with similar trait levels
        const profiles = {
            high: ["Leaders", "Innovators", "Performers"],
            medium: ["Managers", "Educators", "Consultants"],
            low: ["Researchers", "Artists", "Analysts"]
        };
        
        const level = score > 70 ? 'high' : score < 30 ? 'low' : 'medium';
        return profiles[level];
    }

    generateRecommendations(results) {
        return {
            books: this.recommendBooks(results),
            activities: this.recommendActivities(results),
            skills: this.recommendSkills(results),
            mindfulness: this.recommendMindfulness(results),
            goals: this.generateGoals(results)
        };
    }

    recommendBooks(results) {
        const books = [];
        
        if (results.Openness?.raw > 3.5) {
            books.push("'Sapiens' by Yuval Noah Harari", "'Thinking, Fast and Slow' by Daniel Kahneman");
        }
        if (results.Conscientiousness?.raw > 3.5) {
            books.push("'Atomic Habits' by James Clear", "'Deep Work' by Cal Newport");
        }
        if (results.Agreeableness?.raw > 3.5) {
            books.push("'Nonviolent Communication' by Marshall Rosenberg");
        }
        if (results["Emotional Stability"]?.raw < 2.5) {
            books.push("'The Power of Now' by Eckhart Tolle");
        }
        
        return books.slice(0, 3);
    }

    recommendActivities(results) {
        const activities = [];
        
        if (results.Extraversion?.raw > 3.5) {
            activities.push("Join networking groups", "Attend social events", "Team sports");
        } else {
            activities.push("Solo hiking", "Reading clubs", "Creative writing");
        }
        
        if (results.Openness?.raw > 3.5) {
            activities.push("Travel to new places", "Learn a new language", "Art classes");
        }
        
        if (results.Conscientiousness?.raw < 2.5) {
            activities.push("Improv classes", "Spontaneous adventures");
        }
        
        return activities.slice(0, 4);
    }

    recommendSkills(results) {
        const skills = [];
        
        // Recommend skills that complement existing traits or address growth areas
        for (const [trait, data] of Object.entries(results)) {
            if (data.raw < 2.5) {
                // Recommend skills to balance low traits
                switch(trait) {
                    case 'Extraversion':
                        skills.push("Public speaking", "Networking");
                        break;
                    case 'Conscientiousness':
                        skills.push("Time management", "Goal setting");
                        break;
                    case 'Agreeableness':
                        skills.push("Empathy training", "Active listening");
                        break;
                    case 'Openness':
                        skills.push("Creative thinking", "Adaptability");
                        break;
                    case 'Emotional Stability':
                        skills.push("Stress management", "Emotional regulation");
                        break;
                }
            }
        }
        
        return skills.slice(0, 3);
    }

    recommendMindfulness(results) {
        const practices = [];
        
        if (results["Emotional Stability"]?.raw < 3) {
            practices.push("Daily meditation", "Breathing exercises");
        }
        if (results.Conscientiousness?.raw > 3.5) {
            practices.push("Structured mindfulness routine");
        } else {
            practices.push("Informal mindfulness moments");
        }
        if (results.Openness?.raw > 3.5) {
            practices.push("Walking meditation", "Body scan");
        }
        
        return practices.slice(0, 3);
    }

    generateGoals(results) {
        const goals = {
            shortTerm: [],
            longTerm: []
        };
        
        // Generate personalized goals based on profile
        for (const [trait, data] of Object.entries(results)) {
            const level = data.raw > 3.5 ? 'high' : data.raw < 2.5 ? 'low' : 'medium';
            const traitInfo = this.traits[trait][level];
            
            if (traitInfo.growth && traitInfo.growth.length > 0) {
                goals.shortTerm.push(traitInfo.growth[0]);
            }
        }
        
        // Add long-term goals based on archetype
        const archetype = this.determineArchetype(results);
        if (archetype) {
            goals.longTerm.push(
                `Develop your ${archetype.name} potential`,
                `Build on your natural ${archetype.strengths.split(',')[0].toLowerCase()}`
            );
        }
        
        return {
            shortTerm: goals.shortTerm.slice(0, 3),
            longTerm: goals.longTerm.slice(0, 2)
        };
    }

    prepareVisualizationData(results) {
        // Prepare data for charts
        return {
            radar: {
                labels: Object.keys(results),
                data: Object.values(results).map(r => r.score)
            },
            bars: Object.entries(results).map(([trait, data]) => ({
                trait,
                score: data.score,
                percentile: data.percentile
            })),
            distribution: this.generateDistribution(results)
        };
    }

    generateDistribution(results) {
        // Generate a distribution curve for each trait
        const distribution = {};
        
        for (const [trait, data] of Object.entries(results)) {
            distribution[trait] = {
                userScore: data.score,
                mean: 50,
                stdDev: 15,
                percentile: data.percentile
            };
        }
        
        return distribution;
    }

    calculateReliability(responseCount) {
        // Calculate test reliability based on response count
        if (responseCount >= 30) return "Excellent";
        if (responseCount >= 20) return "Good";
        if (responseCount >= 10) return "Moderate";
        return "Basic";
    }
}

export default ReportGenerator;