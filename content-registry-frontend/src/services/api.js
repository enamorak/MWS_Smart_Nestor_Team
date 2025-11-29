import axios from 'axios';

const API_BASE = '/api';

// MWS Tables API
export const mwsAPI = {
  // Получить данные контента
  getContentData: (params = {}) => 
    axios.get(`${API_BASE}/mws/content`, { params }),

  // Получить аналитику
  getAnalytics: () => 
    axios.get(`${API_BASE}/mws/analytics`),

  // Получить дашборды
  getDashboards: () => 
    axios.get(`${API_BASE}/mws/dashboards`)
};

// VK API
export const vkAPI = {
  // Синхронизировать данные VK
  syncVKData: (data) => 
    axios.post(`${API_BASE}/vk/sync`, data),

  // Получить посты группы
  getGroupPosts: (groupId, params = {}) => 
    axios.get(`${API_BASE}/vk/groups/${groupId}/posts`, { params }),

  // Получить статистику группы
  getGroupStats: (groupId) => 
    axios.get(`${API_BASE}/vk/groups/${groupId}/stats`)
};

// AI API
export const aiAPI = {
  // Предсказать популярность
  predictPopularity: (data) => 
    axios.post(`${API_BASE}/ai/predict`, data),

  // Проанализировать текст
  analyzeText: (data) => 
    axios.post(`${API_BASE}/ai/analyze`, data),

  // Получить рекомендации
  getRecommendations: (data) => 
    axios.post(`${API_BASE}/ai/recommendations`, data),

  // Проверить статус AI
  getAIStatus: () => 
    axios.get(`${API_BASE}/ai/status`)
};

// Bot API
export const botAPI = {
  // Отправить сообщение боту
  sendMessage: (data) => 
    axios.post(`${API_BASE}/bot/message`, data),

  // Получить возможности бота
  getCapabilities: () => 
    axios.get(`${API_BASE}/bot/capabilities`)
};

// Social Networks API
export const networksAPI = {
  // Получить данные всех сетей
  getAllNetworks: () => 
    axios.get(`${API_BASE}/networks`),

  // Получить данные конкретной сети
  getNetwork: (networkId) => 
    axios.get(`${API_BASE}/networks/${networkId}`),

  // Синхронизировать данные сети
  syncNetwork: (networkId, data) => 
    axios.post(`${API_BASE}/networks/${networkId}/sync`, data),

  // Получить сравнительную статистику
  getComparison: () => 
    axios.get(`${API_BASE}/networks/comparison/stats`)
};

// Sentiment API
export const sentimentAPI = {
  // Анализ тональности комментариев
  analyzeComments: (params) => 
    axios.get(`${API_BASE}/sentiment/analyze`, { params }),

  // Получить историю тональности
  getHistory: (params) => 
    axios.get(`${API_BASE}/sentiment/history`, { params })
};

// Общие утилиты
export const apiUtils = {
  // Обработка ошибок
  handleError: (error) => {
    if (error.response) {
      // Сервер ответил с статусом ошибки
      console.error('API Error:', error.response.data);
      return error.response.data;
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен
      console.error('Network Error:', error.request);
      return { error: 'Network error: No response from server' };
    } else {
      // Что-то пошло не так при настройке запроса
      console.error('Request Error:', error.message);
      return { error: error.message };
    }
  },

  // Создание параметров запроса
  createParams: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, value);
      }
    });
    return params;
  }
};

// Интерцептор для добавления заголовков
axios.interceptors.request.use(
  (config) => {
    // Можно добавить общие заголовки здесь
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ответов
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    return Promise.reject(error);
  }
);

export default {
  mws: mwsAPI,
  vk: vkAPI,
  ai: aiAPI,
  bot: botAPI,
  networks: networksAPI,
  sentiment: sentimentAPI,
  utils: apiUtils
};