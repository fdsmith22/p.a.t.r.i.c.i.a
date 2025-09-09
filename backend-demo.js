// P.A.T.R.I.C.I.A Backend Server - Demo Version (No DB Required)
// This version works without MongoDB for local testing

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('.'));

// In-memory storage for demo
const sessions = new Map();

// === API ENDPOINTS ===

// Start new assessment session
app.post('/api/assessment/start', async (req, res) => {
    try {
        const { mode, tier, userId, demographics, consent } = req.body;
        
        const sessionId = generateSessionId();
        const assessment = {
            sessionId,
            userId: userId || 'anonymous',
            mode,
            tier,
            demographics,
            consent,
            startTime: new Date(),
            responses: [],
            metadata: {
                userAgent: req.headers['user-agent'],
                referrer: req.headers.referer
            }
        };
        
        sessions.set(sessionId, assessment);
        
        res.json({
            success: true,
            sessionId,
            assessmentId: sessionId,
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
        
        const assessment = sessions.get(sessionId);
        if (!assessment) {
            return res.status(404).json({ error: 'Assessment not found' });
        }
        
        // Merge new responses with existing ones
        const existingIds = assessment.responses.map(r => r.questionId);
        const newResponses = responses.filter(r => !existingIds.includes(r.questionId));
        assessment.responses.push(...newResponses);
        
        sessions.set(sessionId, assessment);
        
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
        
        const assessment = sessions.get(sessionId);
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
        assessment.payment = { status: 'free_preview' }; // Demo mode
        
        sessions.set(sessionId, assessment);
        
        res.json({
            success: true,
            results: results,
            reportUrl: `/api/report/${sessionId}`
        });
    } catch (error) {
        console.error('Error completing assessment:', error);
        res.status(500).json({ error: 'Failed to complete assessment' });
    }
});

// Get results
app.get('/api/report/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        
        const assessment = sessions.get(sessionId);
        if (!assessment) {
            return res.status(404).json({ error: 'Assessment not found' });
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

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        mode: 'demo',
        sessions: sessions.size,
        timestamp: new Date()
    });
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

function generateCertificate(assessment) {
    return {
        id: assessment.sessionId,
        name: assessment.demographics?.name || 'Participant',
        mode: assessment.mode,
        completionDate: assessment.completionTime,
        verificationUrl: `/verify/${assessment.sessionId}`
    };
}

// Simplified calculation functions for demo
function calculateValidatedResults(responses) {
    const scores = {};
    const domains = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
    
    domains.forEach(domain => {
        const domainItems = responses.filter(r => r.category === domain);
        if (domainItems.length > 0) {
            const domainScore = domainItems.reduce((sum, r) => sum + (r.value || 3), 0) / domainItems.length;
            scores[domain] = {
                score: domainScore,
                percentile: Math.round(50 + (domainScore - 3) * 15),
                interpretation: domainScore > 3.5 ? 'High' : domainScore > 2.5 ? 'Moderate' : 'Low'
            };
        }
    });
    
    return {
        profile: {
            primary: 'Balanced',
            description: 'Demo assessment completed successfully'
        },
        scores,
        matchConfidence: 85,
        timestamp: new Date(),
        version: '3.0.0-demo'
    };
}

function calculateExperimentalResults(responses) {
    const experimentalScores = {};
    const categories = ['nonattachment', 'gunas', 'ubuntu', 'beauty', 'antifragility', 
                       'flow', 'flexibility', 'dark', 'future'];
    
    categories.forEach(category => {
        const items = responses.filter(r => r.category === category);
        if (items.length > 0) {
            const score = items.reduce((sum, r) => sum + (r.value || 3), 0) / items.length;
            experimentalScores[category] = {
                score: score,
                percentile: Math.round(50 + (score - 3) * 15),
                interpretation: score > 3.5 ? 'High' : score > 2.5 ? 'Moderate' : 'Low'
            };
        }
    });
    
    return {
        profile: {
            primary: 'Explorer',
            description: 'Experimental assessment completed'
        },
        experimentalScores,
        matchConfidence: 82,
        timestamp: new Date(),
        version: '3.0.0-experimental'
    };
}

// Start server
app.listen(PORT, () => {
    console.log(`P.A.T.R.I.C.I.A Backend (Demo Mode) running on port ${PORT}`);
    console.log('No database required - using in-memory storage');
    console.log(`API available at http://localhost:${PORT}/api`);
    console.log(`Frontend served at http://localhost:${PORT}`);
});

module.exports = app;