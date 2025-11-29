const axios = require('axios');

class VKService {
  constructor() {
    this.baseURL = 'https://api.vk.com/method';
    this.serviceToken = process.env.VK_SERVICE_TOKEN;
    this.version = '5.131';
  }

  async getGroupPosts(groupId, count = 100) {
    try {
      const response = await axios.get(`${this.baseURL}/wall.get`, {
        params: {
          owner_id: -groupId,
          count: count,
          extended: 1,
          fields: 'id,first_name,last_name',
          access_token: this.serviceToken,
          v: this.version
        }
      });

      if (response.data.error) {
        throw new Error(`VK API Error: ${response.data.error.error_msg}`);
      }

      return this.normalizePostsData(response.data.response);
    } catch (error) {
      console.error('Error fetching VK posts:', error.message);
      throw error;
    }
  }

  async getPostComments(ownerId, postId) {
    try {
      const response = await axios.get(`${this.baseURL}/wall.getComments`, {
        params: {
          owner_id: ownerId,
          post_id: postId,
          extended: 1,
          need_likes: 1,
          count: 100,
          access_token: this.serviceToken,
          v: this.version
        }
      });

      return response.data.response || { items: [], profiles: [] };
    } catch (error) {
      console.error('Error fetching comments:', error.message);
      return { items: [], profiles: [] };
    }
  }

  normalizePostsData(response) {
    const posts = response.items;
    const groups = response.groups || [];
    const profiles = response.profiles || [];

    return posts.map(post => ({
      id: `${post.owner_id}_${post.id}`,
      vk_id: post.id,
      owner_id: post.owner_id,
      title: this.extractTitle(post.text),
      text: post.text,
      date: new Date(post.date * 1000).toISOString(),
      type: this.detectContentType(post),
      views: post.views?.count || 0,
      likes: post.likes?.count || 0,
      comments: post.comments?.count || 0,
      reposts: post.reposts?.count || 0,
      attachments: post.attachments || [],
      link: `https://vk.com/wall${post.owner_id}_${post.id}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
  }

  extractTitle(text) {
    // Extract first sentence or first 50 characters as title
    const firstSentence = text.split('.')[0];
    return firstSentence.length > 50 ? firstSentence.substring(0, 50) + '...' : firstSentence;
  }

  detectContentType(post) {
    if (post.attachments && post.attachments.length > 0) {
      const types = post.attachments.map(att => att.type);
      if (types.includes('video')) return 'video';
      if (types.includes('photo')) return 'image';
      if (types.includes('link')) return 'link';
      if (types.includes('poll')) return 'poll';
    }
    return 'post';
  }

  async getPostDetailedStats(ownerId, postId) {
    try {
      const [comments, likes] = await Promise.all([
        this.getPostComments(ownerId, postId),
        this.getPostLikes(ownerId, postId)
      ]);

      return {
        comments: comments.items || [],
        likes: likes.items || [],
        comments_count: comments.count || 0
      };
    } catch (error) {
      console.error('Error getting detailed stats:', error.message);
      return { comments: [], likes: [], comments_count: 0 };
    }
  }

  async getPostLikes(ownerId, postId) {
    try {
      const response = await axios.get(`${this.baseURL}/likes.getList`, {
        params: {
          type: 'post',
          owner_id: ownerId,
          item_id: postId,
          extended: 1,
          access_token: this.serviceToken,
          v: this.version
        }
      });

      return response.data.response || { items: [], count: 0 };
    } catch (error) {
      console.error('Error fetching likes:', error.message);
      return { items: [], count: 0 };
    }
  }
}

module.exports = new VKService();