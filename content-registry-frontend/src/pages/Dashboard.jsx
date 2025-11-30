import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle,
  FileText,
  RefreshCw,
  Users,
  Share2,
  Calendar,
  ArrowUp,
  ArrowDown,
  Video,
  Image,
  Trophy,
  BarChart3,
  Lightbulb,
  Zap,
  PieChart
} from 'lucide-react';
import { mwsAPI } from '../services/api';
import MWSDashboard from '../components/MWSDashboard';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

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

  // Статистические карточки
  const quickStats = analytics ? [
    { 
      title: 'Всего материалов', 
      value: analytics.summary.totalPosts.toLocaleString(), 
      change: '+12%',
      trend: 'up',
      icon: FileText,
      color: 'blue',
      description: 'За все время'
    },
    { 
      title: 'Общий охват', 
      value: `${(analytics.summary.totalViews / 1000).toFixed(0)}K`, 
      change: '+8%',
      trend: 'up',
      icon: Eye,
      color: 'green',
      description: 'Просмотры'
    },
    { 
      title: 'Вовлеченность', 
      value: `${analytics.summary.avgEngagement}%`, 
      change: '+2%',
      trend: 'up',
      icon: Heart,
      color: 'purple',
      description: 'Средний показатель'
    },
    { 
      title: 'Комментарии', 
      value: analytics.summary.totalComments.toLocaleString(), 
      change: '+15%',
      trend: 'up',
      icon: MessageCircle,
      color: 'orange',
      description: 'Всего комментариев'
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
    color: type === 'video' ? '#dc2626' : type === 'post' ? '#dc2626' : '#dc2626'
  })) : [];

  // Анализ тональности
  const sentimentData = analytics ? [
    { type: 'positive', value: Math.round(analytics.sentiment.positive * 100), color: '#dc2626' },
    { type: 'neutral', value: Math.round(analytics.sentiment.neutral * 100), color: '#9ca3af' },
    { type: 'negative', value: Math.round(analytics.sentiment.negative * 100), color: '#991b1b' }
  ] : [];

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-state">
          <RefreshCw className="spinner" size={32} />
          <p>Загрузка данных из MWS Tables...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Заголовок */}
      <div className="dashboard-header">
        <div>
          <h1>Главный дашборд</h1>
          <p>Аналитика контента в реальном времени • {lastUpdated && `Обновлено: ${lastUpdated.toLocaleTimeString()}`}</p>
        </div>
        <button onClick={loadAnalytics} className="btn-refresh">
          <RefreshCw size={16} />
          Обновить данные
        </button>
      </div>

      {/* Ключевые метрики */}
      <div className="stats-grid">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`stat-card stat-${stat.color}`}>
              <div className="stat-header">
                <div className="stat-icon">
                  <Icon size={24} />
                </div>
                <div className={`stat-trend ${stat.trend}`}>
                  {stat.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  {stat.change}
                </div>
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-title">{stat.title}</div>
              <div className="stat-description">{stat.description}</div>
            </div>
          );
        })}
      </div>

      {/* Основная сетка */}
      <div className="dashboard-grid">
        {/* Топ материалы */}
        <div className="card">
          <div className="card-header">
            <h3><Trophy size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Топ материалы</h3>
            <Link to="/content" className="view-all">Все материалы →</Link>
          </div>
          <div className="top-posts-list">
            {topPosts.map((post, index) => (
              <div key={post.id} className="top-post-item">
                <div className="post-rank">#{index + 1}</div>
                <div className="post-content">
                  <div className="post-title">{post.title}</div>
                  <div className="post-meta">
                    <span className={`post-type ${post.type}`}>
                      {post.type === 'video' && <Video size={14} />}
                      {post.type === 'post' && <FileText size={14} />}
                      {post.type === 'image' && <Image size={14} />}
                      <span style={{ marginLeft: '4px' }}>{post.type === 'video' ? 'Видео' : post.type === 'post' ? 'Пост' : 'Изображение'}</span>
                    </span>
                  </div>
                  <div className="post-stats">
                    <div className="post-stat">
                      <Eye size={14} />
                      <span>{post.views.toLocaleString()}</span>
                    </div>
                    <div className="post-stat">
                      <Heart size={14} />
                      <span>{post.likes}</span>
                    </div>
                    <div className="post-stat">
                      <MessageCircle size={14} />
                      <span>{post.comments}</span>
                    </div>
                    <div className="post-stat engagement">
                      <span>{post.engagement}% вовлеченность</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Распределение по типам */}
        <div className="card">
          <div className="card-header">
            <h3><PieChart size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Типы контента</h3>
          </div>
          <div className="type-distribution">
            {typeDistribution.map((item, index) => (
              <div key={item.type} className="type-item">
                <div className="type-info">
                  <div className="type-header">
                    <span 
                      className="type-color" 
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="type-name">{item.type}</span>
                  </div>
                  <span className="type-percentage">{item.percentage}%</span>
                </div>
                <div className="type-details">
                  <span className="type-count">{item.count} материалов</span>
                  <span className="type-avg">~{item.avgViews} просмотров</span>
                </div>
                <div className="type-bar">
                  <div 
                    className="type-fill"
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: item.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Вторая сетка */}
      <div className="dashboard-grid">
        {/* Анализ тональности */}
        <div className="card">
          <div className="card-header">
            <h3><MessageCircle size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Тональность комментариев</h3>
          </div>
          <div className="sentiment-analysis">
            {sentimentData.map((item) => (
              <div key={item.type} className={`sentiment-item ${item.type}`}>
                <div className="sentiment-header">
                  <div className="sentiment-info">
                    <div 
                      className="sentiment-color" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="sentiment-type">
                      {item.type === 'positive' && 'Позитивные'}
                      {item.type === 'neutral' && 'Нейтральные'}
                      {item.type === 'negative' && 'Негативные'}
                    </span>
                  </div>
                  <span className="sentiment-value">{item.value}%</span>
                </div>
                <div className="sentiment-bar">
                  <div 
                    className="sentiment-fill"
                    style={{ 
                      width: `${item.value}%`,
                      backgroundColor: item.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="sentiment-summary">
            <p>Большинство комментариев положительные, что указывает на хорошее восприятие контента аудиторией.</p>
          </div>
        </div>

        {/* Рекомендации AI */}
        <div className="card">
          <div className="card-header">
            <h3><Lightbulb size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Рекомендации AI</h3>
          </div>
          <div className="recommendations">
            <div className="recommendation positive">
              <div className="rec-icon"><Video size={20} /></div>
              <div className="rec-content">
                <strong>Видео контент</strong>
                <p>Показывает на 25% выше вовлеченность. Рекомендуем увеличить долю видео до 40%</p>
              </div>
            </div>
            <div className="recommendation info">
              <div className="rec-icon"><Calendar size={20} /></div>
              <div className="rec-content">
                <strong>Время публикации</strong>
                <p>Пиковая активность в 18:00-20:00. Планируйте публикации на это время</p>
              </div>
            </div>
            <div className="recommendation warning">
              <div className="rec-icon"><TrendingUp size={20} /></div>
              <div className="rec-content">
                <strong>Вовлеченность</strong>
                <p>Добавляйте вопросы в заголовки для увеличения комментариев на 200%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="card">
        <div className="card-header">
          <h3><Zap size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Быстрые действия</h3>
        </div>
        <div className="quick-actions-grid">
          <Link to="/content" className="quick-action">
            <FileText size={24} />
            <div className="action-content">
              <span className="action-title">Управление контентом</span>
              <span className="action-description">Просмотр и редактирование материалов</span>
            </div>
          </Link>
          <Link to="/analytics" className="quick-action">
            <TrendingUp size={24} />
            <div className="action-content">
              <span className="action-title">Детальная аналитика</span>
              <span className="action-description">Графики и глубокий анализ</span>
            </div>
          </Link>
          <Link to="/chat" className="quick-action">
            <MessageCircle size={24} />
            <div className="action-content">
              <span className="action-title">AI Ассистент</span>
              <span className="action-description">Задавайте вопросы о контенте</span>
            </div>
          </Link>
          <div className="quick-action">
            <Calendar size={24} />
            <div className="action-content">
              <span className="action-title">Планировщик</span>
              <span className="action-description">Запланируйте публикации</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;