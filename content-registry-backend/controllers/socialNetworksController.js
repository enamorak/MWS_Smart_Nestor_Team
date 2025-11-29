const socialNetworksService = require('../services/socialNetworksService');

class SocialNetworksController {
  // Получить данные всех социальных сетей
  async getAllNetworks(req, res) {
    try {
      const networksData = await socialNetworksService.getAllNetworksData();
      
      res.json({
        success: true,
        networks: networksData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error getting all networks:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Получить данные конкретной сети
  async getNetwork(req, res) {
    try {
      const { networkId } = req.params;
      const networkData = await socialNetworksService.getNetworkData(networkId);
      
      res.json({
        success: true,
        network: networkData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error(`Error getting ${req.params.networkId}:`, error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Синхронизировать данные сети
  async syncNetwork(req, res) {
    try {
      const { networkId } = req.params;
      const { data } = req.body;
      
      const result = await socialNetworksService.syncNetworkData(networkId, data);
      
      res.json({
        success: result.success,
        result: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error(`Error syncing ${req.params.networkId}:`, error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Получить сравнительную статистику
  async getComparison(req, res) {
    try {
      const networksData = await socialNetworksService.getAllNetworksData();
      
      const comparison = Object.values(networksData).map(network => ({
        id: network.id,
        name: network.name,
        stats: network.stats
      }));

      res.json({
        success: true,
        comparison: comparison,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error getting comparison:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new SocialNetworksController();

