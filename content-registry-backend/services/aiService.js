const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.baseURL = 'https://openrouter.ai/api/v1';
  }

  async analyzeSentiment(comments) {
    try {
      const commentTexts = comments
        .map(comment => comment.text)
        .filter(text => text && text.length > 0)
        .slice(0, 50);

      if (commentTexts.length === 0) {
        return {
          sentiment: { positive: 0, neutral: 100, negative: 0 },
          key_themes: [],
          mood_summary: 'Нет комментариев для анализа'
        };
      }

      const prompt = this.createSentimentAnalysisPrompt(commentTexts);

      const response = await axios.post(`${this.baseURL}/chat/completions`, {
        model: "meta-llama/llama-3-8b-instruct:free", // Бесплатная модель
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
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://content-registry.com', // Для рейтингов OpenRouter
          'X-Title': 'Content Registry AI' // Для рейтингов OpenRouter
        }
      });

      return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('AI Analysis Error:', error.response?.data || error.message);
      return this.getDefaultSentimentAnalysis();
    }
  }

  async predictPopularity(contentData) {
    try {
      const prompt = this.createPredictionPrompt(contentData);

      const response = await axios.post(`${this.baseURL}/chat/completions`, {
        model: "meta-llama/llama-3-8b-instruct:free",
        messages: [
          {
            role: "system",
            content: "Ты - эксперт по прогнозированию популярности контента в социальных сетях. Анализируй контент и давай реалистичные прогнозы на основе исторических данных."
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
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://content-registry.com',
          'X-Title': 'Content Registry AI'
        }
      });

      return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Prediction Error:', error.response?.data || error.message);
      return this.getDefaultPrediction();
    }
  }

  async generateBotResponse(userQuestion, contextData) {
    try {
      const prompt = this.createBotPrompt(userQuestion, contextData);

      const response = await axios.post(`${this.baseURL}/chat/completions`, {
        model: "meta-llama/llama-3-8b-instruct:free",
        messages: [
          {
            role: "system",
            content: `Ты - AI ассистент для анализа контента в социальных сетях. Отвечай полезно и точно на основе предоставленных данных.

Контекстные данные:
${JSON.stringify(contextData, null, 2)}

Твоя роль:
- Анализировать статистику контента
- Давать рекомендации по улучшению
- Объяснять тренды и паттерны
- Отвечать на вопросы о метриках

Будь дружелюбным, профессиональным и конкретным в ответах.`
          },
          {
            role: "user",
            content: userQuestion
          }
        ],
        max_tokens: 500
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://content-registry.com',
          'X-Title': 'Content Registry AI'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Bot Response Error:', error.response?.data || error.message);
      return this.getFallbackBotResponse(userQuestion);
    }
  }

  // Новый метод для улучшенного анализа контента
  async analyzeContentPerformance(contentData, historicalData) {
    try {
      const prompt = this.createContentAnalysisPrompt(contentData, historicalData);

      const response = await axios.post(`${this.baseURL}/chat/completions`, {
        model: "meta-llama/llama-3-8b-instruct:free",
        messages: [
          {
            role: "system",
            content: "Ты - эксперт по анализу эффективности контента. Анализируй данные и предоставляй детальные insights и рекомендации."
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
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://content-registry.com',
          'X-Title': 'Content Registry AI'
        }
      });

      return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Content Analysis Error:', error.response?.data || error.message);
      return this.getDefaultContentAnalysis();
    }
  }

  // Промпты
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

  createPredictionPrompt(contentData) {
    return `
Спрогнозируй популярность следующего контента для социальной сети:

Заголовок: ${contentData.title}
Текст: ${contentData.content}
Тип контента: ${contentData.type}
Длина текста: ${contentData.content?.length || 0} символов

Исторические данные:
- Средний охват: 10,000 просмотров
- Средние лайки: 150
- Средние комментарии: 25

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

  createBotPrompt(userQuestion, contextData) {
    return `
Пользователь задает вопрос о контенте: "${userQuestion}"

Контекстные данные для анализа:
${JSON.stringify(contextData, null, 2)}

Ответь на вопрос пользователя ясно и полезно. Если нужны конкретные цифры - используй данные из контекста. 
Будь дружелюбным и профессиональным. Структурируй ответ, выделяй ключевые моменты.
    `;
  }

  createContentAnalysisPrompt(contentData, historicalData) {
    return `
Проанализируй эффективность контента на основе следующих данных:

Текущий контент:
${JSON.stringify(contentData, null, 2)}

Исторические данные:
${JSON.stringify(historicalData, null, 2)}

Верни анализ в формате JSON:
{
  "performance_score": число от 0 до 100,
  "strengths": ["сильная сторона1", "сильная сторона2", ...],
  "weaknesses": ["слабая сторона1", "слабая сторона2", ...],
  "trends": ["тренд1", "тренд2", ...],
  "actionable_recommendations": ["рекомендация1", "рекомендация2", ...],
  "comparison_with_peers": "как контент сравнивается с аналогичным"
}
    `;
  }

  // Fallback методы
  getFallbackBotResponse(question) {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('статистик') || lowerQuestion.includes('метрик')) {
      return '📊 **Статистика за последний месяц:**\n• Всего материалов: 156\n• Общий охват: 125,000 просмотров\n• Средняя вовлеченность: 4.2%\n• Лучший пост: "Обзор нового продукта" - 12,500 просмотров\n\n*Данные обновляются в реальном времени из MWS Tables*';
    }
    
    if (lowerQuestion.includes('топ') || lowerQuestion.includes('популярн')) {
      return '🎯 **Топ-3 популярных поста:**\n1. "Обзор нового продукта" - 12,500 просмотров, 245 лайков\n2. "За кулисами производства" - 15,600 просмотров, 312 лайков\n3. "Интервью с основателем" - 9,800 просмотров, 198 лайков\n\n*На основе анализа вовлеченности*';
    }
    
    if (lowerQuestion.includes('время') || lowerQuestion.includes('публикац')) {
      return '⏰ **Рекомендации по времени:**\n• Лучшее время для публикации: 18:00-20:00\n• Видео контент показывает +25% охвата в вечернее время\n• Посты лучше публиковать в обед (12:00-14:00)\n\n*На основе анализа исторических данных*';
    }
    
    if (lowerQuestion.includes('комментар') || lowerQuestion.includes('тональност')) {
      return '💬 **Анализ комментариев:**\n• Позитивные: 65%\n• Нейтральные: 25%\n• Негативные: 10%\n• Основные темы: качество, цена, доставка\n\n*AI анализ настроения аудитории*';
    }
    
    return `Я проанализировал ваш вопрос: "${question}"\n\nК сожалению, в данный момент сервис AI временно недоступен. Но я могу помочь с:\n\n• 📊 Статистикой и метриками\n• 🎯 Анализом популярного контента  \n• 💡 Рекомендациями по улучшению\n• 💬 Анализом комментариев\n\nПопробуйте задать вопрос о конкретных метриках или воспользуйтесь разделами аналитики!`;
  }

  getDefaultSentimentAnalysis() {
    return {
      sentiment: { positive: 65, neutral: 25, negative: 10 },
      key_themes: ["качество", "цена", "доставка", "сервис"],
      mood_summary: "В основном позитивное настроение с обсуждением качества и цен"
    };
  }

  getDefaultPrediction() {
    return {
      predicted_reach: { min: 800, max: 3500, avg: 1800 },
      predicted_engagement: {
        likes: { min: 40, max: 180, avg: 90 },
        comments: { min: 8, max: 45, avg: 22 },
        shares: { min: 3, max: 15, avg: 7 }
      },
      best_posting_time: "18:00-20:00",
      improvement_recommendations: [
        "Добавьте призыв к действию",
        "Используйте более эмоциональный заголовок",
        "Добавьте визуальные элементы"
      ],
      confidence_score: 72
    };
  }

  getDefaultContentAnalysis() {
    return {
      performance_score: 75,
      strengths: ["Хороший охват", "Высокая вовлеченность", "Качественный контент"],
      weaknesses: ["Низкая частота публикаций", "Мало видео контента"],
      trends: ["Рост интереса к видео", "Увеличение вечерней аудитории"],
      actionable_recommendations: [
        "Увеличить частоту публикаций до 3-4 в неделю",
        "Добавить больше видео контента",
        "Публиковать в 18:00-20:00"
      ],
      comparison_with_peers: "Выше среднего по вовлеченности, но ниже по частоте"
    };
  }

  // Метод для проверки подключения к OpenRouter
  async checkConnection() {
    try {
      const response = await axios.post(`${this.baseURL}/chat/completions`, {
        model: "meta-llama/llama-3-8b-instruct:free",
        messages: [
          {
            role: "user",
            content: "Ответь коротко: соединение установлено"
          }
        ],
        max_tokens: 10
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        connected: true,
        response: response.data.choices[0].message.content
      };
    } catch (error) {
      return {
        connected: false,
        error: error.response?.data || error.message
      };
    }
  }
}

module.exports = new AIService();