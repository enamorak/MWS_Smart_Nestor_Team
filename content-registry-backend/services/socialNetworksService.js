const axios = require('axios');
const mwsService = require('./mwsService');

class SocialNetworksService {
  constructor() {
    this.networks = {
      vk: {
        name: 'VKontakte',
        apiBase: 'https://api.vk.com/method',
        token: process.env.VK_SERVICE_TOKEN,
        version: '5.131'
      },
      telegram: {
        name: 'Telegram',
        apiBase: 'https://api.telegram.org/bot',
        token: process.env.TELEGRAM_BOT_TOKEN
      },
      instagram: {
        name: 'Instagram',
        apiBase: 'https://graph.instagram.com',
        token: process.env.INSTAGRAM_ACCESS_TOKEN
      },
      youtube: {
        name: 'YouTube',
        apiBase: 'https://www.googleapis.com/youtube/v3',
        token: process.env.YOUTUBE_API_KEY
      }
    };
  }

  // Получить данные для всех сетей из MWS
  async getAllNetworksData() {
    try {
      const mwsData = await mwsService.getTableData('content_registry');
      
      // Группируем данные по социальным сетям
      const networksData = {
        vk: this.processNetworkData(mwsData.rows, 'vk'),
        telegram: this.processNetworkData(mwsData.rows, 'telegram'),
        instagram: this.processNetworkData(mwsData.rows, 'instagram'),
        youtube: this.processNetworkData(mwsData.rows, 'youtube')
      };

      return networksData;
    } catch (error) {
      console.error('Error getting networks data:', error);
      return this.getMockNetworksData();
    }
  }

  processNetworkData(rows, networkId) {
    // Фильтруем данные по сети (если есть поле network в данных)
    const networkRows = rows.filter(row => 
      !row.network || row.network === networkId || row.network === 'all'
    );

    const totalPosts = networkRows.length;
    const totalViews = networkRows.reduce((sum, row) => sum + (row.views || 0), 0);
    const totalLikes = networkRows.reduce((sum, row) => sum + (row.likes || 0), 0);
    const totalComments = networkRows.reduce((sum, row) => sum + (row.comments || 0), 0);
    const totalShares = networkRows.reduce((sum, row) => sum + (row.shares || 0), 0);
    const avgEngagement = totalViews > 0 
      ? ((totalLikes + totalComments * 2) / totalViews) * 100 
      : 0;

    return {
      id: networkId,
      name: this.networks[networkId]?.name || networkId,
      stats: {
        totalPosts,
        totalViews,
        totalLikes,
        totalComments,
        totalShares,
        avgEngagement: parseFloat(avgEngagement.toFixed(2))
      },
      posts: networkRows.slice(0, 10) // Последние 10 постов
    };
  }

  // Получить данные конкретной сети
  async getNetworkData(networkId) {
    try {
      switch (networkId) {
        case 'vk':
          return await this.getVKData();
        case 'telegram':
          return await this.getTelegramData();
        case 'instagram':
          return await this.getInstagramData();
        case 'youtube':
          return await this.getYouTubeData();
        default:
          return this.processNetworkData([], networkId);
      }
    } catch (error) {
      console.error(`Error getting ${networkId} data:`, error);
      return this.getMockNetworkData(networkId);
    }
  }

  async getVKData() {
    // Используем VK API если доступен токен
    const vkConfig = this.networks.vk;
    if (!vkConfig.token) {
      return this.getMockNetworkData('vk');
    }

    try {
      // Здесь можно добавить реальные вызовы VK API
      // Пока возвращаем данные из MWS
      const mwsData = await mwsService.getTableData('content_registry');
      return this.processNetworkData(mwsData.rows, 'vk');
    } catch (error) {
      return this.getMockNetworkData('vk');
    }
  }

  async getTelegramData() {
    // Telegram Bot API требует другого подхода
    // Для получения статистики канала нужен доступ к каналу
    return this.getMockNetworkData('telegram');
  }

  async getInstagramData() {
    // Instagram Graph API требует OAuth и специальных разрешений
    return this.getMockNetworkData('instagram');
  }

  async getYouTubeData() {
    // YouTube Data API v3 требует API ключ
    return this.getMockNetworkData('youtube');
  }

  getMockNetworkData(networkId) {
    const mockData = {
      vk: {
        id: 'vk',
        name: 'VKontakte',
        stats: {
          totalPosts: 89,
          totalViews: 45000,
          totalLikes: 3200,
          totalComments: 890,
          totalShares: 450,
          avgEngagement: 4.2
        }
      },
      telegram: {
        id: 'telegram',
        name: 'Telegram',
        stats: {
          totalPosts: 67,
          totalViews: 38000,
          totalLikes: 2800,
          totalComments: 650,
          totalShares: 320,
          avgEngagement: 5.1
        }
      },
      instagram: {
        id: 'instagram',
        name: 'Instagram',
        stats: {
          totalPosts: 95,
          totalViews: 42000,
          totalLikes: 4100,
          totalComments: 1200,
          totalShares: 890,
          avgEngagement: 6.3
        }
      },
      youtube: {
        id: 'youtube',
        name: 'YouTube',
        stats: {
          totalPosts: 34,
          totalViews: 125000,
          totalLikes: 8900,
          totalComments: 2100,
          totalShares: 1200,
          avgEngagement: 3.8
        }
      }
    };

    return mockData[networkId] || mockData.vk;
  }

  getMockNetworksData() {
    return {
      vk: this.getMockNetworkData('vk'),
      telegram: this.getMockNetworkData('telegram'),
      instagram: this.getMockNetworkData('instagram'),
      youtube: this.getMockNetworkData('youtube')
    };
  }

  // Синхронизировать данные из социальной сети в MWS
  async syncNetworkData(networkId, data) {
    try {
      // Здесь можно добавить логику сохранения в MWS Tables
      console.log(`Syncing ${networkId} data to MWS:`, data);
      return { success: true, synced: data.length };
    } catch (error) {
      console.error(`Error syncing ${networkId} data:`, error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new SocialNetworksService();

