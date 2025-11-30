import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Filter, Instagram, Youtube, MessageCircle, Globe, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { mwsAPI } from '../services/api';

const PublicationCalendar = ({ companyId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [viewMode, setViewMode] = useState('month'); // 'month' или 'week'

  const networks = [
    { id: 'all', name: 'Все сети', icon: Globe, color: '#6b7280' },
    { id: 'vk', name: 'VK', icon: MessageCircle, color: '#0077FF' },
    { id: 'telegram', name: 'Telegram', icon: MessageCircle, color: '#0088cc' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: '#FF0000' }
  ];

  useEffect(() => {
    loadPublications();
  }, [companyId, currentDate, selectedNetwork]);

  const loadPublications = async () => {
    setLoading(true);
    try {
      // Получаем данные из MWS Tables
      const response = await mwsAPI.getPublicationPlan({
        companyId,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        network: selectedNetwork !== 'all' ? selectedNetwork : undefined
      });
      setPublications(response.data?.publications || generateMockPublications());
    } catch (error) {
      console.error('Error loading publications:', error);
      setPublications(generateMockPublications());
    } finally {
      setLoading(false);
    }
  };

  const generateMockPublications = () => {
    const pubs = [];
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const networkIds = ['vk', 'telegram', 'instagram', 'youtube'];
    const titles = [
      'Новый продукт 2025 - революция в индустрии',
      'Акция недели - скидки до 70%',
      'За кулисами производства - эксклюзивное видео',
      'Интервью с основателем компании',
      'Отзывы клиентов - реальные истории успеха',
      'Новинка сезона - коллекция 2025',
      'Мастер-класс от экспертов',
      'История успеха - как мы достигли цели',
      'Презентация нового офиса',
      'Партнерство с мировыми лидерами',
      'Обновление сервиса - новые возможности',
      'Кейс-стади: решение сложной задачи',
      'Экспертное мнение о трендах',
      'День открытых дверей',
      'Специальное предложение для подписчиков',
      'Обзор функций продукта',
      'Сравнение с конкурентами',
      'Руководство для новичков',
      'Продвинутые техники использования',
      'Вдохновляющие истории клиентов',
      'Практические советы от профессионалов',
      'Разбор типичных ошибок',
      'Лучшие практики индустрии',
      'Инновации в отрасли',
      'Мотивационные посты для команды'
    ];

    const descriptions = [
      'Подробный обзор нового продукта с техническими характеристиками',
      'Ограниченное предложение только для подписчиков',
      'Эксклюзивный доступ за кулисы нашего производства',
      'Личная беседа с основателем о видении компании',
      'Реальные отзывы от довольных клиентов',
      'Презентация новой коллекции с детальным описанием',
      'Пошаговый мастер-класс от ведущих экспертов',
      'История достижения амбициозных целей',
      'Виртуальный тур по новому офису',
      'Анонс стратегического партнерства',
      'Обзор всех новых функций и улучшений',
      'Детальный разбор успешного проекта',
      'Мнение эксперта о будущем индустрии',
      'Приглашение на открытое мероприятие',
      'Эксклюзивное предложение с ограниченным сроком'
    ];

    for (let i = 1; i <= daysInMonth; i++) {
      // Больше публикаций - в среднем 2-4 в день
      const dayPubs = Math.floor(Math.random() * 3) + 1; // 1-3 публикации в день
      for (let j = 0; j < dayPubs; j++) {
        const network = networkIds[Math.floor(Math.random() * networkIds.length)];
        if (selectedNetwork !== 'all' && network !== selectedNetwork) continue;
        
        const titleIndex = Math.floor(Math.random() * titles.length);
        const statuses = ['planned', 'in_progress', 'ready'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Предсказание популярности (0-100)
        const popularityScore = Math.floor(Math.random() * 100);
        const popularityTrend = popularityScore > 70 ? 'high' : popularityScore > 40 ? 'medium' : 'low';
        
        pubs.push({
          id: `${i}-${j}`,
          date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
          title: titles[titleIndex],
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          network: network,
          status: status,
          time: `${9 + Math.floor(Math.random() * 10)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
          views: status === 'ready' ? Math.floor(Math.random() * 50000) + 1000 : 0,
          likes: status === 'ready' ? Math.floor(Math.random() * 5000) + 100 : 0,
          comments: status === 'ready' ? Math.floor(Math.random() * 500) + 10 : 0,
          assignee: ['Иван Петров', 'Мария Сидорова', 'Алексей Иванов', 'Анна Козлова'][Math.floor(Math.random() * 4)],
          popularityScore: popularityScore,
          popularityTrend: popularityTrend,
          predictedViews: Math.floor(popularityScore * 500 + Math.random() * 2000)
        });
      }
    }
    return pubs;
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Дни предыдущего месяца
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false
      });
    }
    
    // Дни текущего месяца
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Дни следующего месяца
    const remainingDays = 42 - days.length; // 6 недель * 7 дней
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  const getPublicationsForDate = (date) => {
    return publications.filter(pub => {
      const pubDate = new Date(pub.date);
      return pubDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const getNetworkInfo = (networkId) => {
    return networks.find(n => n.id === networkId) || networks[0];
  };

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  return (
    <div className="publication-calendar">
      <div className="calendar-header">
        <div className="calendar-controls">
          <button className="calendar-nav-btn" onClick={() => navigateMonth(-1)}>
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>
          <h3 className="calendar-month-year">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button className="calendar-nav-btn" onClick={() => navigateMonth(1)}>
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className="calendar-filters">
          <div className="network-filters">
            {networks.map(network => {
              const Icon = network.icon;
              return (
                <button
                  key={network.id}
                  className={`network-filter-btn ${selectedNetwork === network.id ? 'active' : ''}`}
                  onClick={() => setSelectedNetwork(network.id)}
                  style={{ '--network-color': network.color }}
                >
                  <Icon size={16} strokeWidth={1.5} />
                  <span>{network.name}</span>
                </button>
              );
            })}
          </div>
          
          <button className="btn-primary" onClick={() => {/* Открыть модальное окно создания */}}>
            <Plus size={16} strokeWidth={1.5} />
            <span>Добавить публикацию</span>
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {weekDays.map(day => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
        </div>

        <div className="calendar-days">
          {getDaysInMonth().map((day, index) => {
            const dayPublications = getPublicationsForDate(day.date);
            const isToday = day.date.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={index}
                className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
              >
                <div className="calendar-day-number">{day.date.getDate()}</div>
                <div className="calendar-day-publications">
                  {dayPublications.map(pub => {
                    const networkInfo = getNetworkInfo(pub.network);
                    const Icon = networkInfo.icon;
                    return (
                      <div
                        key={pub.id}
                        className={`publication-item publication-${pub.status}`}
                        style={{ borderLeftColor: networkInfo.color }}
                        title={`${pub.title} - ${pub.time}${pub.popularityScore ? ` | Популярность: ${pub.popularityScore}%` : ''}`}
                      >
                        <Icon size={14} strokeWidth={1.5} />
                        <span className="publication-title">{pub.title.length > 25 ? pub.title.substring(0, 25) + '...' : pub.title}</span>
                        <span className="publication-time">{pub.time}</span>
                        {pub.popularityScore !== undefined && (
                          <div className={`publication-popularity popularity-${pub.popularityTrend}`} title={`Предсказанная популярность: ${pub.popularityScore}%`}>
                            {pub.popularityTrend === 'high' ? <TrendingUp size={12} strokeWidth={1.5} /> : pub.popularityTrend === 'medium' ? <Minus size={12} strokeWidth={1.5} /> : <TrendingDown size={12} strokeWidth={1.5} />}
                            <span>{pub.popularityScore}%</span>
                          </div>
                        )}
                        {pub.views > 0 && (
                          <span className="publication-stats">
                            👁 {pub.views > 1000 ? (pub.views / 1000).toFixed(1) + 'K' : pub.views}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PublicationCalendar;

