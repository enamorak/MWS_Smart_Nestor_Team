const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const botController = require('../controllers/botController');

// Предсказание популярности
router.post('/predict', aiController.predictPopularity);

// Анализ текста
router.post('/analyze', aiController.analyzeText);

// Рекомендации по контенту
router.post('/recommendations', aiController.getContentRecommendations);

// Статус AI сервиса
router.get('/status', (req, res) => {
  res.json({
    status: 'OK',
    service: 'OpenRouter AI',
    connected: true,
    timestamp: new Date().toISOString()
  });
});

// Health check для AI сервиса
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'AI Service',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;