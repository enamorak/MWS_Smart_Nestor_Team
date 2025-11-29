const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const botController = require('../controllers/botController');

// Предсказание популярности
router.post('/predict', aiController.predictPopularity);

// Анализ текста
router.post('/analyze', aiController.analyzeText);

// Анализ контента
router.post('/analyze-content', aiController.analyzeContentPerformance);

// Рекомендации по контенту
router.post('/recommendations', aiController.getContentRecommendations);

// Анализ конкретного поста
router.post('/posts/:postId/analyze', botController.analyzePost);

// Статус AI сервиса
router.get('/status', botController.getAIStatus);

// Health check для AI сервиса
router.get('/health', async (req, res) => {
  try {
    const status = await require('../services/aiService').checkConnection();
    
    res.json({
      status: status.connected ? 'OK' : 'ERROR',
      service: 'OpenRouter AI',
      connected: status.connected,
      timestamp: new Date().toISOString(),
      details: status.connected ? 'AI service operational' : 'AI service offline'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      service: 'OpenRouter AI',
      connected: false,
      error: error.message
    });
  }
});

module.exports = router;