const express = require('express');
const router = express.Router();
const sentimentController = require('../controllers/sentimentController');

// Анализ тональности комментариев
router.get('/analyze', sentimentController.analyzeComments);

// Получить историю тональности
router.get('/history', sentimentController.getSentimentHistory);

module.exports = router;

