// P.A.T.R.I.C.I.A Backend Server
// Comprehensive backend with payment integration, data persistence, and analytics

const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
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

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/patricia', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

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
    // This would match the client-side implementation
    return {
        profile: {},
        scores: {},
        rawScores: {},
        clinicalIndicators: {},
        qualityMetrics: {},
        matchConfidence: 85
    };
}

function calculateExperimentalResults(responses) {
    // Implementation of experimental scoring algorithms
    // Including all the cutting-edge measures
    return {
        profile: {},
        scores: {},
        experimentalScores: {
            nonattachment: {},
            gunas: {},
            ubuntu: {},
            beauty: {},
            antifragility: {},
            flowProneness: {},
            psychologicalFlexibility: {},
            darkFactor: {},
            futureSelfContinuity: {}
        },
        biometricAnalysis: {},
        matchConfidence: 82
    };
}

// Start server
app.listen(PORT, () => {
    console.log(`P.A.T.R.I.C.I.A Backend running on port ${PORT}`);
    console.log('MongoDB connected');
    console.log('Stripe integration active');
});

module.exports = app;