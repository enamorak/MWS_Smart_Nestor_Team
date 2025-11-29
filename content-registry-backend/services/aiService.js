const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.baseURL = process.env.OPENROUTER_BASE_URL;
  }

  async analyzeSentiment(comments) {
    try {
      const commentTexts = comments
        .map(comment => comment.text)
        .filter(text => text && text.length > 0)
        .slice(0, 50); // Limit to 50 comments for analysis

      if (commentTexts.length === 0) {
        return {
          sentiment: { positive: 0, neutral: 100, negative: 0 },
          key_themes: [],
          mood_summary: 'Нет комментариев для анализа'
        };
      }

      const prompt = this.createSentimentAnalysisPrompt(commentTexts);

      const response = await axios.post(`${this.baseURL}/chat/completions`, {
        model: "meta-llama/llama-3-8b-instruct:free",
        messages: [
          {
            role: "system",
            content: "Ты - аналитик социальных медиа. Анализируй тональность комментариев и выявляй ключевые темы. Возвращай ответ в формате JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('AI Analysis Error:', error.message);
      return this.getDefaultSentimentAnalysis();
    }
  }

  createSentimentAnalysisPrompt(comments) {
    return `
Проанализируй тональность следующих комментариев из социальной сети и определи ключевые темы обсуждения.

Комментарии:
${comments.map((comment, index) => `${index + 1}. ${comment}`).join('\n')}

Верни ответ в формате JSON:
{
  "sentiment": {
    "positive": число от 0 до 100,
    "neutral": число от 0 до 100, 
    "negative": число от 0 до 100
  },
  "key_themes": ["тема1", "тема2", ...],
  "mood_summary": "краткое описание настроения аудитории"
}

Сумма positive + neutral + negative должна равняться 100.
    `;
  }

  async predictPopularity(contentData) {
    try {
      const prompt = this.createPredictionPrompt(contentData);

      const response = await axios.post(`${this.baseURL}/chat/completions`, {
        model: "meta-llama/llama-3-8b-instruct:free",
        messages: [
          {
            role: "system",
            content: "Ты - эксперт по прогнозированию популярности контента в социальных сетях. Анализируй контент и давай реалистичные прогнозы."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 800
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Prediction Error:', error.message);
      return this.getDefaultPrediction();
    }
  }

  createPredictionPrompt(contentData) {
    return `
Спрогнозируй популярность следующего контента для социальной сети:

Заголовок: ${contentData.title}
Текст: ${contentData.content}
Тип контента: ${contentData.type}
Длина текста: ${contentData.content?.length || 0} символов

Верни ответ в формате JSON:
{
  "predicted_reach": { "min": число, "max": число, "avg": число },
  "predicted_engagement": {
    "likes": { "min": число, "max": число, "avg": число },
    "comments": { "min": число, "max": число, "avg": число },
    "shares": { "min": число, "max": число, "avg": число }
  },
  "best_posting_time": "рекомендуемое время публикации",
  "improvement_recommendations": ["рекомендация1", "рекомендация2", ...],
  "confidence_score": число от 0 до 100
}

Будь реалистичным в прогнозах. Учитывай тип контента и длину текста.
    `;
  }

  async generateBotResponse(userQuestion, contextData) {
    try {
      const prompt = this.createBotPrompt(userQuestion, contextData);

      const response = await axios.post(`${this.baseURL}/chat/completions`, {
        model: "meta-llama/llama-3-8b-instruct:free",
        messages: [
          {
            role: "system",
            content: "Ты - AI ассистент для анализа контента. Отвечай полезно и точно на основе предоставленных данных."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Bot Response Error:', error.message);
      return "Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте позже.";
    }
  }

  createBotPrompt(question, context) {
    return `
Пользователь задает вопрос о контенте: "${question}"

Контекстные данные:
${JSON.stringify(context, null, 2)}

Ответь на вопрос пользователя ясно и полезно. Если нужны конкретные цифры - используй данные из контекста. Будь дружелюбным и профессиональным.
    `;
  }

  getDefaultSentimentAnalysis() {
    return {
      sentiment: { positive: 33, neutral: 34, negative: 33 },
      key_themes: ["общее обсуждение"],
      mood_summary: "Нейтральное настроение аудитории"
    };
  }

  getDefaultPrediction() {
    return {
      predicted_reach: { min: 1000, max: 5000, avg: 2500 },
      predicted_engagement: {
        likes: { min: 50, max: 200, avg: 100 },
        comments: { min: 10, max: 50, avg: 25 },
        shares: { min: 5, max: 20, avg: 10 }
      },
      best_posting_time: "18:00-20:00",
      improvement_recommendations: ["Добавьте призыв к действию", "Используйте более эмоциональный заголовок"],
      confidence_score: 65
    };
  }
}

module.exports = new AIService();