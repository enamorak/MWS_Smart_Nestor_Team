import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  MessageCircle, 
  RefreshCw,
  Eye,
  Heart,
  Share2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { mwsAPI } from '../services/api';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d, all

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await mwsAPI.getAnalytics();
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Генерируем данные для графиков на основе аналитики
  const generateTimeSeriesData = () => {
    if (!analytics) return [];
    
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 30;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
      
      // Генерируем реалистичные данные на основе аналитики
      const baseViews = analytics.summary.totalViews / days;
      const baseLikes = analytics.summary.totalLikes / days;
      const baseComments = analytics.summary.totalComments / days;
      
      data.push({
        date: dateStr,
        views: Math.round(baseViews * (0.7 + Math.random() * 0.6)),
        likes: Math.round(baseLikes * (0.7 + Math.random() * 0.6)),
        comments: Math.round(baseComments * (0.7 + Math.random() * 0.6)),
        engagement: parseFloat(((baseLikes + baseComments * 2) / baseViews * 100 * (0.8 + Math.random() * 0.4)).toFixed(2))
      });
    }
    
    return data;
  };

  const timeSeriesData = generateTimeSeriesData();

  // Данные для круговой диаграммы типов контента
  const typeDistributionData = analytics ? Object.entries(analytics.typeStats).map(([type, stats]) => ({
    name: type === 'video' ? 'Видео' : type === 'post' ? 'Посты' : 'Изображения',
    value: stats.count,
    color: type === 'video' ? '#ef4444' : type === 'post' ? '#3b82f6' : '#10b981'
  })) : [];

  // Данные для тональности
  const sentimentData = analytics ? [
    { name: 'Позитивные', value: Math.round(analytics.sentiment.positive * 100), color: '#10b981' },
    { name: 'Нейтральные', value: Math.round(analytics.sentiment.neutral * 100), color: '#6b7280' },
    { name: 'Негативные', value: Math.round(analytics.sentiment.negative * 100), color: '#ef4444' }
  ] : [];

  // Данные для сравнения по социальным сетям
  const socialNetworkData = [
    { network: 'VK', views: 45000, likes: 3200, comments: 890, engagement: 4.2 },
    { network: 'Telegram', views: 38000, likes: 2800, comments: 650, engagement: 5.1 },
    { network: 'Instagram', views: 42000, likes: 4100, comments: 1200, engagement: 6.3 }
  ];

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="loading-state">
          <RefreshCw className="spinner" size={32} />
          <p>Загрузка аналитики...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <div className="page-header">
        <div>
          <h1>Детальная аналитика</h1>
          <p>Глубокий анализ эффективности контента по всем социальным сетям</p>
        </div>
        <div className="header-controls">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="7d">Последние 7 дней</option>
            <option value="30d">Последние 30 дней</option>
            <option value="90d">Последние 90 дней</option>
            <option value="all">За все время</option>
          </select>
          <button onClick={loadAnalytics} className="btn-refresh">
            <RefreshCw size={16} />
            Обновить
          </button>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Динамика просмотров и вовлеченности */}
        <div className="card chart-card">
          <div className="card-header">
            <h3>📈 Динамика просмотров и вовлеченности</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="views" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.3}
                name="Просмотры"
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="likes" 
                stroke="#ef4444" 
                fill="#ef4444" 
                fillOpacity={0.3}
                name="Лайки"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="engagement" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Вовлеченность %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Сравнение по социальным сетям */}
        <div className="card chart-card">
          <div className="card-header">
            <h3>🌐 Сравнение по социальным сетям</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={socialNetworkData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="network" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="views" fill="#3b82f6" name="Просмотры" />
              <Bar dataKey="likes" fill="#ef4444" name="Лайки" />
              <Bar dataKey="comments" fill="#10b981" name="Комментарии" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Распределение типов контента */}
        <div className="card chart-card">
          <div className="card-header">
            <h3>📊 Распределение типов контента</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={typeDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {typeDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Анализ тональности комментариев */}
        <div className="card chart-card">
          <div className="card-header">
            <h3>💬 Тональность комментариев</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Динамика комментариев */}
        <div className="card chart-card">
          <div className="card-header">
            <h3>💭 Динамика комментариев</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="comments" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Комментарии"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Топ материалы */}
        <div className="card">
          <div className="card-header">
            <h3>🏆 Топ материалы</h3>
          </div>
          <div className="top-content">
            {analytics && analytics.topPosts.slice(0, 5).map((post, index) => (
              <div key={index} className="top-item">
                <div className="top-rank">#{index + 1}</div>
                <div className="top-content-details">
                  <div className="top-title">{post.title || `Пост ${index + 1}`}</div>
                  <div className="top-stats">
                    <span><Eye size={14} /> {post.views?.toLocaleString() || 0}</span>
                    <span><Heart size={14} /> {post.likes || 0}</span>
                    <span><MessageCircle size={14} /> {post.comments || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;