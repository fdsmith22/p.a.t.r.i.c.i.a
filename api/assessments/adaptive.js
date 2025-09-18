const EnhancedAdaptiveEngine = require('../../services/enhanced-adaptive-engine');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const engine = new EnhancedAdaptiveEngine();
    const { tier = 'standard', concerns = [], demographics = {} } = req.body || {};

    const result = await engine.generatePersonalizedAssessment(tier, { concerns, demographics });

    res.status(200).json({
      success: true,
      questions: result.questions,
      totalQuestions: result.totalQuestions,
      tier,
      concerns,
      adaptiveMetadata: result.adaptiveMetadata
    });
  } catch (error) {
    console.error('Adaptive assessment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate adaptive assessment',
      message: error.message
    });
  }
}