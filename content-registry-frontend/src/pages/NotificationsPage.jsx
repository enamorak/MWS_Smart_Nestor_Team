import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, X, Filter, Search, Trash2, CheckCheck } from 'lucide-react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [typeFilter, setTypeFilter] = useState('all'); // all, success, warning, info
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadNotifications();
    // Обновляем каждые 30 секунд
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    // Мок-данные уведомлений (в реальности из API)
    const mockNotifications = [
      {
        id: 1,
        type: 'success',
        title: 'Новый рекорд просмотров',
        message: 'Пост "Обзор нового продукта 2025" достиг 18,500 просмотров - это новый рекорд!',
        timestamp: new Date(Date.now() - 3600000),
        read: false,
        category: 'performance'
      },
      {
        id: 2,
        type: 'info',
        title: 'Рекомендация AI',
        message: 'На основе анализа данных, рекомендуем увеличить долю видео контента до 40-45% для повышения вовлеченности на 15-20%',
        timestamp: new Date(Date.now() - 7200000),
        read: false,
        category: 'recommendation'
      },
      {
        id: 3,
        type: 'warning',
        title: 'Низкая вовлеченность',
        message: 'Пост "Акция недели - скидки до 50%" показывает низкую вовлеченность (2.1%). Рекомендуем пересмотреть стратегию.',
        timestamp: new Date(Date.now() - 10800000),
        read: true,
        category: 'performance'
      },
      {
        id: 4,
        type: 'success',
        title: 'Новые комментарии',
        message: 'Получено 12 новых комментариев за последний час. 8 из них требуют ответа.',
        timestamp: new Date(Date.now() - 14400000),
        read: true,
        category: 'engagement'
      },
      {
        id: 5,
        type: 'info',
        title: 'Обновление данных',
        message: 'Данные из MWS Tables успешно синхронизированы. Добавлено 5 новых записей.',
        timestamp: new Date(Date.now() - 18000000),
        read: false,
        category: 'system'
      },
      {
        id: 6,
        type: 'success',
        title: 'Вирусный контент',
        message: 'Видео "За кулисами производства" набрало 1,200 репостов за 24 часа!',
        timestamp: new Date(Date.now() - 21600000),
        read: true,
        category: 'performance'
      },
      {
        id: 7,
        type: 'warning',
        title: 'Негативные комментарии',
        message: 'Обнаружено увеличение негативных комментариев на 5% за последнюю неделю. Рекомендуем анализ тональности.',
        timestamp: new Date(Date.now() - 25200000),
        read: false,
        category: 'sentiment'
      },
      {
        id: 8,
        type: 'info',
        title: 'Лучшее время публикации',
        message: 'Анализ показывает: публикация в 18:00-20:00 увеличивает охват на 28%. Рекомендуем запланировать посты на это время.',
        timestamp: new Date(Date.now() - 28800000),
        read: true,
        category: 'recommendation'
      },
      {
        id: 9,
        type: 'success',
        title: 'Достижение цели',
        message: 'Вы достигли цели по вовлеченности на этой неделе! Средний показатель: 5.8% (цель: 5.0%)',
        timestamp: new Date(Date.now() - 32400000),
        read: false,
        category: 'achievement'
      },
      {
        id: 10,
        type: 'info',
        title: 'Новый тренд',
        message: 'Видео контент показывает рост вовлеченности на 35% по сравнению с постами. Рекомендуем увеличить долю видео.',
        timestamp: new Date(Date.now() - 36000000),
        read: true,
        category: 'trend'
      }
    ];

    setNotifications(mockNotifications);
    setLoading(false);
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notif.read) || 
      (filter === 'read' && notif.read);
    
    const matchesType = typeFilter === 'all' || notif.type === typeFilter;
    
    const matchesSearch = searchTerm === '' || 
      notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesType && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const deleteAllRead = () => {
    setNotifications(notifications.filter(n => !n.read));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'info': return Info;
      default: return Info;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'success': return '#dc2626';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#9ca3af';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'только что';
    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    if (days < 7) return `${days} дн назад`;
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner">⏳</div>
        <p>Загрузка уведомлений...</p>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="page-header">
        <div>
          <h1>Уведомления</h1>
          <p>Управление всеми уведомлениями и оповещениями</p>
        </div>
        <div className="header-actions">
          {unreadCount > 0 && (
            <button className="btn-secondary" onClick={markAllAsRead}>
              <CheckCheck size={18} />
              Отметить все как прочитанные
            </button>
          )}
          {notifications.filter(n => n.read).length > 0 && (
            <button className="btn-secondary" onClick={deleteAllRead}>
              <Trash2 size={18} />
              Удалить прочитанные
            </button>
          )}
        </div>
      </div>

      <div className="notifications-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Поиск уведомлений..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Все ({notifications.length})
          </button>
          <button
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Непрочитанные ({unreadCount})
          </button>
          <button
            className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
            onClick={() => setFilter('read')}
          >
            Прочитанные ({notifications.filter(n => n.read).length})
          </button>
        </div>

        <div className="type-filters">
          <button
            className={`type-filter ${typeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setTypeFilter('all')}
          >
            Все типы
          </button>
          <button
            className={`type-filter ${typeFilter === 'success' ? 'active' : ''}`}
            onClick={() => setTypeFilter('success')}
          >
            <CheckCircle size={16} />
            Успех
          </button>
          <button
            className={`type-filter ${typeFilter === 'warning' ? 'active' : ''}`}
            onClick={() => setTypeFilter('warning')}
          >
            <AlertCircle size={16} />
            Предупреждения
          </button>
          <button
            className={`type-filter ${typeFilter === 'info' ? 'active' : ''}`}
            onClick={() => setTypeFilter('info')}
          >
            <Info size={16} />
            Информация
          </button>
        </div>
      </div>

      <div className="notifications-list-page">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <Bell size={64} />
            <h3>Нет уведомлений</h3>
            <p>
              {searchTerm || filter !== 'all' || typeFilter !== 'all'
                ? 'Попробуйте изменить фильтры'
                : 'У вас пока нет уведомлений'}
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => {
            const Icon = getIcon(notification.type);
            const color = getColor(notification.type);
            
            return (
              <div
                key={notification.id}
                className={`notification-card ${!notification.read ? 'unread' : ''} ${notification.type}`}
              >
                <div className="notification-card-header">
                  <div className="notification-card-icon" style={{ color }}>
                    <Icon size={20} />
                  </div>
                  <div className="notification-card-content">
                    <div className="notification-card-title">{notification.title}</div>
                    <div className="notification-card-message">{notification.message}</div>
                    <div className="notification-card-meta">
                      <span className="notification-time">{formatTime(notification.timestamp)}</span>
                      <span className="notification-category">{notification.category}</span>
                    </div>
                  </div>
                  {!notification.read && <div className="unread-indicator"></div>}
                </div>
                <div className="notification-card-actions">
                  {!notification.read && (
                    <button
                      className="action-btn"
                      onClick={() => markAsRead(notification.id)}
                      title="Отметить как прочитанное"
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}
                  <button
                    className="action-btn delete"
                    onClick={() => deleteNotification(notification.id)}
                    title="Удалить"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {filteredNotifications.length > 0 && (
        <div className="notifications-stats">
          <div className="stat-item">
            <span className="stat-label">Всего:</span>
            <span className="stat-value">{notifications.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Непрочитанных:</span>
            <span className="stat-value unread">{unreadCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Прочитанных:</span>
            <span className="stat-value">{notifications.filter(n => n.read).length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;

