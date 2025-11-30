import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle,
  FileText,
  RefreshCw,
  Calendar,
  ArrowUp,
  ArrowDown,
  Video,
  Image,
  Trophy,
  BarChart3,
  Lightbulb,
  Zap,
  PieChart,
  Sparkles,
  Target,
  Clock
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { mwsAPI } from '../services/api';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await mwsAPI.getAnalytics();
      setAnalytics(response.data.analytics);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  // Генерация данных для графиков
  const generateChartData = () => {
    const days = timeRange === '30d' ? 30 : timeRange === '7d' ? 7 : 90;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
        views: Math.floor(Math.random() * 5000) + 2000,
        likes: Math.floor(Math.random() * 500) + 200,
        comments: Math.floor(Math.random() * 100) + 50,
        engagement: (Math.random() * 5 + 5).toFixed(1)
      });
    }
    return data;
  };

  const chartData = generateChartData();

  // Статистические карточки
  const quickStats = analytics ? [
    { 
      title: 'Всего материалов', 
      value: analytics.summary.totalPosts.toLocaleString(), 
      change: '+12%',
      trend: 'up',
      icon: FileText,
      color: '#dc2626'
    },
    { 
      title: 'Общий охват', 
      value: `${(analytics.summary.totalViews / 1000).toFixed(0)}K`, 
      change: '+8%',
      trend: 'up',
      icon: Eye,
      color: '#991b1b'
    },
    { 
      title: 'Вовлеченность', 
      value: `${analytics.summary.avgEngagement}%`, 
      change: '+2.3%',
      trend: 'up',
      icon: Target,
      color: '#dc2626'
    },
    { 
      title: 'Комментарии', 
      value: analytics.summary.totalComments.toLocaleString(), 
      change: '+15%',
      trend: 'up',
      icon: MessageCircle,
      color: '#991b1b'
    }
  ] : [];

  // Топ материалы
  const topPosts = analytics ? analytics.topPosts.slice(0, 5).map((post, index) => ({
    id: index,
    type: post.type,
    title: post.title,
    views: post.views,
    likes: post.likes,
    comments: post.comments,
    engagement: ((post.likes + post.comments * 2) / post.views * 100).toFixed(1)
  })) : [];

  // Распределение по типам контента
  const typeDistribution = analytics ? Object.entries(analytics.typeStats).map(([type, stats]) => ({
    type,
    count: stats.count,
    percentage: ((stats.count / analytics.summary.totalPosts) * 100).toFixed(1),
    avgViews: Math.round(stats.totalViews / stats.count),
    color: type === 'video' ? '#dc2626' : type === 'post' ? '#991b1b' : '#9ca3af'
  })) : [];

  // Анализ тональности
  const sentimentData = analytics ? [
    { name: 'Позитивные', value: Math.round(analytics.sentiment.positive * 100), color: '#dc2626' },
    { name: 'Нейтральные', value: Math.round(analytics.sentiment.neutral * 100), color: '#9ca3af' },
    { name: 'Негативные', value: Math.round(analytics.sentiment.negative * 100), color: '#991b1b' }
  ] : [];

  if (loading) {
    return (
      <div className="dashboard-modern">
        <div className="loading-state">
          <RefreshCw className="spinner" size={32} />
          <p>Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-modern">
      {/* Заголовок */}
      <div className="dashboard-header-modern">
        <div>
          <h1>Дашборд</h1>
          <p>Обзор вашей активности и аналитики</p>
        </div>
        <div className="dashboard-actions">
          <div className="time-range-selector">
            <button 
              className={timeRange === '7d' ? 'active' : ''} 
              onClick={() => setTimeRange('7d')}
            >
              7 дней
            </button>
            <button 
              className={timeRange === '30d' ? 'active' : ''} 
              onClick={() => setTimeRange('30d')}
            >
              30 дней
            </button>
            <button 
              className={timeRange === '90d' ? 'active' : ''} 
              onClick={() => setTimeRange('90d')}
            >
              90 дней
            </button>
          </div>
          <button onClick={loadAnalytics} className="btn-refresh-modern">
            <RefreshCw size={18} strokeWidth={1.5} />
            Обновить
          </button>
        </div>
      </div>

      {/* Ключевые метрики */}
      <div className="stats-grid-modern">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card-modern">
              <div className="stat-card-background" style={{ background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)` }}>
                <div className="stat-icon-modern" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                  <Icon size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-label">{stat.title}</div>
                  <div className="stat-value-modern">{stat.value}</div>
                  <div className="stat-change">
                    {stat.trend === 'up' ? <ArrowUp size={14} strokeWidth={1.5} /> : <ArrowDown size={14} strokeWidth={1.5} />}
                    <span className={stat.trend}>{stat.change}</span>
                    <span className="stat-period">за период</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Графики */}
      <div className="charts-grid-modern">
        <div className="chart-card-modern">
          <div className="chart-header">
            <div>
              <h3>Динамика метрик</h3>
              <p>Просмотры, лайки и комментарии</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#991b1b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#991b1b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Area type="monotone" dataKey="views" stroke="#dc2626" fillOpacity={1} fill="url(#colorViews)" name="Просмотры" />
              <Area type="monotone" dataKey="likes" stroke="#991b1b" fillOpacity={1} fill="url(#colorLikes)" name="Лайки" />
              <Line type="monotone" dataKey="comments" stroke="#9ca3af" strokeWidth={2} name="Комментарии" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card-modern">
          <div className="chart-header">
            <div>
              <h3>Тональность</h3>
              <p>Распределение комментариев</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Топ материалы и типы контента */}
      <div className="content-grid-modern">
        <div className="content-card-modern">
          <div className="content-card-header">
            <div>
              <Trophy size={20} strokeWidth={1.5} />
              <h3>Топ материалы</h3>
            </div>
            <Link to="/content" className="view-all-link">Все материалы →</Link>
          </div>
          <div className="top-posts-list-modern">
            {topPosts.map((post, index) => (
              <div key={post.id} className="top-post-item-modern">
                <div className="post-rank-modern">#{index + 1}</div>
                <div className="post-content-modern">
                  <div className="post-title-modern">{post.title}</div>
                  <div className="post-meta-modern">
                    <span className={`post-type-badge ${post.type}`}>
                      {post.type === 'video' && <Video size={12} strokeWidth={1.5} />}
                      {post.type === 'post' && <FileText size={12} strokeWidth={1.5} />}
                      {post.type === 'image' && <Image size={12} strokeWidth={1.5} />}
                      {post.type === 'video' ? 'Видео' : post.type === 'post' ? 'Пост' : 'Изображение'}
                    </span>
                  </div>
                  <div className="post-stats-modern">
                    <div className="post-stat-modern">
                      <Eye size={14} strokeWidth={1.5} />
                      <span>{post.views.toLocaleString()}</span>
                    </div>
                    <div className="post-stat-modern">
                      <Heart size={14} strokeWidth={1.5} />
                      <span>{post.likes}</span>
                    </div>
                    <div className="post-stat-modern">
                      <MessageCircle size={14} strokeWidth={1.5} />
                      <span>{post.comments}</span>
                    </div>
                    <div className="post-engagement-modern">
                      <Target size={14} strokeWidth={1.5} />
                      <span>{post.engagement}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="content-card-modern">
          <div className="content-card-header">
            <div>
              <PieChart size={20} strokeWidth={1.5} />
              <h3>Типы контента</h3>
            </div>
          </div>
          <div className="type-distribution-modern">
            {typeDistribution.map((item, index) => (
              <div key={item.type} className="type-item-modern">
                <div className="type-header-modern">
                  <div className="type-info-modern">
                    <div 
                      className="type-dot" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="type-name-modern">{item.type === 'video' ? 'Видео' : item.type === 'post' ? 'Посты' : 'Изображения'}</span>
                  </div>
                  <span className="type-percentage-modern">{item.percentage}%</span>
                </div>
                <div className="type-bar-modern">
                  <div 
                    className="type-fill-modern"
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: item.color
                    }}
                  ></div>
                </div>
                <div className="type-details-modern">
                  <span>{item.count} материалов</span>
                  <span>~{item.avgViews.toLocaleString()} просмотров</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Рекомендации */}
      <div className="recommendations-card-modern">
        <div className="content-card-header">
          <div>
            <Lightbulb size={20} strokeWidth={1.5} />
            <h3>Персональные рекомендации</h3>
          </div>
        </div>
        <div className="recommendations-grid-modern">
          <div className="recommendation-item-modern positive">
            <div className="rec-icon-modern">
              <Video size={24} strokeWidth={1.5} />
            </div>
            <div className="rec-content-modern">
              <strong>Видео контент</strong>
              <p>Показывает на 25% выше вовлеченность. Рекомендуем увеличить долю видео до 40%</p>
            </div>
          </div>
          <div className="recommendation-item-modern info">
            <div className="rec-icon-modern">
              <Clock size={24} strokeWidth={1.5} />
            </div>
            <div className="rec-content-modern">
              <strong>Время публикации</strong>
              <p>Пиковая активность в 18:00-20:00. Планируйте публикации на это время</p>
            </div>
          </div>
          <div className="recommendation-item-modern warning">
            <div className="rec-icon-modern">
              <TrendingUp size={24} strokeWidth={1.5} />
            </div>
            <div className="rec-content-modern">
              <strong>Вовлеченность</strong>
              <p>Добавляйте вопросы в заголовки для увеличения комментариев на 200%</p>
            </div>
          </div>
          <div className="recommendation-item-modern positive">
            <div className="rec-icon-modern">
              <Target size={24} strokeWidth={1.5} />
            </div>
            <div className="rec-content-modern">
              <strong>Целевая аудитория</strong>
              <p>Ваши посты о продуктах получают на 40% больше лайков. Сфокусируйтесь на этом контенте</p>
            </div>
          </div>
          <div className="recommendation-item-modern info">
            <div className="rec-icon-modern">
              <MessageCircle size={24} strokeWidth={1.5} />
            </div>
            <div className="rec-content-modern">
              <strong>Взаимодействие</strong>
              <p>Отвечайте на комментарии в первые 2 часа - это увеличивает вовлеченность на 60%</p>
            </div>
          </div>
          <div className="recommendation-item-modern warning">
            <div className="rec-icon-modern">
              <Calendar size={24} strokeWidth={1.5} />
            </div>
            <div className="rec-content-modern">
              <strong>Частота публикаций</strong>
              <p>Публикуйте 3-4 раза в неделю для оптимального охвата аудитории</p>
            </div>
          </div>
          <div className="recommendation-item-modern positive">
            <div className="rec-icon-modern">
              <Image size={24} strokeWidth={1.5} />
            </div>
            <div className="rec-content-modern">
              <strong>Визуальный контент</strong>
              <p>Посты с изображениями получают на 35% больше просмотров. Добавляйте качественные фото</p>
            </div>
          </div>
          <div className="recommendation-item-modern info">
            <div className="rec-icon-modern">
              <FileText size={24} strokeWidth={1.5} />
            </div>
            <div className="rec-content-modern">
              <strong>Длина текста</strong>
              <p>Оптимальная длина поста - 150-200 слов. Такие посты показывают лучшую вовлеченность</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
