const axios = require('axios');

class VKService {
  constructor() {
    this.baseURL = 'https://api.vk.com/method';
    this.serviceToken = process.env.VK_SERVICE_TOKEN;
    this.version = '5.131';
  }

  async getGroupPosts(groupId, count = 100) {
    try {
      // Если VK отключен, возвращаем мок-данные
      if (groupId === 'disabled' || !this.serviceToken) {
        console.log('Using mock VK data');
        return this.getMockPosts(count);
      }

      // Остальной код VK API...
      const response = await axios.get(`${this.baseURL}/wall.get`, {
        // ... существующий код
      });

      return this.normalizePostsData(response.data.response);
    } catch (error) {
      console.error('Error fetching VK posts, using mock data:', error.message);
      return this.getMockPosts(count);
    }
  }

  getMockPosts(count = 10) {
    const mockPosts = [];
    for (let i = 0; i < count; i++) {
      mockPosts.push({
        id: `mock_${i}`,
        vk_id: i,
        owner_id: -123456,
        title: `Тестовый пост ${i + 1}`,
        text: `Это тестовый пост номер ${i + 1} с демонстрационными данными`,
        date: new Date(Date.now() - i * 86400000).toISOString(),
        type: i % 3 === 0 ? 'video' : i % 3 === 1 ? 'image' : 'post',
        views: Math.floor(Math.random() * 20000) + 1000,
        likes: Math.floor(Math.random() * 500) + 50,
        comments: Math.floor(Math.random() * 100) + 10,
        reposts: Math.floor(Math.random() * 50) + 5,
        link: `https://vk.com/wall-123456_${i}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    return mockPosts;
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