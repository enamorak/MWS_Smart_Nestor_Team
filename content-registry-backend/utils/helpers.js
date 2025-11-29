// Utility functions
class Helpers {
  static formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  static calculateEngagementRate(post) {
    const engagement = post.likes + (post.comments * 2) + (post.reposts * 3);
    return (engagement / (post.views || 1)) * 100;
  }

  static getSentimentLabel(positive, neutral, negative) {
    if (positive > neutral && positive > negative) return 'positive';
    if (negative > positive && negative > neutral) return 'negative';
    return 'neutral';
  }

  static formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  static generateColorFromText(text) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
  }

  static validateAPIKeys() {
    const requiredKeys = [
      'VK_SERVICE_TOKEN',
      'OPENROUTER_API_KEY', 
      'MWS_API_KEY'
    ];

    const missing = requiredKeys.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.warn('Missing environment variables:', missing);
      return false;
    }

    return true;
  }

  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static sanitizeText(text) {
    if (!text) return '';
    return text
      .replace(/[<>]/g, '')
      .substring(0, 1000); // Limit length
  }
}

module.exports = Helpers;