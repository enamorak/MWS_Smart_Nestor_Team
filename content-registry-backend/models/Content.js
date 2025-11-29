// Data models for content items
class Content {
  constructor(data) {
    this.id = data.id;
    this.vk_id = data.vk_id;
    this.owner_id = data.owner_id;
    this.title = data.title;
    this.text = data.text;
    this.date = data.date;
    this.type = data.type;
    this.views = data.views || 0;
    this.likes = data.likes || 0;
    this.comments = data.comments || 0;
    this.reposts = data.reposts || 0;
    this.sentiment_positive = data.sentiment_positive || 0;
    this.sentiment_neutral = data.sentiment_neutral || 0;
    this.sentiment_negative = data.sentiment_negative || 0;
    this.key_themes = data.key_themes || [];
    this.mood_summary = data.mood_summary || '';
    this.link = data.link;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      vk_id: this.vk_id,
      owner_id: this.owner_id,
      title: this.title,
      text: this.text,
      date: this.date,
      type: this.type,
      views: this.views,
      likes: this.likes,
      comments: this.comments,
      reposts: this.reposts,
      sentiment_positive: this.sentiment_positive,
      sentiment_neutral: this.sentiment_neutral,
      sentiment_negative: this.sentiment_negative,
      key_themes: this.key_themes,
      mood_summary: this.mood_summary,
      link: this.link,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  calculateEngagement() {
    return this.likes + (this.comments * 2) + (this.reposts * 3);
  }

  getEngagementRate() {
    return (this.calculateEngagement() / (this.views || 1)) * 100;
  }

  getSentiment() {
    const max = Math.max(
      this.sentiment_positive,
      this.sentiment_neutral, 
      this.sentiment_negative
    );
    
    if (max === this.sentiment_positive) return 'positive';
    if (max === this.sentiment_negative) return 'negative';
    return 'neutral';
  }
}

module.exports = Content;