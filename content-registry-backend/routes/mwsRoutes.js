const express = require('express');
const router = express.Router();
const mwsController = require('../controllers/mwsController');

// Получить данные контента
router.get('/content', mwsController.getContentData);

// Получить аналитику
router.get('/analytics', mwsController.getAnalytics);

// Получить дашборды
router.get('/dashboards', mwsController.getDashboards);

module.exports = router;