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

  const getMockData = () => [
    {
      id: 1,
      title: 'Обзор нового продукта 2025',
      type: 'video',
      date: '2025-11-29',
      views: 12500,
      likes: 245,
      comments: 34,
      reposts: 12,
      sentiment: 'positive',
      engagement: 4.2,
      themes: ['продукт', 'обзор', 'новинка']
    },
    {
      id: 2,
      title: 'Акция недели - скидки до 50%',
      type: 'post',
      date: '2025-11-28',
      views: 8900,
      likes: 156,
      comments: 89,
      reposts: 8,
      sentiment: 'negative',
      engagement: 2.1,
      themes: ['акция', 'скидки', 'цены']
    },
    {
      id: 3,
      title: 'За кулисами производства',
      type: 'image',
      date: '2025-11-27',
      views: 15600,
      likes: 312,
      comments: 45,
      reposts: 23,
      sentiment: 'positive',
      engagement: 5.8,
      themes: ['производство', 'закулисье', 'качество']
    },
    {
      id: 4,
      title: 'Интервью с основателем',
      type: 'video',
      date: '2025-11-26',
      views: 9800,
      likes: 198,
      comments: 28,
      reposts: 15,
      sentiment: 'positive',
      engagement: 4.8,
      themes: ['интервью', 'основатель', 'история']
    },
    {
      id: 5,
      title: 'Отзывы клиентов',
      type: 'post',
      date: '2025-11-25',
      views: 7200,
      likes: 124,
      comments: 67,
      reposts: 6,
      sentiment: 'neutral',
      engagement: 3.2,
      themes: ['отзывы', 'клиенты', 'опыт']
    }
  ];

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
      case 'positive': return '#10b981';
      case 'negative': return '#ef4444';
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