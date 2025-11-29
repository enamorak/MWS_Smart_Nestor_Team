const express = require('express');
const router = express.Router();
const socialNetworksController = require('../controllers/socialNetworksController');

// Получить данные всех социальных сетей
router.get('/', socialNetworksController.getAllNetworks);

// Получить данные конкретной сети
router.get('/:networkId', socialNetworksController.getNetwork);

// Синхронизировать данные сети
router.post('/:networkId/sync', socialNetworksController.syncNetwork);

// Получить сравнительную статистику
router.get('/comparison/stats', socialNetworksController.getComparison);

module.exports = router;

