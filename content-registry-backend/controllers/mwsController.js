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

  async getPublicationPlan(req, res) {
    try {
      const { companyId, month, year, network } = req.query;
      const plan = await mwsService.getPublicationPlan({
        companyId,
        month: parseInt(month),
        year: parseInt(year),
        network
      });

      res.json({
        success: true,
        data: plan
      });
    } catch (error) {
      console.error('Error getting publication plan:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async createPublication(req, res) {
    try {
      const publication = await mwsService.createPublication(req.body);

      res.json({
        success: true,
        data: publication
      });
    } catch (error) {
      console.error('Error creating publication:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async updatePublication(req, res) {
    try {
      const { id } = req.params;
      const publication = await mwsService.updatePublication(id, req.body);

      res.json({
        success: true,
        data: publication
      });
    } catch (error) {
      console.error('Error updating publication:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async deletePublication(req, res) {
    try {
      const { id } = req.params;
      await mwsService.deletePublication(id);

      res.json({
        success: true,
        message: 'Publication deleted'
      });
    } catch (error) {
      console.error('Error deleting publication:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getGanttTasks(req, res) {
    try {
      const { companyId } = req.query;
      const tasks = await mwsService.getGanttTasks({ companyId });

      res.json({
        success: true,
        data: { tasks }
      });
    } catch (error) {
      console.error('Error getting gantt tasks:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async createTask(req, res) {
    try {
      const task = await mwsService.createTask(req.body);

      res.json({
        success: true,
        data: task
      });
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateTask(req, res) {
    try {
      const { id } = req.params;
      const task = await mwsService.updateTask(id, req.body);

      res.json({
        success: true,
        data: task
      });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteTask(req, res) {
    try {
      const { id } = req.params;
      await mwsService.deleteTask(id);

      res.json({
        success: true,
        message: 'Task deleted'
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new MWSController();