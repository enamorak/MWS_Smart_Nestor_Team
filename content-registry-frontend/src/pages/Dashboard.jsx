import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import StatsCards from '../components/StatsCards';

const Dashboard = () => {
  const quickStats = [
    { 
      title: 'Всего материалов', 
      value: '156', 
      change: '+12%',
      trend: 'up',
      icon: FileText,
      color: 'blue' 
    },
    { 
      title: 'Общий охват', 
      value: '125K', 
      change: '+8%',
      trend: 'up',
      icon: Eye,
      color: 'green' 
    },
    { 
      title: 'Вовлеченность', 
      value: '4.2%', 
      change: '-2%',
      trend: 'down',
      icon: Heart,
      color: 'purple' 
    },
    { 
      title: 'Комментарии', 
      value: '1,234', 
      change: '+15%',
      trend: 'up',
      icon: MessageCircle,
      color: 'orange' 
    }
  ];

  const recentActivities = [
    { id: 1, type: 'post', title: 'Новый пост о продукте', time: '2 часа назад', engagement: '245 лайков' },
    { id: 2, type: 'video', title: 'Обзорное видео', time: '5 часов назад', engagement: '1.2K просмотров' },
    { id: 3, type: 'analysis', title: 'AI анализ завершен', time: 'Вчера', engagement: '85% позитивных' }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Главный дашборд</h1>
        <p>Обзор эффективности вашего контента</p>
      </div>

      <StatsCards stats={quickStats} />

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3>Недавняя активность</h3>
            <Link to="/content" className="view-all">Все материалы →</Link>
          </div>
          <div className="activity-list">
            {recentActivities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'post' && '📝'}
                  {activity.type === 'video' && '🎥'}
                  {activity.type === 'analysis' && '🤖'}
                </div>
                <div className="activity-content">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-meta">
                    <span>{activity.time}</span>
                    <span>•</span>
                    <span>{activity.engagement}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Быстрые действия</h3>
          </div>
          <div className="quick-actions">
            <Link to="/chat" className="quick-action">
              <MessageCircle size={24} />
              <span>Спросить AI</span>
            </Link>
            <Link to="/analytics" className="quick-action">
              <TrendingUp size={24} />
              <span>Анализ трендов</span>
            </Link>
            <Link to="/content" className="quick-action">
              <FileText size={24} />
              <span>Управление контентом</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Рекомендации AI</h3>
        </div>
        <div className="recommendations">
          <div className="recommendation positive">
            <div className="rec-icon">💡</div>
            <div className="rec-content">
              <strong>Лучшее время публикации:</strong> Публикуйте видео в 18:00-20:00 для +25% охвата
            </div>
          </div>
          <div className="recommendation warning">
            <div className="rec-icon">⚠️</div>
            <div className="rec-content">
              <strong>Внимание:</strong> Посты о ценах получают на 40% больше негативных комментариев
            </div>
          </div>
          <div className="recommendation info">
            <div className="rec-icon">📊</div>
            <div className="rec-content">
              <strong>Статистика:</strong> Вопросы в заголовках увеличивают комментарии в 2 раза
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;