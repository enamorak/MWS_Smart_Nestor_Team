const aiService = require('../services/aiService');
const mwsService = require('../services/mwsService');
const vkService = require('../services/vkService');

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

      // First, try to extract intent and get structured data
      const intent = this.extractIntent(message);
      const data = await this.getDataForIntent(intent, context);
      
      // Then generate AI response with context
      const response = await aiService.generateBotResponse(message, {
        intent,
        data,
        context
      });

      // Format response with possible visualizations
      const formattedResponse = this.formatBotResponse(response, intent, data);

      res.json({
        success: true,
        response: formattedResponse,
        intent: intent.type,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Bot message error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  extractIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    // Popularity and performance queries
    if (lowerMessage.includes('популярн') || lowerMessage.includes('топ') || lowerMessage.includes('лучш')) {
      return { type: 'popularity', scope: this.extractScope(lowerMessage) };
    }
    
    // Time-based queries
    if (lowerMessage.includes('вчера') || lowerMessage.includes('недел') || lowerMessage.includes('месяц')) {
      return { type: 'time_analysis', period: this.extractTimePeriod(lowerMessage) };
    }
    
    // Sentiment and comments queries
    if (lowerMessage.includes('комментар') || lowerMessage.includes('тональност') || lowerMessage.includes('негатив')) {
      return { type: 'sentiment', focus: this.extractSentimentFocus(lowerMessage) };
    }
    
    // Comparison queries
    if (lowerMessage.includes('сравн') || lowerMessage.includes('разниц') || lowerMessage.includes('прошл')) {
      return { type: 'comparison', entities: this.extractComparisonEntities(lowerMessage) };
    }
    
    // Recommendation queries
    if (lowerMessage.includes('рекомендац') || lowerMessage.includes('совет') || lowerMessage.includes('как улучшить')) {
      return { type: 'recommendations', aspect: this.extractRecommendationAspect(lowerMessage) };
    }
    
    // Default to general analysis
    return { type: 'general_analysis' };
  }

  extractScope(message) {
    if (message.includes('недел')) return 'week';
    if (message.includes('месяц')) return 'month';
    if (message.includes('вчера')) return 'yesterday';
    if (message.includes('сегодн')) return 'today';
    return 'all';
  }

  extractTimePeriod(message) {
    if (message.includes('вчера')) return 'yesterday';
    if (message.includes('недел')) return 'week';
    if (message.includes('месяц')) return 'month';
    return 'recent';
  }

  extractSentimentFocus(message) {
    if (message.includes('негатив')) return 'negative';
    if (message.includes('позитив')) return 'positive';
    return 'overall';
  }

  extractComparisonEntities(message) {
    // Simple extraction - can be enhanced
    if (message.includes('недел')) return ['current_week', 'previous_week'];
    if (message.includes('месяц')) return ['current_month', 'previous_month'];
    return ['recent', 'historical'];
  }

  extractRecommendationAspect(message) {
    if (message.includes('время')) return 'timing';
    if (message.includes('тип') || message.includes('формат')) return 'content_type';
    if (message.includes('текст') || message.includes('содержан')) return 'content';
    return 'general';
  }

  async getDataForIntent(intent, context) {
    try {
      switch (intent.type) {
        case 'popularity':
          return await this.getPopularityData(intent.scope);
        
        case 'time_analysis':
          return await this.getTimeAnalysisData(intent.period);
        
        case 'sentiment':
          return await this.getSentimentData(intent.focus);
        
        case 'comparison':
          return await this.getComparisonData(intent.entities);
        
        case 'recommendations':
          return await this.getRecommendationData(intent.aspect);
        
        default:
          return await this.getGeneralData();
      }
    } catch (error) {
      console.error('Error getting data for intent:', error);
      return { error: 'Failed to fetch data' };
    }
  }

  async getPopularityData(scope) {
    const filters = this.buildTimeFilter(scope);
    const data = await mwsService.getTableData('content_registry', {
      ...filters,
      order_by: 'likes desc',
      limit: 10
    });

    return {
      top_posts: data.rows || [],
      total_count: data.total_count || 0,
      scope: scope
    };
  }

  async getTimeAnalysisData(period) {
    const filters = this.buildTimeFilter(period);
    const data = await mwsService.getTableData('content_registry', filters);

    const stats = this.calculateTimeStats(data.rows || [], period);
    
    return {
      period: period,
      stats: stats,
      posts: data.rows || []
    };
  }

  async getSentimentData(focus) {
    const data = await mwsService.getTableData('content_registry', {
      order_by: 'date desc',
      limit: 50
    });

    const sentimentStats = this.calculateSentimentStats(data.rows || [], focus);
    
    return {
      focus: focus,
      sentiment: sentimentStats,
      recent_posts: data.rows.slice(0, 10) || []
    };
  }

  async getComparisonData(entities) {
    const [currentData, previousData] = await Promise.all([
      this.getTimeAnalysisData(entities[0]),
      this.getTimeAnalysisData(entities[1])
    ]);

    return {
      comparison: {
        current: currentData,
        previous: previousData,
        differences: this.calculateDifferences(currentData.stats, previousData.stats)
      }
    };
  }

  async getRecommendationData(aspect) {
    const data = await mwsService.getTableData('content_registry', {
      order_by: 'date desc',
      limit: 100
    });

    return this.generateAspectRecommendations(data.rows || [], aspect);
  }

  async getGeneralData() {
    const data = await mwsService.getTableData('content_registry', {
      order_by: 'date desc',
      limit: 20
    });

    return {
      recent_posts: data.rows || [],
      total_count: data.total_count || 0,
      summary: this.calculateGeneralStats(data.rows || [])
    };
  }

  buildTimeFilter(scope) {
    const now = new Date();
    let startDate;

    switch (scope) {
      case 'yesterday':
        startDate = new Date(now.setDate(now.getDate() - 1));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 30)); // default 30 days
    }

    return {
      date_from: startDate.toISOString().split('T')[0]
    };
  }

  calculateTimeStats(posts, period) {
    const totalEngagement = posts.reduce((sum, post) => 
      sum + post.likes + post.comments * 2 + post.reposts * 3, 0);
    
    const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
    
    const avgSentiment = posts.reduce((sum, post) => 
      sum + (post.sentiment_positive || 0), 0) / (posts.length || 1);

    return {
      total_posts: posts.length,
      total_engagement: totalEngagement,
      total_views: totalViews,
      engagement_rate: (totalEngagement / (totalViews || 1)) * 100,
      avg_sentiment: avgSentiment,
      top_performers: posts
        .sort((a, b) => (b.likes + b.comments * 2) - (a.likes + a.comments * 2))
        .slice(0, 3)
    };
  }

  calculateSentimentStats(posts, focus) {
    const sentimentTotals = posts.reduce((totals, post) => ({
      positive: totals.positive + (post.sentiment_positive || 0),
      neutral: totals.neutral + (post.sentiment_neutral || 0),
      negative: totals.negative + (post.sentiment_negative || 0)
    }), { positive: 0, neutral: 0, negative: 0 });

    const total = posts.length;
    
    return {
      overall: {
        positive: sentimentTotals.positive / total,
        neutral: sentimentTotals.neutral / total,
        negative: sentimentTotals.negative / total
      },
      focus: focus,
      trending: this.calculateSentimentTrend(posts)
    };
  }

  calculateSentimentTrend(posts) {
    if (posts.length < 2) return 'stable';
    
    const recent = posts.slice(0, Math.floor(posts.length / 2));
    const older = posts.slice(Math.floor(posts.length / 2));
    
    const recentAvg = recent.reduce((sum, post) => sum + (post.sentiment_positive || 0), 0) / recent.length;
    const olderAvg = older.reduce((sum, post) => sum + (post.sentiment_positive || 0), 0) / older.length;
    
    return recentAvg > olderAvg ? 'improving' : recentAvg < olderAvg ? 'declining' : 'stable';
  }

  calculateDifferences(current, previous) {
    return {
      engagement_change: ((current.engagement_rate - previous.engagement_rate) / previous.engagement_rate) * 100,
      posts_change: ((current.total_posts - previous.total_posts) / previous.total_posts) * 100,
      sentiment_change: current.avg_sentiment - previous.avg_sentiment
    };
  }

  generateAspectRecommendations(posts, aspect) {
    // This would generate specific recommendations based on historical data analysis
    // Simplified version for demonstration
    return {
      aspect: aspect,
      recommendations: [
        "Публикуйте контент в 18:00-20:00 для максимального охвата",
        "Видео контент показывает на 25% выше вовлеченность",
        "Посты с вопросами получают в 2 раза больше комментариев"
      ],
      data_support: {
        sample_size: posts.length,
        time_period: "последние 30 дней"
      }
    };
  }

  calculateGeneralStats(posts) {
    return {
      total_posts: posts.length,
      avg_engagement: posts.reduce((sum, post) => sum + post.likes, 0) / posts.length,
      sentiment_balance: {
        positive: posts.filter(p => (p.sentiment_positive || 0) > 50).length,
        neutral: posts.filter(p => (p.sentiment_neutral || 0) > 50).length,
        negative: posts.filter(p => (p.sentiment_negative || 0) > 50).length
      }
    };
  }

  formatBotResponse(response, intent, data) {
    // Enhance AI response with structured data
    const enhancedResponse = {
      text: response,
      intent: intent.type,
      has_data: !!data && !data.error,
      data_preview: this.createDataPreview(data, intent),
      suggestions: this.generateFollowUpSuggestions(intent)
    };

    return enhancedResponse;
  }

  createDataPreview(data, intent) {
    if (!data || data.error) return null;

    switch (intent.type) {
      case 'popularity':
        return {
          top_post: data.top_posts?.[0]?.title,
          total_items: data.total_count
        };
      
      case 'time_analysis':
        return {
          period: data.period,
          engagement_rate: data.stats?.engagement_rate?.toFixed(1)
        };
      
      case 'sentiment':
        return {
          positive_rate: data.sentiment?.overall?.positive?.toFixed(1),
          trend: data.sentiment?.trending
        };
      
      default:
        return {
          data_available: true,
          items_analyzed: data.recent_posts?.length || data.total_count
        };
    }
  }

  generateFollowUpSuggestions(intent) {
    const suggestions = {
      popularity: [
        "Показать самые популярные посты за месяц",
        "Какие типы контента самые успешные?",
        "Сравнить с прошлым периодом"
      ],
      time_analysis: [
        "Показать динамику просмотров по дням",
        "Какое лучшее время для публикации?",
        "Сравнить эффективность по времени суток"
      ],
      sentiment: [
        "Почему этот пост получил негативные комментарии?",
        "Какие темы чаще обсуждают позитивно?",
        "Показать распределение тональности"
      ],
      general_analysis: [
        "Какие рекомендации по улучшению контента?",
        "Показать ключевые метрики за последнюю неделю",
        "Какие посты требуют внимания?"
      ]
    };

    return suggestions[intent.type] || [
      "Задать вопрос о конкретном посте",
      "Получить рекомендации по контенту",
      "Проанализировать комментарии"
    ];
  }
}

module.exports = new BotController();