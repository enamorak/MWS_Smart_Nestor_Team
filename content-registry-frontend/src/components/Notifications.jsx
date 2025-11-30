import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, X, CheckCircle, AlertCircle, Info, TrendingUp, Users, MessageCircle } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Загружаем уведомления (в реальности из API)
    loadNotifications();
    
    // Проверяем новые уведомления каждые 30 секунд
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    // Мок-данные уведомлений
    const mockNotifications = [
      {
        id: 1,
        type: 'success',
        title: 'Новый рекорд просмотров',
        message: 'Пост "Обзор нового продукта" достиг 15,000 просмотров',
        timestamp: new Date(Date.now() - 3600000),
        read: false,
        icon: TrendingUp
      },
      {
        id: 2,
        type: 'info',
        title: 'Рекомендация AI',
        message: 'Рекомендуем увеличить долю видео контента до 40%',
        timestamp: new Date(Date.now() - 7200000),
        read: false,
        icon: Info
      },
      {
        id: 3,
        type: 'warning',
        title: 'Низкая вовлеченность',
        message: 'Пост "Акция недели" показывает низкую вовлеченность (2.1%)',
        timestamp: new Date(Date.now() - 10800000),
        read: true,
        icon: AlertCircle
      },
      {
        id: 4,
        type: 'success',
        title: 'Новые комментарии',
        message: 'Получено 12 новых комментариев за последний час',
        timestamp: new Date(Date.now() - 14400000),
        read: true,
        icon: MessageCircle
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    setUnreadCount(Math.max(0, unreadCount - 1));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = (id) => {
    const notification = notifications.find(n => n.id === id);
    if (!notification?.read) {
      setUnreadCount(Math.max(0, unreadCount - 1));
    }
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertCircle;
      case 'info':
        return Info;
      default:
        return Info;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'success':
        return '#dc2626';
      case 'warning':
        return '#f59e0b';
      case 'info':
        return '#3b82f6';
      default:
        return '#9ca3af';
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
    return `${days} дн назад`;
  };

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div className="notifications-container">
      <button 
        className="notifications-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Уведомления"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Уведомления</h3>
            <div className="notifications-actions">
              {unreadCount > 0 && (
                <button 
                  className="mark-all-read"
                  onClick={markAllAsRead}
                >
                  Отметить все как прочитанные
                </button>
              )}
              <button 
                className="close-notifications"
                onClick={() => setIsOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <Bell size={48} />
                <p>Нет уведомлений</p>
              </div>
            ) : (
              notifications.map(notification => {
                const Icon = getIcon(notification.type);
                const color = getColor(notification.type);
                
                return (
                  <div 
                    key={notification.id}
                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="notification-icon" style={{ color }}>
                      <Icon size={20} />
                    </div>
                    <div className="notification-content">
                      <div className="notification-title">{notification.title}</div>
                      <div className="notification-message">{notification.message}</div>
                      <div className="notification-time">{formatTime(notification.timestamp)}</div>
                    </div>
                    <button
                      className="delete-notification"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <X size={16} />
                    </button>
                    {!notification.read && <div className="unread-dot"></div>}
                  </div>
                );
              })
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notifications-footer">
              <Link to="/notifications" className="view-all-notifications">
                Показать все уведомления ({notifications.length})
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;

