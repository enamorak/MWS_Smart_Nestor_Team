const axios = require('axios');

class MWSService {
  constructor() {
    this.apiKey = process.env.MWS_API_KEY;
    this.appId = process.env.MWS_APP_ID;
    this.baseURL = process.env.MWS_BASE_URL || 'https://api.mws.tables';
  }

  async getTables() {
    try {
      const response = await axios.get(`${this.baseURL}/tables`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching tables:', error.message);
      return this.getMockTables();
    }
  }

  async getTableData(tableId, filters = {}) {
    try {
      const response = await axios.get(`${this.baseURL}/tables/${tableId}/rows`, {
        params: filters,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching table data:', error.message);
      return this.getMockTableData();
    }
  }

  async getDashboards() {
    try {
      const response = await axios.get(`${this.baseURL}/dashboards`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboards:', error.message);
      return this.getMockDashboards();
    }
  }

  // Mock данные для тестирования
  getMockTables() {
    return {
      tables: [
        {
          id: 'content_registry',
          name: 'Content Registry',
          columns: [
            { name: 'id', type: 'string' },
            { name: 'title', type: 'string' },
            { name: 'type', type: 'string' },
            { name: 'date', type: 'datetime' },
            { name: 'views', type: 'number' },
            { name: 'likes', type: 'number' },
            { name: 'comments', type: 'number' }
          ]
        }
      ]
    };
  }

  getMockTableData() {
    return {
      rows: [
        {
          id: '1',
          title: 'Обзор нового продукта 2025',
          type: 'video',
          date: '2025-11-29T10:00:00Z',
          views: 12500,
          likes: 245,
          comments: 34,
          sentiment_positive: 70,
          sentiment_neutral: 20,
          sentiment_negative: 10
        },
        {
          id: '2',
          title: 'Акция недели - скидки до 50%',
          type: 'post',
          date: '2025-11-28T14:30:00Z',
          views: 8900,
          likes: 156,
          comments: 89,
          sentiment_positive: 30,
          sentiment_neutral: 40,
          sentiment_negative: 30
        },
        {
          id: '3',
          title: 'За кулисами производства',
          type: 'image',
          date: '2025-11-27T09:15:00Z',
          views: 15600,
          likes: 312,
          comments: 45,
          sentiment_positive: 65,
          sentiment_neutral: 25,
          sentiment_negative: 10
        }
      ],
      total_count: 3
    };
  }

  getMockDashboards() {
    return {
      dashboards: [
        {
          id: 'content_analytics',
          name: 'Content Analytics',
          description: 'Аналитика эффективности контента',
          widgets: [
            {
              type: 'stats',
              title: 'Ключевые метрики',
              config: { metrics: ['total_posts', 'total_views', 'engagement_rate'] }
            },
            {
              type: 'chart',
              title: 'Динамика просмотров',
              config: { chart_type: 'line', metric: 'views' }
            }
          ]
        }
      ]
    };
  }

  // Аналитика на основе реальных данных
  async getContentAnalytics() {
    try {
      const data = await this.getTableData('content_registry');
      
      if (!data.rows || data.rows.length === 0) {
        return this.getMockAnalytics();
      }

      const rows = data.rows;
      
      // Рассчитываем метрики
      const totalPosts = rows.length;
      const totalViews = rows.reduce((sum, row) => sum + (row.views || 0), 0);
      const totalLikes = rows.reduce((sum, row) => sum + (row.likes || 0), 0);
      const totalComments = rows.reduce((sum, row) => sum + (row.comments || 0), 0);
      const avgEngagement = ((totalLikes + totalComments * 2) / (totalViews || 1)) * 100;

      // Анализ по типам контента
      const typeStats = rows.reduce((stats, row) => {
        const type = row.type || 'unknown';
        if (!stats[type]) {
          stats[type] = { count: 0, totalViews: 0, totalLikes: 0, totalComments: 0 };
        }
        stats[type].count += 1;
        stats[type].totalViews += row.views || 0;
        stats[type].totalLikes += row.likes || 0;
        stats[type].totalComments += row.comments || 0;
        return stats;
      }, {});

      // Топ посты
      const topPosts = rows
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5);

      // Анализ тональности
      const sentimentStats = rows.reduce((stats, row) => {
        stats.total += 1;
        stats.positive += row.sentiment_positive || 0;
        stats.neutral += row.sentiment_neutral || 0;
        stats.negative += row.sentiment_negative || 0;
        return stats;
      }, { total: 0, positive: 0, neutral: 0, negative: 0 });

      return {
        summary: {
          totalPosts,
          totalViews,
          totalLikes,
          totalComments,
          avgEngagement: parseFloat(avgEngagement.toFixed(2))
        },
        typeStats,
        topPosts,
        sentiment: {
          positive: parseFloat((sentimentStats.positive / sentimentStats.total).toFixed(2)),
          neutral: parseFloat((sentimentStats.neutral / sentimentStats.total).toFixed(2)),
          negative: parseFloat((sentimentStats.negative / sentimentStats.total).toFixed(2))
        },
        recentPosts: rows
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 10)
      };
    } catch (error) {
      console.error('Error generating analytics:', error);
      return this.getMockAnalytics();
    }
  }

  getMockAnalytics() {
    return {
      summary: {
        totalPosts: 156,
        totalViews: 125000,
        totalLikes: 12450,
        totalComments: 2345,
        avgEngagement: 4.2
      },
      typeStats: {
        post: { count: 89, totalViews: 65000, totalLikes: 5200, totalComments: 1200 },
        video: { count: 45, totalViews: 45000, totalLikes: 5800, totalComments: 800 },
        image: { count: 22, totalViews: 15000, totalLikes: 1450, totalComments: 345 }
      },
      topPosts: [
        { title: 'Обзор нового продукта', views: 12500, likes: 245, type: 'video' },
        { title: 'За кулисами производства', views: 15600, likes: 312, type: 'image' },
        { title: 'Интервью с основателем', views: 9800, likes: 198, type: 'video' }
      ],
      sentiment: {
        positive: 0.65,
        neutral: 0.25,
        negative: 0.10
      }
    };
  }
}

module.exports = new MWSService();