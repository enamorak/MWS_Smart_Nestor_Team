const express = require('express');
const router = express.Router();
const botController = require('../controllers/botController');

// Handle bot messages
router.post('/message', botController.handleMessage.bind(botController));

// Get conversation history (simplified)
router.get('/conversations', (req, res) => {
  // In production, this would fetch from database
  res.json({
    conversations: [],
    total: 0
  });
});

// Get bot capabilities
router.get('/capabilities', (req, res) => {
  res.json({
    capabilities: [
      "Анализ популярности контента",
      "Сравнение эффективности постов",
      "Анализ тональности комментариев",
      "Рекомендации по улучшению",
      "Статистика за различные периоды",
      "Прогнозирование популярности"
    ],
    examples: [
      "Какой пост был самым популярным на прошлой неделе?",
      "Почему этот материал получил столько негативных комментариев?",
      "Покажи динамику просмотров за месяц",
      "Какие темы чаще всего обсуждают в комментариях?",
      "Сравни вовлеченность за прошлую и текущую неделю"
    ]
  });
});

// Get AI status
router.get('/status', botController.getAIStatus.bind(botController));

module.exports = router;