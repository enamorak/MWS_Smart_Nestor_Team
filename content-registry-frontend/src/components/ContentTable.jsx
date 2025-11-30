import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Download, ArrowUpDown, Eye, Heart, MessageCircle, Video, Image, FileText, RefreshCw } from 'lucide-react';
import { mwsAPI } from '../services/api';

const ContentTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [contentData, setContentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadContentData();
  }, []);

  const loadContentData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mwsAPI.getContentData({ limit: 100 });
      
      if (response.data?.success && response.data?.data?.rows) {
        // Преобразуем данные из MWS в формат таблицы
        const transformedData = response.data.data.rows.map((row, index) => ({
          id: row.id || index + 1,
          title: row.title || 'Без названия',
          type: row.type || 'post',
          date: row.date || row.created_at || new Date().toISOString().split('T')[0],
          views: row.views || 0,
          likes: row.likes || 0,
          comments: row.comments || 0,
          reposts: row.reposts || row.shares || 0,
          sentiment: row.sentiment_positive > 50 ? 'positive' : 
                    row.sentiment_negative > 50 ? 'negative' : 'neutral',
          engagement: row.views > 0 
            ? ((row.likes + row.comments * 2) / row.views * 100).toFixed(1) 
            : 0,
          themes: row.themes || []
        }));
        setContentData(transformedData);
      } else {
        // Fallback на мок-данные если API не вернул данные
        setContentData(getMockData());
      }
    } catch (error) {
      console.error('Error loading content data:', error);
      setError('Не удалось загрузить данные');
      // Используем мок-данные при ошибке
      setContentData(getMockData());
    } finally {
      setLoading(false);
    }
  };

  const getMockData = () => {
    const now = new Date();
    const mockData = [];
    const titles = [
      'Обзор нового продукта 2025', 'Акция недели - скидки до 50%', 'За кулисами производства',
      'Интервью с основателем', 'Отзывы клиентов', 'Новинка сезона', 'Мастер-класс по использованию',
      'История успеха клиента', 'Советы от экспертов', 'Презентация коллекции',
      'Встреча с командой', 'День открытых дверей', 'Специальное предложение',
      'Обновление сервиса', 'Партнерство с брендом', 'Эксклюзивное интервью',
      'Тренды индустрии', 'Секреты успеха', 'Кейс-стади', 'FAQ от пользователей',
      'Видео-обзор функций', 'Сравнение продуктов', 'Руководство для новичков',
      'Продвинутые техники', 'Вдохновляющие истории', 'Практические советы',
      'Разбор ошибок', 'Лучшие практики', 'Инновации в отрасли', 'Мотивационные посты',
      'Стрим с экспертом', 'Вопрос-ответ сессия', 'Демонстрация возможностей',
      'Клиентские истории', 'Образовательный контент', 'Развлекательный контент',
      'Новости компании', 'Анонсы событий', 'Поздравления', 'Благодарности'
    ];
    
    const types = ['video', 'post', 'image'];
    const sentiments = ['positive', 'neutral', 'negative'];
    const themesList = [
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
      
      const type = types[Math.floor(Math.random() * types.length)];
      const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
      const title = titles[Math.floor(Math.random() * titles.length)];
      const themes = themesList[Math.floor(Math.random() * themesList.length)];
      
      // Реалистичные метрики в зависимости от типа
      let views, likes, comments, reposts;
      if (type === 'video') {
        views = 8000 + Math.floor(Math.random() * 12000);
        likes = Math.floor(views * 0.02 + Math.random() * views * 0.01);
        comments = Math.floor(views * 0.003 + Math.random() * views * 0.002);
        reposts = Math.floor(likes * 0.1 + Math.random() * likes * 0.1);
      } else if (type === 'image') {
        views = 5000 + Math.floor(Math.random() * 10000);
        likes = Math.floor(views * 0.025 + Math.random() * views * 0.015);
        comments = Math.floor(views * 0.002 + Math.random() * views * 0.001);
        reposts = Math.floor(likes * 0.08 + Math.random() * likes * 0.08);
      } else {
        views = 3000 + Math.floor(Math.random() * 8000);
        likes = Math.floor(views * 0.015 + Math.random() * views * 0.01);
        comments = Math.floor(views * 0.005 + Math.random() * views * 0.003);
        reposts = Math.floor(likes * 0.06 + Math.random() * likes * 0.06);
      }
      
      const engagement = views > 0 ? parseFloat(((likes + comments * 2) / views * 100).toFixed(1)) : 0;
      
      mockData.push({
        id: i + 1,
        title: `${title}${i > 0 ? ` #${i + 1}` : ''}`,
        type: type,
        date: date.toISOString().split('T')[0],
        views: views,
        likes: likes,
        comments: comments,
        reposts: reposts,
        sentiment: sentiment,
        engagement: engagement,
        themes: themes
      });
    }
    
    // Сортируем по дате (новые сначала)
    return mockData.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Фильтрация и сортировка данных
  const filteredAndSortedData = useMemo(() => {
    let filtered = contentData.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const matchesSentiment = sentimentFilter === 'all' || item.sentiment === sentimentFilter;
      
      return matchesSearch && matchesType && matchesSentiment;
    });

    // Сортировка
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [contentData, searchTerm, typeFilter, sentimentFilter, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown size={14} />;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '#dc2626';
      case 'negative': return '#991b1b';
      case 'neutral': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getSentimentText = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'Позитив';
      case 'negative': return 'Негатив';
      case 'neutral': return 'Нейтрально';
      default: return 'Неизвестно';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return <Video size={16} />;
      case 'post': return <FileText size={16} />;
      case 'image': return <Image size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const exportToCSV = () => {
    const headers = ['Заголовок', 'Тип', 'Дата', 'Просмотры', 'Лайки', 'Комментарии', 'Репосты', 'Тональность', 'Вовлеченность'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedData.map(item => [
        `"${item.title}"`,
        item.type,
        item.date,
        item.views,
        item.likes,
        item.comments,
        item.reposts,
        item.sentiment,
        item.engagement
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="content-table-container">
        <div className="loading-state">
          <RefreshCw className="spinner" size={32} />
          <p>Загрузка данных контента...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-table-container">
      {/* Controls */}
      <div className="table-controls">
        <button onClick={loadContentData} className="btn-refresh" style={{ marginRight: 'auto' }}>
          <RefreshCw size={16} />
          Обновить
        </button>
        <div className="control-group">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Поиск по заголовку..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <div className="filter">
              <Filter size={16} />
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="all">Все типы</option>
                <option value="post">Посты</option>
                <option value="video">Видео</option>
                <option value="image">Изображения</option>
              </select>
            </div>
            
            <div className="filter">
              <Filter size={16} />
              <select value={sentimentFilter} onChange={(e) => setSentimentFilter(e.target.value)}>
                <option value="all">Любая тональность</option>
                <option value="positive">Позитивная</option>
                <option value="neutral">Нейтральная</option>
                <option value="negative">Негативная</option>
              </select>
            </div>
          </div>
        </div>
        
        <button className="export-btn" onClick={exportToCSV}>
          <Download size={18} />
          Экспорт CSV
        </button>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="content-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('title')}>
                <div className="th-content">
                  Заголовок
                  <span className="sort-icon">{getSortIcon('title')}</span>
                </div>
              </th>
              <th onClick={() => handleSort('type')}>
                <div className="th-content">
                  Тип
                  <span className="sort-icon">{getSortIcon('type')}</span>
                </div>
              </th>
              <th onClick={() => handleSort('date')}>
                <div className="th-content">
                  Дата
                  <span className="sort-icon">{getSortIcon('date')}</span>
                </div>
              </th>
              <th onClick={() => handleSort('views')}>
                <div className="th-content">
                  <Eye size={16} />
                  <span className="sort-icon">{getSortIcon('views')}</span>
                </div>
              </th>
              <th onClick={() => handleSort('likes')}>
                <div className="th-content">
                  <Heart size={16} />
                  <span className="sort-icon">{getSortIcon('likes')}</span>
                </div>
              </th>
              <th onClick={() => handleSort('comments')}>
                <div className="th-content">
                  <MessageCircle size={16} />
                  <span className="sort-icon">{getSortIcon('comments')}</span>
                </div>
              </th>
              <th>Репосты</th>
              <th onClick={() => handleSort('sentiment')}>
                <div className="th-content">
                  Тональность
                  <span className="sort-icon">{getSortIcon('sentiment')}</span>
                </div>
              </th>
              <th onClick={() => handleSort('engagement')}>
                <div className="th-content">
                  Вовлеченность
                  <span className="sort-icon">{getSortIcon('engagement')}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.map(item => (
              <tr key={item.id} className="table-row">
                <td>
                  <div className="content-title">
                    {item.title}
                  </div>
                  {item.themes && (
                    <div className="content-themes">
                      {item.themes.slice(0, 2).map((theme, index) => (
                        <span key={index} className="theme-tag">
                          {theme}
                        </span>
                      ))}
                      {item.themes.length > 2 && (
                        <span className="theme-more">+{item.themes.length - 2}</span>
                      )}
                    </div>
                  )}
                </td>
                <td>
                  <div className="type-cell">
                    <span className="type-icon">{getTypeIcon(item.type)}</span>
                    <span className="type-text">{item.type === 'video' ? 'Видео' : item.type === 'post' ? 'Пост' : 'Изображение'}</span>
                  </div>
                </td>
                <td>
                  <div className="date-cell">
                    {new Date(item.date).toLocaleDateString('ru-RU')}
                  </div>
                </td>
                <td>
                  <div className="metric-cell views">
                    {item.views.toLocaleString()}
                  </div>
                </td>
                <td>
                  <div className="metric-cell likes">
                    {item.likes}
                  </div>
                </td>
                <td>
                  <div className="metric-cell comments">
                    {item.comments}
                  </div>
                </td>
                <td>
                  <div className="metric-cell reposts">
                    {item.reposts}
                </div>
                </td>
                <td>
                  <div 
                    className="sentiment-badge"
                    style={{ backgroundColor: getSentimentColor(item.sentiment) }}
                  >
                    {getSentimentText(item.sentiment)}
                  </div>
                </td>
                <td>
                  <div className="engagement-cell">
                    <div className="engagement-bar">
                      <div 
                        className="engagement-fill"
                        style={{ width: `${Math.min(item.engagement * 10, 100)}%` }}
                      ></div>
                    </div>
                    <span className="engagement-value">{item.engagement}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredAndSortedData.length === 0 && (
          <div className="empty-state">
            <FileText size={48} className="empty-icon" />
            <h3>Материалы не найдены</h3>
            <p>Попробуйте изменить параметры фильтрации</p>
          </div>
        )}
      </div>

      {/* Table Summary */}
      <div className="table-summary">
        <div className="summary-item">
          <span className="summary-label">Всего материалов:</span>
          <span className="summary-value">{filteredAndSortedData.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Средняя вовлеченность:</span>
          <span className="summary-value">
            {(
              filteredAndSortedData.reduce((sum, item) => sum + item.engagement, 0) / 
              (filteredAndSortedData.length || 1)
            ).toFixed(1)}%
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Общий охват:</span>
          <span className="summary-value">
            {filteredAndSortedData.reduce((sum, item) => sum + item.views, 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContentTable;