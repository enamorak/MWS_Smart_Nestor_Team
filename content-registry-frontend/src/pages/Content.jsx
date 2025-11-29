import React, { useState } from 'react';
import { Search, Filter, Download, Plus } from 'lucide-react';

const Content = () => {
  const [filter, setFilter] = useState('all');
  
  const contentItems = [
    {
      id: 1,
      title: 'Обзор нового продукта',
      type: 'video',
      date: '2025-11-29',
      views: 12500,
      likes: 245,
      comments: 34,
      sentiment: 'positive',
      engagement: 4.2
    },
    {
      id: 2,
      title: 'Акция недели',
      type: 'post',
      date: '2025-11-28',
      views: 8900,
      likes: 156,
      comments: 89,
      sentiment: 'negative',
      engagement: 2.1
    },
    {
      id: 3,
      title: 'За кулисами производства',
      type: 'image',
      date: '2025-11-27',
      views: 15600,
      likes: 312,
      comments: 45,
      sentiment: 'positive',
      engagement: 5.8
    }
  ];

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '#10b981';
      case 'negative': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="content-page">
      <div className="page-header">
        <div>
          <h1>Управление контентом</h1>
          <p>Все ваши публикации в одном месте</p>
        </div>
        <button className="btn-primary">
          <Plus size={20} />
          Новый материал
        </button>
      </div>

      <div className="content-controls">
        <div className="search-box">
          <Search size={20} />
          <input type="text" placeholder="Поиск по контенту..." />
        </div>
        
        <div className="filters">
          <Filter size={20} />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Все типы</option>
            <option value="post">Посты</option>
            <option value="video">Видео</option>
            <option value="image">Изображения</option>
          </select>
        </div>

        <button className="btn-secondary">
          <Download size={20} />
          Экспорт
        </button>
      </div>

      <div className="content-table">
        <div className="table-header">
          <div className="col-title">Заголовок</div>
          <div className="col-type">Тип</div>
          <div className="col-date">Дата</div>
          <div className="col-metrics">Просмотры</div>
          <div className="col-metrics">Лайки</div>
          <div className="col-metrics">Комментарии</div>
          <div className="col-sentiment">Тональность</div>
          <div className="col-engagement">Вовлеченность</div>
        </div>

        <div className="table-body">
          {contentItems.map(item => (
            <div key={item.id} className="table-row">
              <div className="col-title">
                <div className="content-title">{item.title}</div>
              </div>
              <div className="col-type">
                <span className={`type-badge ${item.type}`}>
                  {item.type === 'video' && '🎥'}
                  {item.type === 'post' && '📝'}
                  {item.type === 'image' && '🖼️'}
                  {item.type}
                </span>
              </div>
              <div className="col-date">{item.date}</div>
              <div className="col-metrics">{item.views.toLocaleString()}</div>
              <div className="col-metrics">{item.likes}</div>
              <div className="col-metrics">{item.comments}</div>
              <div className="col-sentiment">
                <span 
                  className="sentiment-badge"
                  style={{ backgroundColor: getSentimentColor(item.sentiment) }}
                >
                  {item.sentiment === 'positive' ? 'Позитив' : 'Негатив'}
                </span>
              </div>
              <div className="col-engagement">
                <div className="engagement-bar">
                  <div 
                    className="engagement-fill"
                    style={{ width: `${Math.min(item.engagement * 10, 100)}%` }}
                  ></div>
                </div>
                <span>{item.engagement}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Content;