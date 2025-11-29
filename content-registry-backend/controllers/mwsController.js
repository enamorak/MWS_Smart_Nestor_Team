const mwsService = require('../services/mwsService');

class MWSController {
  async getContentData(req, res) {
    try {
      const { limit, offset, type } = req.query;
      
      const data = await mwsService.getTableData('content_registry', {
        limit: limit || 50,
        offset: offset || 0,
        type: type
      });

      res.json({
        success: true,
        data: data,
        pagination: {
          total: data.total_count,
          limit: parseInt(limit) || 50,
          offset: parseInt(offset) || 0
        }
      });
    } catch (error) {
      console.error('Error getting content data:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getAnalytics(req, res) {
    try {
      const analytics = await mwsService.getContentAnalytics();

      res.json({
        success: true,
        analytics: analytics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error getting analytics:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getDashboards(req, res) {
    try {
      const dashboards = await mwsService.getDashboards();

      res.json({
        success: true,
        dashboards: dashboards,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error getting dashboards:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new MWSController();