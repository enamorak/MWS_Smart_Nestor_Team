import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  MessageCircle, 
  RefreshCw,
  Eye,
  Heart,
  Share2,
  BarChart3,
  PieChart as PieChartIcon,
  Trophy
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
  const [selectedNetworks, setSelectedNetworks] = useState(['vk', 'telegram', 'instagram', 'youtube']);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange, selectedNetworks]);

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
    color: type === 'video' ? '#dc2626' : type === 'post' ? '#dc2626' : '#dc2626'
  })) : [];

  // Данные для тональности
  const sentimentData = analytics ? [
    { name: 'Позитивные', value: Math.round(analytics.sentiment.positive * 100), color: '#dc2626' },
    { name: 'Нейтральные', value: Math.round(analytics.sentiment.neutral * 100), color: '#9ca3af' },
    { name: 'Негативные', value: Math.round(analytics.sentiment.negative * 100), color: '#991b1b' }
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
          <div className="networks-filter-analytics">
            <label>Социальные сети:</label>
            <div className="network-checkboxes">
              <label className="network-checkbox">
                <input 
                  type="checkbox" 
                  checked={selectedNetworks.includes('vk')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedNetworks([...selectedNetworks, 'vk']);
                    } else {
                      setSelectedNetworks(selectedNetworks.filter(n => n !== 'vk'));
                    }
                  }}
                />
                <span>VK</span>
              </label>
              <label className="network-checkbox">
                <input 
                  type="checkbox" 
                  checked={selectedNetworks.includes('telegram')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedNetworks([...selectedNetworks, 'telegram']);
                    } else {
                      setSelectedNetworks(selectedNetworks.filter(n => n !== 'telegram'));
                    }
                  }}
                />
                <span>Telegram</span>
              </label>
              <label className="network-checkbox">
                <input 
                  type="checkbox" 
                  checked={selectedNetworks.includes('instagram')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedNetworks([...selectedNetworks, 'instagram']);
                    } else {
                      setSelectedNetworks(selectedNetworks.filter(n => n !== 'instagram'));
                    }
                  }}
                />
                <span>Instagram</span>
              </label>
              <label className="network-checkbox">
                <input 
                  type="checkbox" 
                  checked={selectedNetworks.includes('youtube')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedNetworks([...selectedNetworks, 'youtube']);
                    } else {
                      setSelectedNetworks(selectedNetworks.filter(n => n !== 'youtube'));
                    }
                  }}
                />
                <span>YouTube</span>
              </label>
            </div>
          </div>
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
            <h3><TrendingUp size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Динамика просмотров и вовлеченности</h3>
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
                stroke="#dc2626" 
                fill="#dc2626" 
                fillOpacity={0.2}
                name="Просмотры"
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="likes" 
                stroke="#991b1b" 
                fill="#991b1b" 
                fillOpacity={0.2}
                name="Лайки"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="engagement" 
                stroke="#9ca3af" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Вовлеченность %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Сравнение по социальным сетям */}
        <div className="card chart-card">
          <div className="card-header">
            <h3><Users size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Сравнение по социальным сетям</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={socialNetworkData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="network" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="views" fill="#dc2626" name="Просмотры" />
              <Bar dataKey="likes" fill="#991b1b" name="Лайки" />
              <Bar dataKey="comments" fill="#9ca3af" name="Комментарии" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Распределение типов контента */}
        <div className="card chart-card">
          <div className="card-header">
            <h3><PieChartIcon size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Распределение типов контента</h3>
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
            <h3><MessageCircle size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Тональность комментариев</h3>
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
            <h3><MessageCircle size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Динамика комментариев</h3>
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
                stroke="#dc2626" 
                strokeWidth={2}
                name="Комментарии"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Топ материалы */}
        <div className="card">
          <div className="card-header">
            <h3><Trophy size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Топ материалы</h3>
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