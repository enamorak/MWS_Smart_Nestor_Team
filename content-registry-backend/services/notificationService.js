class NotificationService {
  constructor() {
    this.notifications = [];
    this.patterns = [];
  }

  analyzeContentPatterns(contentItems) {
    const patterns = {
      bestPostingTime: this.findBestPostingTime(contentItems),
      contentTypePerformance: this.analyzeContentTypePerformance(contentItems),
      engagementPatterns: this.analyzeEngagementPatterns(contentItems),
      sentimentTrends: this.analyzeSentimentTrends(contentItems)
    };

    this.patterns = patterns;
    this.generateNotifications(patterns);
    
    return patterns;
  }

  findBestPostingTime(contentItems) {
    const timeSlots = {};
    
    contentItems.forEach(item => {
      const hour = new Date(item.date).getHours();
      const timeSlot = this.getTimeSlot(hour);
      
      if (!timeSlots[timeSlot]) {
        timeSlots[timeSlot] = { total: 0, count: 0, items: [] };
      }
      
      const engagementRate = (item.likes + item.comments * 2 + item.reposts * 3) / (item.views || 1);
      timeSlots[timeSlot].total += engagementRate;
      timeSlots[timeSlot].count += 1;
      timeSlots[timeSlot].items.push(item);
    });

    // Find best time slot
    let bestSlot = null;
    let bestAvg = 0;
    
    Object.keys(timeSlots).forEach(slot => {
      const avg = timeSlots[slot].total / timeSlots[slot].count;
      if (avg > bestAvg) {
        bestAvg = avg;
        bestSlot = slot;
      }
    });

    return {
      bestTimeSlot: bestSlot,
      averageEngagement: bestAvg,
      recommendation: `Лучшее время для публикации: ${bestSlot} (на ${Math.round((bestAvg) * 100)}% выше средней вовлеченности)`
    };
  }

  analyzeContentTypePerformance(contentItems) {
    const typePerformance = {};
    
    contentItems.forEach(item => {
      if (!typePerformance[item.type]) {
        typePerformance[item.type] = {
          total: 0,
          count: 0,
          avgViews: 0,
          avgLikes: 0,
          avgComments: 0
        };
      }
      
      typePerformance[item.type].total += item.views;
      typePerformance[item.type].count += 1;
      typePerformance[item.type].avgViews += item.views;
      typePerformance[item.type].avgLikes += item.likes;
      typePerformance[item.type].avgComments += item.comments;
    });

    // Calculate averages
    Object.keys(typePerformance).forEach(type => {
      const data = typePerformance[type];
      data.avgViews = data.avgViews / data.count;
      data.avgLikes = data.avgLikes / data.count;
      data.avgComments = data.avgComments / data.count;
    });

    return typePerformance;
  }

  analyzeEngagementPatterns(contentItems) {
    const patterns = {
      questionPosts: this.analyzeQuestionPosts(contentItems),
      emotionalPosts: this.analyzeEmotionalPosts(contentItems),
      lengthImpact: this.analyzeLengthImpact(contentItems)
    };

    return patterns;
  }

  analyzeQuestionPosts(contentItems) {
    const questionPosts = contentItems.filter(item => 
      item.text.includes('?') || 
      item.title.includes('?') ||
      item.text.toLowerCase().includes('как') ||
      item.text.toLowerCase().includes('почему') ||
      item.text.toLowerCase().includes('что вы думаете')
    );

    const regularPosts = contentItems.filter(item => 
      !questionPosts.includes(item)
    );

    const questionEngagement = questionPosts.reduce((sum, item) => 
      sum + (item.comments / (item.views || 1)), 0) / (questionPosts.length || 1);
    
    const regularEngagement = regularPosts.reduce((sum, item) => 
      sum + (item.comments / (item.views || 1)), 0) / (regularPosts.length || 1);

    const multiplier = questionEngagement / (regularEngagement || 1);

    return {
      hasPattern: multiplier > 1.5,
      multiplier: multiplier,
      recommendation: multiplier > 1.5 ? 
        `Посты с вопросами получают в ${multiplier.toFixed(1)} раза больше комментариев` :
        'Нет значимой разницы в вовлеченности постов с вопросами'
    };
  }

  getTimeSlot(hour) {
    if (hour >= 6 && hour < 12) return 'Утро (6:00-12:00)';
    if (hour >= 12 && hour < 18) return 'День (12:00-18:00)';
    if (hour >= 18 && hour < 24) return 'Вечер (18:00-24:00)';
    return 'Ночь (0:00-6:00)';
  }

  generateNotifications(patterns) {
    this.notifications = [];

    // Best time notification
    if (patterns.bestPostingTime.bestTimeSlot) {
      this.notifications.push({
        id: 'best_time',
        type: 'high',
        title: 'Лучшее время для публикации',
        message: patterns.bestPostingTime.recommendation,
        category: 'timing',
        timestamp: new Date().toISOString()
      });
    }

    // Content type performance
    const typePerf = patterns.contentTypePerformance;
    const bestType = Object.keys(typePerf).reduce((best, type) => {
      if (!best || typePerf[type].avgViews > typePerf[best].avgViews) return type;
      return best;
    }, null);

    if (bestType) {
      this.notifications.push({
        id: 'best_content_type',
        type: 'medium',
        title: 'Самый эффективный тип контента',
        message: `Контент типа "${bestType}" показывает самую высокую среднюю вовлеченность`,
        category: 'content_type',
        timestamp: new Date().toISOString()
      });
    }

    // Question posts pattern
    if (patterns.engagementPatterns.questionPosts.hasPattern) {
      this.notifications.push({
        id: 'question_posts',
        type: 'high',
        title: 'Эффективность постов с вопросами',
        message: patterns.engagementPatterns.questionPosts.recommendation,
        category: 'engagement',
        timestamp: new Date().toISOString()
      });
    }

    // Sentiment trends
    if (patterns.sentimentTrends.negativeTrend) {
      this.notifications.push({
        id: 'negative_trend',
        type: 'high',
        title: 'Рост негативных комментариев',
        message: 'Замечен рост доли негативных комментариев в последних публикациях',
        category: 'sentiment',
        timestamp: new Date().toISOString()
      });
    }
  }

  analyzeSentimentTrends(contentItems) {
    const recentItems = contentItems
      .filter(item => new Date(item.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .slice(0, 10);

    const olderItems = contentItems
      .filter(item => new Date(item.date) <= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .slice(-10);

    const recentNegativeAvg = recentItems.reduce((sum, item) => sum + (item.sentiment_negative || 0), 0) / (recentItems.length || 1);
    const olderNegativeAvg = olderItems.reduce((sum, item) => sum + (item.sentiment_negative || 0), 0) / (olderItems.length || 1);

    return {
      negativeTrend: recentNegativeAvg > olderNegativeAvg * 1.2,
      recentNegativeAvg,
      olderNegativeAvg
    };
  }

  analyzeEmotionalPosts(contentItems) {
    // Simple emotional word analysis
    const emotionalWords = ['отлично', 'прекрасно', 'ужасно', 'плохо', 'здорово', 'супер', 'грустно', 'рад'];
    const emotionalPosts = contentItems.filter(item => 
      emotionalWords.some(word => 
        item.text.toLowerCase().includes(word) || 
        item.title.toLowerCase().includes(word)
      )
    );

    return {
      count: emotionalPosts.length,
      percentage: (emotionalPosts.length / contentItems.length) * 100
    };
  }

  analyzeLengthImpact(contentItems) {
    const shortPosts = contentItems.filter(item => item.text.length < 100);
    const longPosts = contentItems.filter(item => item.text.length >= 100);

    const shortEngagement = shortPosts.reduce((sum, item) => sum + item.likes, 0) / (shortPosts.length || 1);
    const longEngagement = longPosts.reduce((sum, item) => sum + item.likes, 0) / (longPosts.length || 1);

    return {
      shortPosts: { count: shortPosts.length, avgEngagement: shortEngagement },
      longPosts: { count: longPosts.length, avgEngagement: longEngagement },
      recommendation: shortEngagement > longEngagement ? 
        'Короткие посты (<100 символов) показывают лучшую вовлеченность' :
        'Длинные посты (≥100 символов) показывают лучшую вовлеченность'
    };
  }

  getNotifications(priority = 'all') {
    if (priority === 'all') {
      return this.notifications;
    }
    return this.notifications.filter(notification => notification.type === priority);
  }

  clearNotifications() {
    this.notifications = [];
  }
}

module.exports = new NotificationService();