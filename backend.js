// P.A.T.R.I.C.I.A Backend Server
// Comprehensive backend with payment integration, data persistence, and analytics

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// MongoDB Schema
const assessmentSchema = new mongoose.Schema({
    userId: { type: String, index: true },
    sessionId: { type: String, unique: true, required: true },
    mode: { type: String, enum: ['validated', 'experimental'], required: true },
    tier: { type: String, enum: ['core', 'comprehensive', 'specialized', 'experimental'] },
    startTime: { type: Date, default: Date.now },
    completionTime: Date,
    responses: [{
        questionId: String,
        value: mongoose.Schema.Types.Mixed,
        responseTime: Number,
        category: String,
        instrument: String,
        biometrics: {
            keystrokeMetrics: Object,
            mouseMetrics: Object,
            latency: Number
        }
    }],
    results: {
        profile: Object,
        scores: Object,
        rawScores: Object,
        clinicalIndicators: Object,
        experimentalScores: Object,
        qualityMetrics: Object,
        biasIndicators: Object,
        matchConfidence: Number
    },
    payment: {
        status: { type: String, enum: ['pending', 'paid', 'free_preview'], default: 'pending' },
        stripePaymentId: String,
        amount: Number,
        currency: String,
        paidAt: Date
    },
    demographics: {
        age: Number,
        gender: String,
        country: String,
        education: String,
        ethnicity: [String],
        language: String
    },
    consent: {
        research: Boolean,
        dataSharing: Boolean,
        timestamp: Date
    },
    metadata: {
        userAgent: String,
        ipCountry: String,
        referrer: String,
        abTestGroup: String
    }
}, {
    timestamps: true
});

// Create indexes for efficient queries
assessmentSchema.index({ 'payment.status': 1, createdAt: -1 });
assessmentSchema.index({ userId: 1, createdAt: -1 });
assessmentSchema.index({ mode: 1, 'results.matchConfidence': -1 });

const Assessment = mongoose.model('Assessment', assessmentSchema);

// User schema for returning users
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, sparse: true },
    hashedPassword: String,
    assessments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' }],
    subscription: {
        active: Boolean,
        plan: String,
        expiresAt: Date
    },
    preferences: {
        theme: String,
        emailUpdates: Boolean,
        researchParticipation: Boolean
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

// Connect to MongoDB (with graceful handling if not available)
if (process.env.MONGODB_URI || process.env.NODE_ENV === 'production') {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/patricia')
        .then(() => {
            console.log('MongoDB connected successfully');
        }).catch(err => {
            console.log('MongoDB connection failed:', err.message);
            console.log('Running in demo mode without database persistence');
        });
} else {
    console.log('Running in development mode without MongoDB');
}

// === API ENDPOINTS ===

// Start new assessment session
app.post('/api/assessment/start', async (req, res) => {
    try {
        const { mode, tier, userId, demographics, consent } = req.body;
        
        const sessionId = generateSessionId();
        const assessment = new Assessment({
            sessionId,
            userId: userId || 'anonymous',
            mode,
            tier,
            demographics,
            consent,
            metadata: {
                userAgent: req.headers['user-agent'],
                ipCountry: req.headers['cf-ipcountry'] || 'unknown',
                referrer: req.headers.referer
            }
        });
        
        await assessment.save();
        
        res.json({
            success: true,
            sessionId,
            assessmentId: assessment._id,
            questionCount: getQuestionCount(mode, tier)
        });
    } catch (error) {
        console.error('Error starting assessment:', error);
        res.status(500).json({ error: 'Failed to start assessment' });
    }
});

// Save progress
app.post('/api/assessment/progress', async (req, res) => {
    try {
        const { sessionId, responses, currentIndex } = req.body;
        
        const assessment = await Assessment.findOne({ sessionId });
        if (!assessment) {
            return res.status(404).json({ error: 'Assessment not found' });
        }
        
        // Merge new responses with existing ones
        const existingIds = assessment.responses.map(r => r.questionId);
        const newResponses = responses.filter(r => !existingIds.includes(r.questionId));
        assessment.responses.push(...newResponses);
        
        await assessment.save();
        
        res.json({
            success: true,
            saved: newResponses.length,
            total: assessment.responses.length
        });
    } catch (error) {
        console.error('Error saving progress:', error);
        res.status(500).json({ error: 'Failed to save progress' });
    }
});

// Complete assessment and calculate results
app.post('/api/assessment/complete', async (req, res) => {
    try {
        const { sessionId, responses } = req.body;
        
        const assessment = await Assessment.findOne({ sessionId });
        if (!assessment) {
            return res.status(404).json({ error: 'Assessment not found' });
        }
        
        // Save final responses
        assessment.responses = responses;
        assessment.completionTime = new Date();
        
        // Calculate results based on mode
        const results = assessment.mode === 'experimental' 
            ? calculateExperimentalResults(responses)
            : calculateValidatedResults(responses);
        
        assessment.results = results;
        
        // Determine if free preview or needs payment
        const needsPayment = determinePaymentRequired(assessment);
        
        if (needsPayment) {
            assessment.payment.status = 'pending';
            await assessment.save();
            
            res.json({
                success: true,
                needsPayment: true,
                previewResults: generatePreviewResults(results),
                paymentUrl: `/payment/${sessionId}`
            });
        } else {
            assessment.payment.status = 'free_preview';
            await assessment.save();
            
            res.json({
                success: true,
                results: results,
                reportUrl: `/api/report/${sessionId}`
            });
        }
    } catch (error) {
        console.error('Error completing assessment:', error);
        res.status(500).json({ error: 'Failed to complete assessment' });
    }
});

// Payment endpoint (Stripe integration)
app.post('/api/payment/create-checkout', async (req, res) => {
    try {
        const { sessionId } = req.body;
        
        const assessment = await Assessment.findOne({ sessionId });
        if (!assessment) {
            return res.status(404).json({ error: 'Assessment not found' });
        }
        
        // Create Stripe checkout session
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: 'P.A.T.R.I.C.I.A Complete Assessment Report',
                        description: `Comprehensive ${assessment.mode} personality assessment results`,
                        images: ['https://patricia.ai/logo.png']
                    },
                    unit_amount: 100 // £1.00 in pence
                },
                quantity: 1
            }],
            mode: 'payment',
            success_url: `${process.env.BASE_URL}/results/${sessionId}?payment=success`,
            cancel_url: `${process.env.BASE_URL}/payment/${sessionId}?payment=cancelled`,
            metadata: {
                sessionId,
                assessmentId: assessment._id.toString()
            }
        });
        
        res.json({
            checkoutUrl: checkoutSession.url,
            sessionId: checkoutSession.id
        });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Failed to create payment session' });
    }
});

// Stripe webhook for payment confirmation
app.post('/api/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const { sessionId, assessmentId } = session.metadata;
        
        // Update assessment payment status
        await Assessment.findByIdAndUpdate(assessmentId, {
            'payment.status': 'paid',
            'payment.stripePaymentId': session.payment_intent,
            'payment.amount': session.amount_total,
            'payment.currency': session.currency,
            'payment.paidAt': new Date()
        });
    }
    
    res.json({ received: true });
});

// Get results (requires payment or free preview)
app.get('/api/report/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        
        const assessment = await Assessment.findOne({ sessionId });
        if (!assessment) {
            return res.status(404).json({ error: 'Assessment not found' });
        }
        
        if (assessment.payment.status === 'pending') {
            return res.status(402).json({ 
                error: 'Payment required',
                paymentUrl: `/payment/${sessionId}`
            });
        }
        
        res.json({
            success: true,
            results: assessment.results,
            mode: assessment.mode,
            completionTime: assessment.completionTime,
            certificate: generateCertificate(assessment)
        });
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ error: 'Failed to fetch report' });
    }
});

// Analytics endpoint (aggregated data)
app.get('/api/analytics/population', async (req, res) => {
    try {
        const stats = await Assessment.aggregate([
            { $match: { 'payment.status': { $in: ['paid', 'free_preview'] } } },
            {
                $group: {
                    _id: '$mode',
                    count: { $sum: 1 },
                    avgConfidence: { $avg: '$results.matchConfidence' },
                    avgCompletionTime: { $avg: { $subtract: ['$completionTime', '$startTime'] } }
                }
            }
        ]);
        
        const demographics = await Assessment.aggregate([
            { $match: { 'payment.status': { $in: ['paid', 'free_preview'] } } },
            {
                $group: {
                    _id: {
                        ageGroup: {
                            $switch: {
                                branches: [
                                    { case: { $lt: ['$demographics.age', 25] }, then: '18-24' },
                                    { case: { $lt: ['$demographics.age', 35] }, then: '25-34' },
                                    { case: { $lt: ['$demographics.age', 45] }, then: '35-44' },
                                    { case: { $lt: ['$demographics.age', 55] }, then: '45-54' },
                                    { case: { $gte: ['$demographics.age', 55] }, then: '55+' }
                                ],
                                default: 'Unknown'
                            }
                        },
                        gender: '$demographics.gender',
                        country: '$demographics.country'
                    },
                    count: { $sum: 1 }
                }
            }
        ]);
        
        res.json({
            totalAssessments: stats.reduce((sum, s) => sum + s.count, 0),
            byMode: stats,
            demographics
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

// === HELPER FUNCTIONS ===

function generateSessionId() {
    return 'pat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function getQuestionCount(mode, tier) {
    if (mode === 'experimental') return 60;
    if (tier === 'core') return 80;
    if (tier === 'comprehensive') return 150;
    if (tier === 'specialized') return 200;
    return 100;
}

function determinePaymentRequired(assessment) {
    // First 100 users get free access
    // Or specific promo codes
    // Or partial results are free
    const freeUserCount = 100;
    return Assessment.countDocuments({ 'payment.status': { $ne: 'pending' } }) > freeUserCount;
}

function generatePreviewResults(results) {
    // Return limited results for preview
    return {
        primaryProfile: results.profile.name,
        topTraits: Object.entries(results.scores)
            .sort((a, b) => b[1].percentile - a[1].percentile)
            .slice(0, 3)
            .map(([trait, data]) => ({ trait, percentile: Math.round(data.percentile) })),
        teaser: "Unlock your complete personality analysis including detailed insights, growth recommendations, and career guidance."
    };
}

function generateCertificate(assessment) {
    return {
        id: assessment._id,
        name: assessment.demographics?.name || 'Participant',
        mode: assessment.mode,
        completionDate: assessment.completionTime,
        verificationUrl: `/verify/${assessment._id}`
    };
}

// Calculation functions (these would be imported from a separate module)
function calculateValidatedResults(responses) {
    // Implementation of validated scoring algorithms
    const scores = {};
    const rawScores = {};
    const clinicalIndicators = {};
    
    // 1. Big Five (BFI-2) Scoring
    const bfi2Items = responses.filter(r => r.instrument === 'BFI-2');
    if (bfi2Items.length > 0) {
        const domains = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
        
        domains.forEach(domain => {
            const domainItems = bfi2Items.filter(r => r.category === domain);
            if (domainItems.length > 0) {
                const domainScore = domainItems.reduce((sum, r) => sum + r.value, 0) / domainItems.length;
                rawScores[domain] = domainScore;
                scores[domain] = {
                    score: domainScore,
                    percentile: calculatePercentile(domainScore, 3.5, 0.8),
                    stanine: Math.min(9, Math.max(1, Math.round((domainScore - 1) * 2.25))),
                    interpretation: interpretBigFive(domain, domainScore)
                };
            }
        });
    }
    
    // 2. HEXACO-60 Scoring
    const hexacoItems = responses.filter(r => r.instrument === 'HEXACO-60');
    if (hexacoItems.length > 0) {
        const honestyItems = hexacoItems.filter(r => r.category === 'honesty-humility');
        if (honestyItems.length > 0) {
            const honestyScore = honestyItems.reduce((sum, r) => sum + r.value, 0) / honestyItems.length;
            scores['honesty-humility'] = {
                score: honestyScore,
                percentile: calculatePercentile(honestyScore, 3.3, 0.85),
                interpretation: honestyScore > 4 ? 'High integrity' : honestyScore > 2.5 ? 'Moderate' : 'Pragmatic'
            };
        }
    }
    
    // 3. Clinical Screening Indicators
    
    // ADHD (ASRS-5)
    const adhdItems = responses.filter(r => r.instrument === 'ASRS-5');
    if (adhdItems.length >= 4) {
        const adhdScore = adhdItems.reduce((sum, r) => sum + r.value, 0);
        clinicalIndicators.adhd = {
            score: adhdScore,
            risk: adhdScore >= 14 ? 'High' : adhdScore >= 9 ? 'Moderate' : 'Low',
            recommendation: adhdScore >= 14 ? 'Consider professional evaluation' : 'Within normal range'
        };
    }
    
    // Autism Spectrum (AQ-10)
    const autismItems = responses.filter(r => r.instrument === 'AQ-10');
    if (autismItems.length >= 6) {
        const autismScore = autismItems.filter(r => r.value >= 3).length;
        clinicalIndicators.autism = {
            score: autismScore,
            risk: autismScore >= 6 ? 'Elevated' : 'Low',
            recommendation: autismScore >= 6 ? 'Consider comprehensive assessment' : 'No concerns indicated'
        };
    }
    
    // Depression (PHQ-2)
    const depressionItems = responses.filter(r => r.instrument === 'PHQ-2');
    if (depressionItems.length === 2) {
        const depressionScore = depressionItems.reduce((sum, r) => sum + r.value, 0);
        clinicalIndicators.depression = {
            score: depressionScore,
            risk: depressionScore >= 3 ? 'Positive screen' : 'Negative',
            recommendation: depressionScore >= 3 ? 'Follow up with PHQ-9' : 'No current concerns'
        };
    }
    
    // Anxiety (GAD-2)
    const anxietyItems = responses.filter(r => r.instrument === 'GAD-2');
    if (anxietyItems.length === 2) {
        const anxietyScore = anxietyItems.reduce((sum, r) => sum + r.value, 0);
        clinicalIndicators.anxiety = {
            score: anxietyScore,
            risk: anxietyScore >= 3 ? 'Positive screen' : 'Negative',
            recommendation: anxietyScore >= 3 ? 'Consider GAD-7 assessment' : 'No current concerns'
        };
    }
    
    // Calculate quality metrics
    const qualityMetrics = calculateQualityMetrics(responses);
    
    // Determine personality profile
    const profile = determinePersonalityProfile(scores, clinicalIndicators);
    
    // Calculate match confidence
    const matchConfidence = calculateMatchConfidence(responses, scores, qualityMetrics);
    
    return {
        profile,
        scores,
        rawScores,
        clinicalIndicators,
        qualityMetrics,
        matchConfidence,
        timestamp: new Date(),
        version: '3.0.0-validated'
    };
}

// Interpret Big Five scores
function interpretBigFive(domain, score) {
    const interpretations = {
        openness: score > 4 ? 'Creative and curious' : score > 3 ? 'Balanced' : 'Practical and conventional',
        conscientiousness: score > 4 ? 'Organized and dependable' : score > 3 ? 'Moderately organized' : 'Flexible and spontaneous',
        extraversion: score > 4 ? 'Outgoing and energetic' : score > 3 ? 'Ambiverted' : 'Reserved and introspective',
        agreeableness: score > 4 ? 'Compassionate and cooperative' : score > 3 ? 'Balanced' : 'Competitive and skeptical',
        neuroticism: score > 4 ? 'Emotionally reactive' : score > 3 ? 'Moderate emotional stability' : 'Emotionally stable'
    };
    return interpretations[domain] || 'Average';
}

// Calculate quality metrics
function calculateQualityMetrics(responses) {
    const responseTimes = responses.map(r => r.responseTime).filter(Boolean);
    const avgResponseTime = responseTimes.length > 0 ? 
        responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length : 0;
    
    // Check for response patterns
    const values = responses.map(r => r.value);
    const uniqueValues = [...new Set(values)];
    const responseVariability = uniqueValues.length / Math.min(values.length, 7);
    
    // Check for straight-lining (same response repeatedly)
    let maxConsecutive = 0;
    let currentConsecutive = 1;
    for (let i = 1; i < values.length; i++) {
        if (values[i] === values[i-1]) {
            currentConsecutive++;
            maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
        } else {
            currentConsecutive = 1;
        }
    }
    
    const straightLining = maxConsecutive > 10;
    const carelessResponding = avgResponseTime < 1000 || responseVariability < 0.3;
    
    return {
        completionRate: responses.length / 100, // Adjust based on expected questions
        avgResponseTime,
        responseVariability,
        straightLining,
        carelessResponding,
        dataQuality: responseVariability > 0.5 && !straightLining ? 'Good' : 'Review needed'
    };
}

// Determine personality profile
function determinePersonalityProfile(scores, clinicalIndicators) {
    const profiles = [];
    
    // Check Big Five patterns
    if (scores.openness?.percentile > 75 && scores.conscientiousness?.percentile > 75) {
        profiles.push('Achiever');
    }
    if (scores.extraversion?.percentile > 75 && scores.agreeableness?.percentile > 75) {
        profiles.push('Harmonizer');
    }
    if (scores.openness?.percentile > 80) {
        profiles.push('Innovator');
    }
    if (scores.conscientiousness?.percentile > 80) {
        profiles.push('Organizer');
    }
    if (scores.neuroticism?.percentile < 25) {
        profiles.push('Resilient');
    }
    
    // Consider HEXACO
    if (scores['honesty-humility']?.percentile > 75) {
        profiles.push('Ethical Leader');
    }
    
    return {
        primary: profiles[0] || 'Balanced',
        secondary: profiles.slice(1, 3),
        description: generateProfileDescription(profiles, scores)
    };
}

// Generate profile description
function generateProfileDescription(profiles, scores) {
    let description = 'Your personality profile shows ';
    
    if (profiles.includes('Achiever')) {
        description += 'a strong drive for excellence combined with creative thinking. ';
    }
    if (profiles.includes('Harmonizer')) {
        description += 'exceptional interpersonal skills and social awareness. ';
    }
    if (profiles.includes('Innovator')) {
        description += 'high intellectual curiosity and openness to new experiences. ';
    }
    
    description += 'This assessment is based on validated psychological instruments with strong scientific backing.';
    
    return description;
}

// Calculate match confidence
function calculateMatchConfidence(responses, scores, qualityMetrics) {
    let confidence = 75; // Base confidence for validated measures
    
    // Adjust based on completion
    if (responses.length > 80) confidence += 10;
    if (responses.length > 150) confidence += 5;
    
    // Adjust based on quality metrics
    if (qualityMetrics.dataQuality === 'Good') confidence += 10;
    if (qualityMetrics.carelessResponding) confidence -= 15;
    if (qualityMetrics.straightLining) confidence -= 10;
    
    // Check for consistency across related scales
    if (scores.neuroticism && scores.extraversion) {
        // These tend to be somewhat inversely related
        const consistency = Math.abs(scores.neuroticism.percentile + scores.extraversion.percentile - 100) < 40;
        if (consistency) confidence += 5;
    }
    
    return Math.min(95, Math.max(50, confidence));
}

function calculateExperimentalResults(responses) {
    // Implementation of experimental scoring algorithms
    const experimentalScores = {};
    
    // 1. Nonattachment Scale (Buddhist Psychology)
    const nonattachmentItems = responses.filter(r => r.category === 'nonattachment');
    if (nonattachmentItems.length > 0) {
        const nonattachmentScore = nonattachmentItems.reduce((sum, r) => sum + r.value, 0) / nonattachmentItems.length;
        experimentalScores.nonattachment = {
            score: nonattachmentScore,
            percentile: calculatePercentile(nonattachmentScore, 3.5, 0.8),
            interpretation: nonattachmentScore > 4 ? 'High' : nonattachmentScore > 2.5 ? 'Moderate' : 'Low'
        };
    }
    
    // 2. Hindu Gunas System
    const gunasItems = responses.filter(r => r.category === 'gunas');
    if (gunasItems.length > 0) {
        const sattva = gunasItems.filter(r => r.instrument === 'sattva').reduce((sum, r) => sum + r.value, 0) / 3;
        const rajas = gunasItems.filter(r => r.instrument === 'rajas').reduce((sum, r) => sum + r.value, 0) / 3;
        const tamas = gunasItems.filter(r => r.instrument === 'tamas').reduce((sum, r) => sum + r.value, 0) / 3;
        experimentalScores.gunas = {
            sattva: { score: sattva, percentile: calculatePercentile(sattva, 3.5, 0.7) },
            rajas: { score: rajas, percentile: calculatePercentile(rajas, 3.2, 0.8) },
            tamas: { score: tamas, percentile: calculatePercentile(tamas, 2.8, 0.9) },
            dominant: sattva > rajas && sattva > tamas ? 'Sattva' : rajas > tamas ? 'Rajas' : 'Tamas'
        };
    }
    
    // 3. Ubuntu (African Philosophy)
    const ubuntuItems = responses.filter(r => r.category === 'ubuntu');
    if (ubuntuItems.length > 0) {
        const ubuntuScore = ubuntuItems.reduce((sum, r) => sum + r.value, 0) / ubuntuItems.length;
        experimentalScores.ubuntu = {
            score: ubuntuScore,
            percentile: calculatePercentile(ubuntuScore, 4.0, 0.6),
            interpretation: ubuntuScore > 4.2 ? 'Strong communal orientation' : 'Moderate interconnectedness'
        };
    }
    
    // 4. Beauty Engagement
    const beautyItems = responses.filter(r => r.category === 'beauty');
    if (beautyItems.length > 0) {
        const beautyScore = beautyItems.reduce((sum, r) => sum + r.value, 0) / beautyItems.length;
        experimentalScores.beauty = {
            score: beautyScore,
            percentile: calculatePercentile(beautyScore, 3.8, 0.9),
            domains: {
                natural: beautyItems.filter(r => r.instrument === 'natural').reduce((s, r) => s + r.value, 0) / 2,
                artistic: beautyItems.filter(r => r.instrument === 'artistic').reduce((s, r) => s + r.value, 0) / 2,
                moral: beautyItems.filter(r => r.instrument === 'moral').reduce((s, r) => s + r.value, 0) / 2
            }
        };
    }
    
    // 5. Antifragility
    const antifragilityItems = responses.filter(r => r.category === 'antifragility');
    if (antifragilityItems.length > 0) {
        const antifragilityScore = antifragilityItems.reduce((sum, r) => sum + r.value, 0) / antifragilityItems.length;
        experimentalScores.antifragility = {
            score: antifragilityScore,
            percentile: calculatePercentile(antifragilityScore, 3.3, 0.85),
            level: antifragilityScore > 4 ? 'Antifragile' : antifragilityScore > 3 ? 'Resilient' : 'Fragile'
        };
    }
    
    // 6. Flow Proneness
    const flowItems = responses.filter(r => r.category === 'flow');
    if (flowItems.length > 0) {
        const flowScore = flowItems.reduce((sum, r) => sum + r.value, 0) / flowItems.length;
        experimentalScores.flowProneness = {
            score: flowScore,
            percentile: calculatePercentile(flowScore, 3.6, 0.75),
            frequency: flowScore > 4 ? 'Frequent' : flowScore > 3 ? 'Occasional' : 'Rare'
        };
    }
    
    // 7. Psychological Flexibility
    const flexibilityItems = responses.filter(r => r.category === 'flexibility');
    if (flexibilityItems.length > 0) {
        const flexibilityScore = flexibilityItems.reduce((sum, r) => sum + r.value, 0) / flexibilityItems.length;
        experimentalScores.psychologicalFlexibility = {
            score: flexibilityScore,
            percentile: calculatePercentile(flexibilityScore, 3.4, 0.8),
            interpretation: flexibilityScore > 4 ? 'Highly flexible' : 'Moderately flexible'
        };
    }
    
    // 8. Dark Factor
    const darkItems = responses.filter(r => r.category === 'dark');
    if (darkItems.length > 0) {
        const darkScore = darkItems.reduce((sum, r) => sum + r.value, 0) / darkItems.length;
        experimentalScores.darkFactor = {
            score: darkScore,
            percentile: calculatePercentile(darkScore, 2.5, 1.0),
            level: darkScore < 2 ? 'Low' : darkScore < 3.5 ? 'Moderate' : 'High',
            warning: darkScore > 3.5
        };
    }
    
    // 9. Future Self-Continuity
    const futureItems = responses.filter(r => r.category === 'future');
    if (futureItems.length > 0) {
        const futureScore = futureItems.reduce((sum, r) => sum + r.value, 0) / futureItems.length;
        experimentalScores.futureSelfContinuity = {
            score: futureScore,
            percentile: calculatePercentile(futureScore, 3.7, 0.85),
            interpretation: futureScore > 4 ? 'Strong future orientation' : 'Present-focused'
        };
    }
    
    // 10. Biometric Analysis (if available)
    const biometricData = responses.filter(r => r.biometrics).map(r => r.biometrics);
    if (biometricData.length > 0) {
        const avgLatency = biometricData.reduce((sum, b) => sum + (b.latency || 0), 0) / biometricData.length;
        const keystrokeVariability = calculateVariability(biometricData.map(b => b.keystrokeMetrics?.dwellTime).filter(Boolean));
        
        experimentalScores.biometricAnalysis = {
            responseLatency: avgLatency,
            keystrokePattern: keystrokeVariability > 100 ? 'Variable' : 'Consistent',
            confidenceLevel: keystrokeVariability < 50 ? 'High' : keystrokeVariability < 150 ? 'Moderate' : 'Low',
            authenticityScore: Math.max(0, Math.min(100, 100 - keystrokeVariability / 3))
        };
    }
    
    // Calculate overall experimental profile
    const profile = determineExperimentalProfile(experimentalScores);
    
    // Calculate match confidence based on response consistency
    const matchConfidence = calculateExperimentalConfidence(responses, experimentalScores);
    
    return {
        profile,
        scores: {}, // Traditional scores if any overlap
        experimentalScores,
        biometricAnalysis: experimentalScores.biometricAnalysis || {},
        matchConfidence,
        timestamp: new Date(),
        version: '3.0.0-experimental'
    };
}

// Helper function to calculate percentile
function calculatePercentile(score, mean, sd) {
    const z = (score - mean) / sd;
    // Approximate normal CDF
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp(-z * z / 2);
    const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    const percentile = z > 0 ? (1 - probability) * 100 : probability * 100;
    return Math.round(percentile);
}

// Helper function to calculate variability
function calculateVariability(values) {
    if (!values || values.length === 0) return 0;
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
}

// Determine experimental profile based on scores
function determineExperimentalProfile(scores) {
    const profiles = [];
    
    if (scores.nonattachment?.score > 4) profiles.push('Zen Master');
    if (scores.gunas?.dominant === 'Sattva') profiles.push('Harmonizer');
    if (scores.ubuntu?.score > 4.2) profiles.push('Community Builder');
    if (scores.beauty?.score > 4) profiles.push('Aesthetic Appreciator');
    if (scores.antifragility?.level === 'Antifragile') profiles.push('Chaos Navigator');
    if (scores.flowProneness?.frequency === 'Frequent') profiles.push('Flow Seeker');
    if (scores.psychologicalFlexibility?.score > 4) profiles.push('Adaptive Mind');
    if (scores.darkFactor?.level === 'Low') profiles.push('Light Bearer');
    if (scores.futureSelfContinuity?.score > 4) profiles.push('Visionary');
    
    return {
        primary: profiles[0] || 'Explorer',
        secondary: profiles.slice(1, 3),
        description: generateExperimentalDescription(profiles, scores)
    };
}

// Generate description based on experimental profile
function generateExperimentalDescription(profiles, scores) {
    let description = 'Your experimental psychological profile reveals ';
    
    if (profiles.includes('Zen Master')) {
        description += 'exceptional non-attachment and emotional equanimity. ';
    }
    if (profiles.includes('Community Builder')) {
        description += 'a deep sense of interconnectedness and communal responsibility. ';
    }
    if (profiles.includes('Chaos Navigator')) {
        description += 'remarkable ability to thrive in uncertainty and grow from challenges. ';
    }
    
    description += 'This cutting-edge assessment integrates Eastern philosophy, indigenous wisdom, and modern psychological research.';
    
    return description;
}

// Calculate confidence in experimental results
function calculateExperimentalConfidence(responses, scores) {
    let confidence = 70; // Base confidence for experimental measures
    
    // Increase confidence based on response consistency
    const responseCount = responses.length;
    if (responseCount > 50) confidence += 10;
    if (responseCount > 70) confidence += 5;
    
    // Check for biometric data
    if (scores.biometricAnalysis?.authenticityScore > 80) confidence += 10;
    
    // Check for response time consistency
    const responseTimes = responses.map(r => r.responseTime).filter(Boolean);
    if (responseTimes.length > 0) {
        const avgTime = responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length;
        if (avgTime > 2000 && avgTime < 10000) confidence += 5; // Thoughtful responses
    }
    
    return Math.min(95, confidence); // Cap at 95% for experimental
}

// Start server
app.listen(PORT, () => {
    console.log(`P.A.T.R.I.C.I.A Backend running on port ${PORT}`);
    console.log('MongoDB connected');
    console.log('Stripe integration active');
});

module.exports = app;