const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Predict content popularity
router.post('/predict', aiController.predictPopularity);

// Analyze text sentiment
router.post('/analyze', aiController.analyzeText);

// Get content recommendations
router.post('/recommendations', aiController.getContentRecommendations);

// Health check for AI service
router.get('/health', async (req, res) => {
  try {
    // Test AI service with simple request
    const testAnalysis = await require('../services/aiService').analyzeSentiment([
      { text: 'Отличный пост!' }
    ]);
    
    res.json({
      status: 'OK',
      service: 'AI Analysis',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      error: error.message
    });
  }
});

module.exports = router;