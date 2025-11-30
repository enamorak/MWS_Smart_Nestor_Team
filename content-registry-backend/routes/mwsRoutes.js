const express = require('express');
const router = express.Router();
const mwsController = require('../controllers/mwsController');

// Получить данные контента
router.get('/content', mwsController.getContentData);

// Получить аналитику
router.get('/analytics', mwsController.getAnalytics);

// Получить дашборды
router.get('/dashboards', mwsController.getDashboards);

// План публикаций
router.get('/publications/plan', mwsController.getPublicationPlan);
router.post('/publications', mwsController.createPublication);
router.put('/publications/:id', mwsController.updatePublication);
router.delete('/publications/:id', mwsController.deletePublication);

// Задачи для диаграммы Ганта
router.get('/tasks/gantt', mwsController.getGanttTasks);
router.post('/tasks', mwsController.createTask);
router.put('/tasks/:id', mwsController.updateTask);
router.delete('/tasks/:id', mwsController.deleteTask);

module.exports = router;