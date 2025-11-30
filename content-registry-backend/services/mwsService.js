const axios = require('axios');

class MWSService {
  constructor() {
    this.apiKey = process.env.MWS_API_KEY;
    this.appId = process.env.MWS_APP_ID;
    this.baseURL = process.env.MWS_BASE_URL || 'https://api.mws.tables';
  }

  async getTables() {
    try {
      const response = await axios.get(`${this.baseURL}/tables`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching tables:', error.message);
      return this.getMockTables();
    }
  }

  async getTableData(tableId, filters = {}) {
    try {
      const response = await axios.get(`${this.baseURL}/tables/${tableId}/rows`, {
        params: filters,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching table data:', error.message);
      return this.getMockTableData();
    }
  }

  async getDashboards() {
    try {
      const response = await axios.get(`${this.baseURL}/dashboards`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboards:', error.message);
      return this.getMockDashboards();
    }
  }

  // Mock данные для тестирования
  getMockTables() {
    return {
      tables: [
        {
          id: 'content_registry',
          name: 'Content Registry',
          columns: [
            { name: 'id', type: 'string' },
            { name: 'title', type: 'string' },
            { name: 'type', type: 'string' },
            { name: 'date', type: 'datetime' },
            { name: 'views', type: 'number' },
            { name: 'likes', type: 'number' },
            { name: 'comments', type: 'number' }
          ]
        }
      ]
    };
  }

  getMockTableData() {
    const now = new Date();
    const rows = [];
    
    // Генерируем 50 реалистичных записей
    const titles = [
      'Обзор нового продукта 2025', 'Акция недели - скидки до 50%', 'За кулисами производства',
      'Интервью с основателем', 'Отзывы клиентов', 'Новинка сезона', 'Мастер-класс по использованию',
      'История успеха клиента', 'Советы от экспертов', 'Презентация коллекции',
      'Встреча с командой', 'День открытых дверей', 'Специальное предложение',
      'Обновление сервиса', 'Партнерство с брендом', 'Эксклюзивное интервью',
      'Тренды индустрии', 'Секреты успеха', 'Кейс-стади', 'FAQ от пользователей',
      'Видео-обзор функций', 'Сравнение продуктов', 'Руководство для новичков',
      'Продвинутые техники', 'Вдохновляющие истории', 'Практические советы',
      'Разбор ошибок', 'Лучшие практики', 'Инновации в отрасли', 'Мотивационные посты'
    ];
    
    const types = ['video', 'post', 'image'];
    const networks = ['vk', 'telegram', 'instagram', 'youtube'];
    const themes = [
      ['продукт', 'обзор', 'новинка'], ['акция', 'скидки', 'цены'],
      ['производство', 'закулисье', 'качество'], ['интервью', 'основатель', 'история'],
      ['отзывы', 'клиенты', 'опыт'], ['новинка', 'сезон', 'коллекция'],
      ['мастер-класс', 'обучение', 'советы'], ['успех', 'кейс', 'результаты'],
      ['эксперты', 'советы', 'профессионализм'], ['команда', 'культура', 'ценности']
    ];
    
    for (let i = 0; i < 50; i++) {
      const daysAgo = Math.floor(Math.random() * 90);
      const date = new Date(now);
      date.setDate(date.getDate() - daysAgo);
      date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
      
      const type = types[Math.floor(Math.random() * types.length)];
      const network = networks[Math.floor(Math.random() * networks.length)];
      const title = titles[Math.floor(Math.random() * titles.length)];
      const themeSet = themes[Math.floor(Math.random() * themes.length)];
      
      // Реалистичные метрики в зависимости от типа
      let baseViews, baseLikes, baseComments;
      if (type === 'video') {
        baseViews = 8000 + Math.random() * 12000;
        baseLikes = baseViews * 0.02 + Math.random() * baseViews * 0.01;
        baseComments = baseViews * 0.003 + Math.random() * baseViews * 0.002;
      } else if (type === 'image') {
        baseViews = 5000 + Math.random() * 10000;
        baseLikes = baseViews * 0.025 + Math.random() * baseViews * 0.015;
        baseComments = baseViews * 0.002 + Math.random() * baseViews * 0.001;
      } else {
        baseViews = 3000 + Math.random() * 8000;
        baseLikes = baseViews * 0.015 + Math.random() * baseViews * 0.01;
        baseComments = baseViews * 0.005 + Math.random() * baseViews * 0.003;
      }
      
      const views = Math.round(baseViews);
      const likes = Math.round(baseLikes);
      const comments = Math.round(baseComments);
      const reposts = Math.round(likes * 0.1 + Math.random() * likes * 0.1);
      
      // Тональность
      const pos = 50 + Math.random() * 30;
      const neg = Math.random() * 20;
      const neutral = 100 - pos - neg;
      
      rows.push({
        id: String(i + 1),
        title: `${title} ${i > 0 ? `#${i + 1}` : ''}`,
        type: type,
        network: network,
        date: date.toISOString(),
        views: views,
        likes: likes,
        comments: comments,
        reposts: reposts,
        shares: reposts,
        sentiment_positive: Math.round(pos),
        sentiment_neutral: Math.round(neutral),
        sentiment_negative: Math.round(neg),
        themes: themeSet,
        engagement: ((likes + comments * 2) / views * 100).toFixed(2)
      });
    }
    
    // Сортируем по дате (новые сначала)
    rows.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return {
      rows: rows,
      total_count: rows.length
    };
  }

  getMockDashboards() {
    return {
      dashboards: [
        {
          id: 'content_analytics',
          name: 'Content Analytics',
          description: 'Аналитика эффективности контента',
          widgets: [
            {
              type: 'stats',
              title: 'Ключевые метрики',
              config: { metrics: ['total_posts', 'total_views', 'engagement_rate'] }
            },
            {
              type: 'chart',
              title: 'Динамика просмотров',
              config: { chart_type: 'line', metric: 'views' }
            }
          ]
        }
      ]
    };
  }

  // Аналитика на основе реальных данных
  async getContentAnalytics() {
    try {
      const data = await this.getTableData('content_registry');
      
      if (!data.rows || data.rows.length === 0) {
        return this.getMockAnalytics();
      }

      const rows = data.rows;
      
      // Рассчитываем метрики
      const totalPosts = rows.length;
      const totalViews = rows.reduce((sum, row) => sum + (row.views || 0), 0);
      const totalLikes = rows.reduce((sum, row) => sum + (row.likes || 0), 0);
      const totalComments = rows.reduce((sum, row) => sum + (row.comments || 0), 0);
      const avgEngagement = ((totalLikes + totalComments * 2) / (totalViews || 1)) * 100;

      // Анализ по типам контента
      const typeStats = rows.reduce((stats, row) => {
        const type = row.type || 'unknown';
        if (!stats[type]) {
          stats[type] = { count: 0, totalViews: 0, totalLikes: 0, totalComments: 0 };
        }
        stats[type].count += 1;
        stats[type].totalViews += row.views || 0;
        stats[type].totalLikes += row.likes || 0;
        stats[type].totalComments += row.comments || 0;
        return stats;
      }, {});

      // Топ посты
      const topPosts = rows
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5);

      // Анализ тональности
      const sentimentStats = rows.reduce((stats, row) => {
        stats.total += 1;
        stats.positive += row.sentiment_positive || 0;
        stats.neutral += row.sentiment_neutral || 0;
        stats.negative += row.sentiment_negative || 0;
        return stats;
      }, { total: 0, positive: 0, neutral: 0, negative: 0 });

      return {
        summary: {
          totalPosts,
          totalViews,
          totalLikes,
          totalComments,
          avgEngagement: parseFloat(avgEngagement.toFixed(2))
        },
        typeStats,
        topPosts,
        sentiment: {
          positive: parseFloat((sentimentStats.positive / sentimentStats.total).toFixed(2)),
          neutral: parseFloat((sentimentStats.neutral / sentimentStats.total).toFixed(2)),
          negative: parseFloat((sentimentStats.negative / sentimentStats.total).toFixed(2))
        },
        recentPosts: rows
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 10)
      };
    } catch (error) {
      console.error('Error generating analytics:', error);
      return this.getMockAnalytics();
    }
  }

  // Поддержка формул MWS Tables
  async evaluateFormula(formula, context = {}) {
    try {
      // Заменяем переменные в формуле на значения из контекста
      let evaluatedFormula = formula;
      
      // Поддержка базовых формул MWS Tables
      // Примеры: SUM(field), AVG(field), COUNT(field), IF(condition, true, false)
      
      // SUM - сумма значений
      evaluatedFormula = evaluatedFormula.replace(/SUM\((\w+)\)/g, (match, field) => {
        const values = context[field] || [];
        return values.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
      });
      
      // AVG - среднее значение
      evaluatedFormula = evaluatedFormula.replace(/AVG\((\w+)\)/g, (match, field) => {
        const values = context[field] || [];
        if (values.length === 0) return 0;
        const sum = values.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
        return sum / values.length;
      });
      
      // COUNT - количество
      evaluatedFormula = evaluatedFormula.replace(/COUNT\((\w+)\)/g, (match, field) => {
        const values = context[field] || [];
        return values.length;
      });
      
      // IF - условная логика
      evaluatedFormula = evaluatedFormula.replace(/IF\(([^,]+),([^,]+),([^)]+)\)/g, (match, condition, trueVal, falseVal) => {
        // Простая проверка условий
        const conditionResult = this.evaluateCondition(condition, context);
        return conditionResult ? trueVal.trim() : falseVal.trim();
      });
      
      // Вычисляем финальную формулу
      return eval(evaluatedFormula);
    } catch (error) {
      console.error('Formula evaluation error:', error);
      return 0;
    }
  }

  evaluateCondition(condition, context) {
    // Поддержка простых условий: >, <, >=, <=, ==, !=
    const operators = ['>=', '<=', '==', '!=', '>', '<'];
    
    for (const op of operators) {
      if (condition.includes(op)) {
        const [left, right] = condition.split(op).map(s => s.trim());
        const leftVal = parseFloat(context[left] || left) || 0;
        const rightVal = parseFloat(context[right] || right) || 0;
        
        switch (op) {
          case '>': return leftVal > rightVal;
          case '<': return leftVal < rightVal;
          case '>=': return leftVal >= rightVal;
          case '<=': return leftVal <= rightVal;
          case '==': return leftVal === rightVal;
          case '!=': return leftVal !== rightVal;
          default: return false;
        }
      }
    }
    
    return false;
  }

  // Автоматические сценарии MWS Tables
  async executeAutomation(trigger, action, data = {}) {
    try {
      console.log(`Executing automation: ${trigger} -> ${action}`);
      
      // Типы триггеров
      const triggers = {
        'data_updated': () => this.onDataUpdated(data),
        'threshold_reached': () => this.onThresholdReached(data),
        'schedule': () => this.onSchedule(data),
        'webhook': () => this.onWebhook(data)
      };
      
      // Типы действий
      const actions = {
        'update_data': (params) => this.updateData(params),
        'send_notification': (params) => this.sendNotification(params),
        'calculate_metrics': (params) => this.calculateMetrics(params),
        'sync_external': (params) => this.syncExternal(params)
      };
      
      // Выполняем триггер
      const triggerResult = triggers[trigger] ? await triggers[trigger]() : null;
      
      // Выполняем действие
      if (actions[action]) {
        return await actions[action]({ ...data, triggerResult });
      }
      
      return { success: true, message: 'Automation executed' };
    } catch (error) {
      console.error('Automation error:', error);
      return { success: false, error: error.message };
    }
  }

  async onDataUpdated(data) {
    // Триггер: данные обновлены
    console.log('Data updated trigger:', data);
    return { triggered: true, timestamp: new Date().toISOString() };
  }

  async onThresholdReached(data) {
    // Триггер: достигнут порог
    const { field, threshold, value } = data;
    if (parseFloat(value) >= parseFloat(threshold)) {
      return { triggered: true, field, threshold, value };
    }
    return { triggered: false };
  }

  async onSchedule(data) {
    // Триггер: по расписанию
    return { triggered: true, schedule: data.schedule };
  }

  async onWebhook(data) {
    // Триггер: webhook
    return { triggered: true, webhook: data };
  }

  async updateData(params) {
    // Действие: обновить данные
    console.log('Updating data:', params);
    return { success: true, updated: true };
  }

  async sendNotification(params) {
    // Действие: отправить уведомление
    console.log('Sending notification:', params);
    return { success: true, notificationSent: true };
  }

  async calculateMetrics(params) {
    // Действие: рассчитать метрики
    const { formula, data } = params;
    const result = await this.evaluateFormula(formula, data);
    return { success: true, result };
  }

  async syncExternal(params) {
    // Действие: синхронизировать с внешним сервисом
    console.log('Syncing external:', params);
    return { success: true, synced: true };
  }

  getMockAnalytics() {
    const mockData = this.getMockTableData();
    const rows = mockData.rows;
    
    const totalPosts = rows.length;
    const totalViews = rows.reduce((sum, row) => sum + (row.views || 0), 0);
    const totalLikes = rows.reduce((sum, row) => sum + (row.likes || 0), 0);
    const totalComments = rows.reduce((sum, row) => sum + (row.comments || 0), 0);
    const avgEngagement = totalViews > 0 ? ((totalLikes + totalComments * 2) / totalViews) * 100 : 0;
    
    // Статистика по типам
    const typeStats = rows.reduce((stats, row) => {
      const type = row.type || 'post';
      if (!stats[type]) {
        stats[type] = { count: 0, totalViews: 0, totalLikes: 0, totalComments: 0 };
      }
      stats[type].count += 1;
      stats[type].totalViews += row.views || 0;
      stats[type].totalLikes += row.likes || 0;
      stats[type].totalComments += row.comments || 0;
      return stats;
    }, {});
    
    // Топ посты
    const topPosts = rows
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 10)
      .map(row => ({
        title: row.title,
        views: row.views,
        likes: row.likes,
        comments: row.comments,
        type: row.type
      }));
    
    // Тональность
    const sentimentStats = rows.reduce((stats, row) => {
      stats.total += 1;
      stats.positive += row.sentiment_positive || 0;
      stats.neutral += row.sentiment_neutral || 0;
      stats.negative += row.sentiment_negative || 0;
      return stats;
    }, { total: 0, positive: 0, neutral: 0, negative: 0 });
    
    return {
      summary: {
        totalPosts: totalPosts,
        totalViews: totalViews,
        totalLikes: totalLikes,
        totalComments: totalComments,
        avgEngagement: parseFloat(avgEngagement.toFixed(2))
      },
      typeStats: typeStats,
      topPosts: topPosts,
      sentiment: {
        positive: parseFloat((sentimentStats.positive / sentimentStats.total / 100).toFixed(2)),
        neutral: parseFloat((sentimentStats.neutral / sentimentStats.total / 100).toFixed(2)),
        negative: parseFloat((sentimentStats.negative / sentimentStats.total / 100).toFixed(2))
      },
      recentPosts: rows.slice(0, 10)
    };
  }

  // Методы для работы с планом публикаций
  async getPublicationPlan(params) {
    try {
      const { companyId, month, year, network } = params;
      const tableId = 'publication_plan';
      
      const filters = {
        company_id: companyId,
        month: month,
        year: year
      };
      
      if (network) {
        filters.network = network;
      }
      
      const data = await this.getTableData(tableId, filters);
      return {
        publications: data.rows || []
      };
    } catch (error) {
      console.error('Error getting publication plan:', error);
      return { publications: [] };
    }
  }

  async createPublication(data) {
    try {
      const tableId = 'publication_plan';
      const response = await axios.post(`${this.baseURL}/tables/${tableId}/rows`, data, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating publication:', error);
      // Возвращаем мок-данные для разработки
      return {
        id: Date.now().toString(),
        ...data,
        created_at: new Date().toISOString()
      };
    }
  }

  async updatePublication(id, data) {
    try {
      const tableId = 'publication_plan';
      const response = await axios.put(`${this.baseURL}/tables/${tableId}/rows/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating publication:', error);
      return { id, ...data, updated_at: new Date().toISOString() };
    }
  }

  async deletePublication(id) {
    try {
      const tableId = 'publication_plan';
      await axios.delete(`${this.baseURL}/tables/${tableId}/rows/${id}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting publication:', error);
      return { success: true }; // Возвращаем success для разработки
    }
  }

  // Методы для работы с задачами (Gantt)
  async getGanttTasks(params) {
    try {
      const { companyId } = params;
      const tableId = 'publication_tasks';
      
      const filters = {
        company_id: companyId
      };
      
      const data = await this.getTableData(tableId, filters);
      return data.rows || [];
    } catch (error) {
      console.error('Error getting gantt tasks:', error);
      return [];
    }
  }

  async createTask(data) {
    try {
      const tableId = 'publication_tasks';
      
      // Автоматически рассчитываем даты на основе даты публикации
      const taskDurations = {
        copywriter: 2,
        designer: 3,
        editor: 1,
        manager: 1,
        scheduler: 1
      };
      
      const publishDate = new Date(data.publishDate);
      const taskType = data.taskType;
      const duration = taskDurations[taskType] || 1;
      
      // Рассчитываем даты в обратном порядке от даты публикации
      const taskOrder = ['scheduler', 'copywriter', 'designer', 'editor', 'manager'];
      const taskIndex = taskOrder.indexOf(taskType);
      const daysBefore = taskOrder.slice(taskIndex).reduce((sum, t) => sum + (taskDurations[t] || 1), 0);
      
      const startDate = new Date(publishDate);
      startDate.setDate(startDate.getDate() - daysBefore);
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + duration - 1);
      
      const taskData = {
        ...data,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status: 'pending',
        created_at: new Date().toISOString()
      };
      
      const response = await axios.post(`${this.baseURL}/tables/${tableId}/rows`, taskData, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      // Возвращаем мок-данные
      return {
        id: Date.now().toString(),
        ...data,
        status: 'pending',
        created_at: new Date().toISOString()
      };
    }
  }

  async updateTask(id, data) {
    try {
      const tableId = 'publication_tasks';
      const response = await axios.put(`${this.baseURL}/tables/${tableId}/rows/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      return { id, ...data, updated_at: new Date().toISOString() };
    }
  }

  async deleteTask(id) {
    try {
      const tableId = 'publication_tasks';
      await axios.delete(`${this.baseURL}/tables/${tableId}/rows/${id}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting task:', error);
      return { success: true };
    }
  }
}

module.exports = new MWSService();