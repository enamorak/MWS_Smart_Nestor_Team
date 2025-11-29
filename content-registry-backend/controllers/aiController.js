const aiService = require('../services/aiService');
const mwsService = require('../services/mwsService');

class AIController {
  async predictPopularity(req, res) {
    try {
      const { title, content, type } = req.body;

      if (!title || !content) {
        return res.status(400).json({
          error: 'Title and content are required'
        });
      }

      const prediction = await aiService.predictPopularity({
        title,
        content,
        type: type || 'post'
      });

      res.json({
        success: true,
        prediction: prediction,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Prediction error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async analyzeText(req, res) {
    try {
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({
          error: 'Text is required for analysis'
        });
      }

      // Simulate sentiment analysis for single text
      const analysis = await aiService.analyzeSentiment([{ text }]);

      res.json({
        success: true,
        analysis: analysis,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Text analysis error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getContentRecommendations(req, res) {
    try {
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({
          error: 'Content is required for recommendations'
        });
      }

      // Get historical data for context
      const historicalData = await mwsService.getTableData('content_registry', {
        limit: 50,
        order_by: 'date desc'
      });

      const recommendations = await this.generateContentRecommendations(
        content, 
        historicalData.rows || []
      );

      res.json({
        success: true,
        recommendations: recommendations,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Recommendations error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async generateContentRecommendations(content, historicalData) {
    // Analyze historical performance to generate data-driven recommendations
    const successfulPosts = historicalData
      .filter(post => post.likes > (post.views * 0.05)) // 5% engagement threshold
      .slice(0, 10);

    const patterns = this.analyzeSuccessfulPatterns(successfulPosts);

    const recommendations = [
      this.getTimingRecommendation(patterns),
      this.getContentTypeRecommendation(patterns),
      this.getStyleRecommendation(patterns),
      this.getCTArecommendation(patterns)
    ].filter(rec => rec !== null);

    return recommendations;
  }

  analyzeSuccessfulPatterns(successfulPosts) {
    const patterns = {
      commonThemes: this.extractCommonThemes(successfulPosts),
      bestLength: this.calculateOptimalLength(successfulPosts),
      timing: this.analyzePostingTiming(successfulPosts),
      contentTypes: this.analyzeContentTypes(successfulPosts)
    };

    return patterns;
  }

  extractCommonThemes(posts) {
    const themes = {};
    posts.forEach(post => {
      (post.key_themes || []).forEach(theme => {
        themes[theme] = (themes[theme] || 0) + 1;
      });
    });
    
    return Object.entries(themes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([theme]) => theme);
  }

  calculateOptimalLength(posts) {
    const lengths = posts.map(post => post.text?.length || 0);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    return Math.round(avgLength);
  }

  analyzePostingTiming(posts) {
    const hours = posts.map(post => new Date(post.date).getHours());
    const hourCounts = hours.reduce((counts, hour) => {
      counts[hour] = (counts[hour] || 0) + 1;
      return counts;
    }, {});

    const bestHour = Object.entries(hourCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0];

    return bestHour ? `${bestHour}:00` : '18:00';
  }

  analyzeContentTypes(posts) {
    const types = posts.reduce((counts, post) => {
      counts[post.type] = (counts[post.type] || 0) + 1;
      return counts;
    }, {});

    return Object.entries(types)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'post';
  }

  getTimingRecommendation(patterns) {
    return {
      type: 'timing',
      title: 'Лучшее время публикации',
      message: `Рекомендуемое время: ${patterns.timing}`,
      priority: 'medium'
    };
  }

  getContentTypeRecommendation(patterns) {
    return {
      type: 'content_type',
      title: 'Тип контента',
      message: `Успешные посты чаще всего были в формате: ${patterns.contentTypes}`,
      priority: 'high'
    };
  }

  getStyleRecommendation(patterns) {
    return {
      type: 'style',
      title: 'Стиль контента',
      message: `Популярные темы: ${patterns.commonThemes.join(', ')}`,
      priority: 'medium'
    };
  }

  getCTArecommendation(patterns) {
    return {
      type: 'cta',
      title: 'Призыв к действию',
      message: `Оптимальная длина поста: ${patterns.bestLength} символов`,
      priority: 'low'
    };
  }
}

module.exports = new AIController();