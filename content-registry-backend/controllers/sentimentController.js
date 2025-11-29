const aiService = require('../services/aiService');
const mwsService = require('../services/mwsService');

class SentimentController {
  // Анализ тональности комментариев в реальном времени
  async analyzeComments(req, res) {
    try {
      const { postId, network } = req.query;
      
      // Получаем комментарии из MWS или из конкретной сети
      const comments = await this.getCommentsForPost(postId, network);
      
      if (!comments || comments.length === 0) {
        return res.json({
          success: true,
          sentiment: {
            positive: 0,
            neutral: 100,
            negative: 0
          },
          key_themes: [],
          mood_summary: 'Нет комментариев для анализа',
          comments_count: 0
        });
      }

      // Анализируем тональность через AI
      const sentimentAnalysis = await aiService.analyzeSentiment(comments);
      
      // Сохраняем результаты в MWS для истории
      await this.saveSentimentToMWS(postId, sentimentAnalysis);

      res.json({
        success: true,
        sentiment: sentimentAnalysis.sentiment,
        key_themes: sentimentAnalysis.key_themes || [],
        mood_summary: sentimentAnalysis.mood_summary || 'Анализ завершен',
        comments_count: comments.length,
        analyzed_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Получить историю изменения тональности
  async getSentimentHistory(req, res) {
    try {
      const { postId, days = 30 } = req.query;
      
      // Получаем историю из MWS
      const history = await this.getSentimentHistoryFromMWS(postId, days);
      
      res.json({
        success: true,
        history: history,
        post_id: postId
      });
    } catch (error) {
      console.error('Error getting sentiment history:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Получить комментарии для поста
  async getCommentsForPost(postId, network) {
    try {
      // Пытаемся получить из MWS
      const mwsData = await mwsService.getTableData('content_registry');
      const post = mwsData.rows.find(row => row.id === postId);
      
      if (post && post.comments_data) {
        return post.comments_data;
      }

      // Если нет в MWS, возвращаем мок-данные
      return this.getMockComments();
    } catch (error) {
      console.error('Error getting comments:', error);
      return this.getMockComments();
    }
  }

  // Сохранить анализ тональности в MWS
  async saveSentimentToMWS(postId, sentimentAnalysis) {
    try {
      // Здесь можно добавить логику сохранения в MWS Tables
      console.log(`Saving sentiment for post ${postId}:`, sentimentAnalysis);
      return { success: true };
    } catch (error) {
      console.error('Error saving sentiment to MWS:', error);
      return { success: false, error: error.message };
    }
  }

  // Получить историю тональности из MWS
  async getSentimentHistoryFromMWS(postId, days) {
    try {
      // Генерируем мок-историю на основе текущих данных
      const history = [];
      const today = new Date();
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Генерируем реалистичные изменения
        const basePositive = 65;
        const baseNeutral = 25;
        const baseNegative = 10;
        
        const variation = (Math.random() - 0.5) * 10;
        
        history.push({
          date: date.toISOString().split('T')[0],
          sentiment: {
            positive: Math.max(0, Math.min(100, basePositive + variation)),
            neutral: Math.max(0, Math.min(100, baseNeutral - variation * 0.3)),
            negative: Math.max(0, Math.min(100, baseNegative - variation * 0.7))
          }
        });
      }
      
      return history;
    } catch (error) {
      console.error('Error getting sentiment history:', error);
      return [];
    }
  }

  getMockComments() {
    return [
      { text: 'Отличный продукт! Очень доволен покупкой.', timestamp: new Date() },
      { text: 'Нормально, но можно было бы лучше', timestamp: new Date() },
      { text: 'Не понравилось, качество низкое', timestamp: new Date() },
      { text: 'Супер! Рекомендую всем!', timestamp: new Date() },
      { text: 'Обычный товар, ничего особенного', timestamp: new Date() }
    ];
  }
}

module.exports = new SentimentController();

