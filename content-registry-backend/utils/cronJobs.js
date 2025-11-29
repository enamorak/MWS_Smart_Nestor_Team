const cron = require('node-cron');
const vkService = require('../services/vkService');
const mwsService = require('../services/mwsService');
const notificationService = require('../services/notificationService');

class CronJobs {
  initScheduledJobs() {
    // Schedule data sync every 30 minutes
    cron.schedule('*/30 * * * *', async () => {
      console.log('Running scheduled data sync...');
      await this.syncVKData();
    });

    // Schedule daily analysis at 9:00 AM
    cron.schedule('0 9 * * *', async () => {
      console.log('Running daily analysis...');
      await this.runDailyAnalysis();
    });

    // Schedule notification check every hour
    cron.schedule('0 * * * *', async () => {
      console.log('Checking for new notifications...');
      await this.checkNotifications();
    });

    console.log('Cron jobs initialized');
  }

  async syncVKData() {
    try {
      const groupId = process.env.VK_GROUP_ID;
      
      if (!groupId || groupId === 'disabled') {
        console.log('VK sync disabled, using mock data');
        return;
      }

      console.log(`Syncing data for VK group: ${groupId}`);
      
      const posts = await vkService.getGroupPosts(groupId, 50);
      
      if (posts.length > 0) {
        // Только если есть реальные данные
        const enrichedPosts = await this.enrichPostsWithAnalysis(posts);
        await mwsService.syncContentData(enrichedPosts);
        console.log(`Successfully synced ${enrichedPosts.length} posts`);
      }
      
    } catch (error) {
      console.error('Scheduled sync error (using mock data):', error.message);
    }
  }

  async enrichPostsWithAnalysis(posts) {
    const enrichedPosts = [];
    
    for (const post of posts) {
      try {
        let enrichedPost = { ...post };
        
        // Only analyze posts with comments to avoid unnecessary API calls
        if (post.comments > 0 && process.env.AI_ANALYSIS_ENABLED === 'true') {
          const comments = await vkService.getPostComments(post.owner_id, post.vk_id);
          
          if (comments.items && comments.items.length > 0) {
            const aiService = require('../services/aiService');
            const analysis = await aiService.analyzeSentiment(comments.items);
            
            enrichedPost.sentiment_positive = analysis.sentiment.positive;
            enrichedPost.sentiment_neutral = analysis.sentiment.neutral;
            enrichedPost.sentiment_negative = analysis.sentiment.negative;
            enrichedPost.key_themes = analysis.key_themes;
            enrichedPost.mood_summary = analysis.mood_summary;
          }
        }
        
        enrichedPosts.push(enrichedPost);
      } catch (error) {
        console.error(`Error enriching post ${post.id}:`, error.message);
        enrichedPosts.push(post);
      }
    }
    
    return enrichedPosts;
  }

  async runDailyAnalysis() {
    try {
      console.log('Running daily content analysis...');
      
      // Get recent data
      const data = await mwsService.getTableData('content_registry', {
        order_by: 'date desc',
        limit: 100
      });

      if (data.rows && data.rows.length > 0) {
        // Analyze patterns
        const patterns = notificationService.analyzeContentPatterns(data.rows);
        
        // Generate daily report
        const report = this.generateDailyReport(data.rows, patterns);
        
        console.log('Daily analysis completed:', report.summary);
        
        // Here you could send the report via email or save it
        this.saveDailyReport(report);
      }
      
    } catch (error) {
      console.error('Daily analysis error:', error);
    }
  }

  generateDailyReport(posts, patterns) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const yesterdayPosts = posts.filter(post => 
      new Date(post.date) >= yesterday
    );

    const stats = {
      total_posts: posts.length,
      new_posts: yesterdayPosts.length,
      total_engagement: posts.reduce((sum, post) => sum + post.likes + post.comments, 0),
      avg_sentiment: posts.reduce((sum, post) => sum + (post.sentiment_positive || 0), 0) / posts.length,
      top_performer: posts.reduce((best, post) => 
        (post.likes + post.comments) > (best.likes + best.comments) ? post : best, posts[0]
      )
    };

    return {
      date: new Date().toISOString().split('T')[0],
      summary: `Проанализировано ${posts.length} постов, ${yesterdayPosts.length} новых`,
      stats: stats,
      patterns: patterns,
      notifications: notificationService.getNotifications(),
      recommendations: this.generateDailyRecommendations(stats, patterns)
    };
  }

  generateDailyRecommendations(stats, patterns) {
    const recommendations = [];
    
    if (stats.avg_sentiment < 30) {
      recommendations.push('Обратите внимание на рост негативных комментариев');
    }
    
    if (stats.new_posts === 0) {
      recommendations.push('За вчерашний день не было новых постов');
    }
    
    if (patterns.bestPostingTime) {
      recommendations.push(patterns.bestPostingTime.recommendation);
    }
    
    return recommendations;
  }

  saveDailyReport(report) {
    // In production, save to database or send via email
    console.log('Daily Report:', JSON.stringify(report, null, 2));
  }

  async checkNotifications() {
    try {
      // Используем мок-данные вместо реального MWS API
      const mockData = {
        rows: [
          {
            id: '1',
            title: 'Тестовый пост',
            date: new Date().toISOString(),
            views: 15000,
            likes: 300,
            comments: 45,
            sentiment_positive: 75,
            sentiment_neutral: 15,
            sentiment_negative: 10
          }
        ]
      };

      notificationService.analyzeContentPatterns(mockData.rows);
      const notifications = notificationService.getNotifications('high');
      
      if (notifications.length > 0) {
        console.log(`Found ${notifications.length} notifications`);
      }
      
    } catch (error) {
      console.error('Notification check error (mock mode):', error.message);
    }
  }
}

module.exports = new CronJobs();