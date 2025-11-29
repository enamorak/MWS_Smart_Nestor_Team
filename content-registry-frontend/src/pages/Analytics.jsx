import React from 'react';
import { TrendingUp, Users, Clock, MessageCircle } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="analytics-page">
      <div className="page-header">
        <h1>Детальная аналитика</h1>
        <p>Глубокий анализ эффективности контента</p>
      </div>

      <div className="analytics-grid">
        <div className="card">
          <h3>Динамика просмотров</h3>
          <div className="chart-placeholder">
            <TrendingUp size={48} />
            <p>График просмотров по дням</p>
          </div>
        </div>

        <div className="card">
          <h3>Распределение типов контента</h3>
          <div className="chart-placeholder">
            <Users size={48} />
            <p>Круговая диаграмма типов</p>
          </div>
        </div>

        <div className="card">
          <h3>Топ материалы</h3>
          <div className="top-content">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="top-item">
                <div className="top-rank">#{i}</div>
                <div className="top-content">
                  <div className="top-title">Лучший пост {i}</div>
                  <div className="top-stats">1,234 лайков</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Анализ тональности</h3>
          <div className="sentiment-analysis">
            <div className="sentiment-item positive">
              <MessageCircle size={20} />
              <span>Позитивные: 65%</span>
            </div>
            <div className="sentiment-item neutral">
              <MessageCircle size={20} />
              <span>Нейтральные: 25%</span>
            </div>
            <div className="sentiment-item negative">
              <MessageCircle size={20} />
              <span>Негативные: 10%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;