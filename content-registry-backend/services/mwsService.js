const axios = require('axios');

class MWSService {
  constructor() {
    this.apiKey = process.env.MWS_API_KEY;
    this.appId = process.env.MWS_APP_ID;
    this.baseURL = process.env.MWS_BASE_URL;
  }

  async createOrUpdateTable(tableName, columns) {
    try {
      const response = await axios.post(`${this.baseURL}/tables`, {
        app_id: this.appId,
        name: tableName,
        columns: columns
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error creating table:', error.message);
      throw error;
    }
  }

  async addOrUpdateRow(tableId, rowData) {
    try {
      const response = await axios.post(`${this.baseURL}/tables/${tableId}/rows`, {
        data: rowData
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error adding row:', error.message);
      throw error;
    }
  }

  async getTableData(tableId, filters = {}) {
    try {
      const response = await axios.get(`${this.baseURL}/tables/${tableId}/rows`, {
        params: filters,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching table data:', error.message);
      throw error;
    }
  }

  async updateRow(tableId, rowId, rowData) {
    try {
      const response = await axios.put(`${this.baseURL}/tables/${tableId}/rows/${rowId}`, {
        data: rowData
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error updating row:', error.message);
      throw error;
    }
  }

  async initializeContentRegistry() {
    const tableStructure = {
      name: 'Content Registry',
      columns: [
        { name: 'id', type: 'string', primary: true },
        { name: 'vk_id', type: 'string' },
        { name: 'owner_id', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'text', type: 'text' },
        { name: 'date', type: 'datetime' },
        { name: 'type', type: 'string' },
        { name: 'views', type: 'number' },
        { name: 'likes', type: 'number' },
        { name: 'comments', type: 'number' },
        { name: 'reposts', type: 'number' },
        { name: 'sentiment_positive', type: 'number' },
        { name: 'sentiment_neutral', type: 'number' },
        { name: 'sentiment_negative', type: 'number' },
        { name: 'key_themes', type: 'json' },
        { name: 'mood_summary', type: 'string' },
        { name: 'link', type: 'string' },
        { name: 'created_at', type: 'datetime' },
        { name: 'updated_at', type: 'datetime' }
      ]
    };

    return await this.createOrUpdateTable('content_registry', tableStructure);
  }

  async syncContentData(contentItems) {
    try {
      const table = await this.initializeContentRegistry();
      
      const results = [];
      for (const item of contentItems) {
        try {
          const rowData = {
            id: item.id,
            vk_id: item.vk_id,
            owner_id: item.owner_id,
            title: item.title,
            text: item.text,
            date: item.date,
            type: item.type,
            views: item.views,
            likes: item.likes,
            comments: item.comments,
            reposts: item.reposts,
            sentiment_positive: item.sentiment_positive || 0,
            sentiment_neutral: item.sentiment_neutral || 0,
            sentiment_negative: item.sentiment_negative || 0,
            key_themes: item.key_themes || [],
            mood_summary: item.mood_summary || '',
            link: item.link,
            created_at: item.created_at,
            updated_at: item.updated_at
          };

          const result = await this.addOrUpdateRow(table.id, rowData);
          results.push(result);
        } catch (error) {
          console.error(`Error syncing item ${item.id}:`, error.message);
        }
      }

      return results;
    } catch (error) {
      console.error('Error in syncContentData:', error.message);
      throw error;
    }
  }
}

module.exports = new MWSService();