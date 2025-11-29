const vkService = require('../services/vkService');
const aiService = require('../services/aiService');
const mwsService = require('../services/mwsService');
const notificationService = require('../services/notificationService');

class VKController {
  async syncContent(req, res) {
    try {
      const { groupId, count } = req.body;
      
      console.log('Starting VK content sync...');
      
      // Get posts from VK
      const posts = await vkService.getGroupPosts(groupId || process.env.VK_GROUP_ID, count || 100);
      
      console.log(`Fetched ${posts.length} posts from VK`);
      
      // Enrich posts with AI analysis for posts with comments
      const enrichedPosts = await this.enrichPostsWithAIAnalysis(posts);
      
      // Sync with MWS Tables
      const syncResult = await mwsService.syncContentData(enrichedPosts);
      
      // Analyze patterns for notifications
      const patterns = notificationService.analyzeContentPatterns(enrichedPosts);
      
      res.json({
        success: true,
        message: `Successfully synced ${syncResult.length} posts`,
        stats: {
          totalPosts: posts.length,
          withComments: enrichedPosts.filter(p => p.comments > 0).length,
          analyzedPosts: enrichedPosts.filter(p => p.sentiment_positive !== undefined).length
        },
        patterns: patterns,
        notifications: notificationService.getNotifications()
      });
      
    } catch (error) {
      console.error('Sync error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async enrichPostsWithAIAnalysis(posts) {
    const enrichedPosts = [];
    
    for (const post of posts) {
      try {
        let enrichedPost = { ...post };
        
        // Only analyze posts with comments
        if (post.comments > 0) {
          const comments = await vkService.getPostComments(post.owner_id, post.vk_id);
          
          if (comments.items && comments.items.length > 0) {
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
        enrichedPosts.push(post); // Add post without analysis
      }
    }
    
    return enrichedPosts;
  }

  async getPostDetails(req, res) {
    try {
      const { ownerId, postId } = req.params;
      
      const [post, comments, likes] = await Promise.all([
        vkService.getGroupPosts(Math.abs(ownerId), 1).then(posts => posts.find(p => p.vk_id == postId)),
        vkService.getPostComments(ownerId, postId),
        vkService.getPostLikes(ownerId, postId)
      ]);

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // AI analysis for detailed view
      let sentimentAnalysis = {};
      if (comments.items && comments.items.length > 0) {
        sentimentAnalysis = await aiService.analyzeSentiment(comments.items);
      }

      res.json({
        post,
        engagement: {
          comments: comments.items || [],
          likes: likes.items || [],
          comments_count: comments.count || 0,
          likes_count: likes.count || 0
        },
        analysis: sentimentAnalysis,
        metrics: {
          engagement_rate: ((post.likes + post.comments * 2 + post.reposts * 3) / (post.views || 1)) * 100,
          virality_rate: (post.reposts / (post.views || 1)) * 100
        }
      });
      
    } catch (error) {
      console.error('Error getting post details:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getGroupStats(req, res) {
    try {
      const { groupId } = req.params;
      
      const posts = await vkService.getGroupPosts(groupId, 100);
      
      const stats = this.calculateGroupStats(posts);
      
      res.json({
        success: true,
        stats: stats,
        summary: {
          total_posts: posts.length,
          date_range: {
            start: posts[posts.length - 1]?.date,
            end: posts[0]?.date
          }
        }
      });
      
    } catch (error) {
      console.error('Error getting group stats:', error);
      res.status(500).json({ error: error.message });
    }
  }

  calculateGroupStats(posts) {
    const totalEngagement = posts.reduce((sum, post) => 
      sum + post.likes + post.comments * 2 + post.reposts * 3, 0);
    
    const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
    
    const contentTypeStats = posts.reduce((stats, post) => {
      if (!stats[post.type]) {
        stats[post.type] = { count: 0, total_engagement: 0, total_views: 0 };
      }
      stats[post.type].count += 1;
      stats[post.type].total_engagement += post.likes + post.comments * 2 + post.reposts * 3;
      stats[post.type].total_views += post.views;
      return stats;
    }, {});

    // Calculate averages
    Object.keys(contentTypeStats).forEach(type => {
      const stat = contentTypeStats[type];
      stat.avg_engagement = stat.total_engagement / stat.count;
      stat.avg_views = stat.total_views / stat.count;
      stat.engagement_rate = (stat.avg_engagement / (stat.avg_views || 1)) * 100;
    });

    return {
      total_posts: posts.length,
      total_engagement: totalEngagement,
      total_views: totalViews,
      avg_engagement_rate: (totalEngagement / (totalViews || 1)) * 100,
      content_type_stats: contentTypeStats,
      top_posts: posts
        .sort((a, b) => (b.likes + b.comments * 2) - (a.likes + a.comments * 2))
        .slice(0, 5)
    };
  }
}

module.exports = new VKController();