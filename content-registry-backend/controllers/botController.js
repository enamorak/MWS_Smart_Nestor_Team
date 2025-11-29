const aiService = require('../services/aiService');
const mwsService = require('../services/mwsService');

class BotController {
  async handleMessage(req, res) {
    try {
      const { message, context = {} } = req.body;

      if (!message) {
        return res.status(400).json({
          error: 'Message is required'
        });
      }

      console.log('Processing bot message:', message);

      // Получаем данные для контекста
      const contextData = await this.getContextData(message);
      
      // Генерируем AI ответ
      const response = await aiService.generateBotResponse(message, contextData);

      res.json({
        success: true,
        response: {
          text: response,
          timestamp: new Date().toISOString(),
          context_used: Object.keys(contextData).length > 0
        }
      });

    } catch (error) {
      console.error('Bot message error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getContextData(question) {
    try {
      const lowerQuestion = question.toLowerCase();
      const analytics = await mwsService.getContentAnalytics();
      
      let context = {
        analytics: analytics.summary,
        top_posts: analytics.topPosts.slice(0, 3),
        type_stats: analytics.typeStats,
        sentiment: analytics.sentiment
      };

      // Добавляем специфичные данные в зависимости от вопроса
      if (lowerQuestion.includes('время') || lowerQuestion.includes('когда')) {
        context.timing_analysis = {
          best_time: "18:00-20:00",
          peak_engagement: "Вечерние часы",
          recommendation: "Публиковать видео в 18:00-20:00"
        };
      }

      if (lowerQuestion.includes('видео') || lowerQuestion.includes('video')) {
        context.video_performance = {
          avg_views: analytics.typeStats.video?.avgViews || 12000,
          engagement: "Выше среднего на 25%",
          recommendation: "Увеличить долю видео контента"
        };
      }

      return context;
    } catch (error) {
      console.error('Error getting context data:', error);
      return {};
    }
  }

  // Новый метод для анализа конкретного поста
  async analyzePost(req, res) {
    try {
      const { postId } = req.params;
      const { deep_analysis = false } = req.body;

      // Здесь бы мы получали данные поста из MWS
      const postData = await this.getPostData(postId);
      const analytics = await mwsService.getContentAnalytics();

      let analysis;
      if (deep_analysis) {
        analysis = await aiService.analyzeContentPerformance(postData, analytics);
      } else {
        analysis = await aiService.generateBotResponse(
          `Проанализируй этот пост: ${postData.title}. Метрики: ${JSON.stringify(postData)}`,
          analytics
        );
      }

      res.json({
        success: true,
        analysis: analysis,
        post: postData
      });

    } catch (error) {
      console.error('Post analysis error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getPostData(postId) {
    // Заглушка - в реальности получаем из MWS
    return {
      id: postId,
      title: "Пример поста",
      type: "post",
      views: 12500,
      likes: 245,
      comments: 34,
      date: new Date().toISOString()
    };
  }

  // Метод для проверки статуса AI
  async getAIStatus(req, res) {
    try {
      const status = await aiService.checkConnection();
      
      res.json({
        success: true,
        ai_service: 'OpenRouter',
        connected: status.connected,
        status: status.connected ? 'operational' : 'offline',
        response_time: new Date().toISOString(),
        details: status
      });
    } catch (error) {
      res.json({
        success: false,
        ai_service: 'OpenRouter',
        connected: false,
        status: 'offline',
        error: error.message
      });
    }
  }
}

module.exports = new BotController();