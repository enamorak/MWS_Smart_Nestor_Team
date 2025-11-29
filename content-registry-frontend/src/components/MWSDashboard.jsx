import React, { useState, useEffect } from 'react';
import { RefreshCw, ExternalLink, BarChart3 } from 'lucide-react';
import { mwsAPI } from '../services/api';

const MWSDashboard = ({ dashboardId }) => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, [dashboardId]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mwsAPI.getDashboards();
      
      // Находим нужный дашборд или используем первый
      const dashboards = response.data.dashboards || [];
      const selectedDashboard = dashboardId 
        ? dashboards.find(d => d.id === dashboardId) 
        : dashboards[0];
      
      setDashboard(selectedDashboard || {
        id: 'default',
        name: 'Default Dashboard',
        widgets: []
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setError('Не удалось загрузить дашборд');
      // Используем мок-дашборд
      setDashboard({
        id: 'mock',
        name: 'Content Analytics Dashboard',
        description: 'Аналитика эффективности контента из MWS Tables',
        widgets: [
          {
            type: 'stats',
            title: 'Ключевые метрики',
            config: { metrics: ['total_posts', 'total_views', 'engagement_rate'] }
          },
          {
            type: 'chart',
            title: 'Динамика просмотров',
            config: { chart_type: 'line', metric: 'views' }
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const renderWidget = (widget) => {
    switch (widget.type) {
      case 'stats':
        return (
          <div key={widget.title} className="mws-widget stats-widget">
            <h4>{widget.title}</h4>
            <div className="widget-content">
              <p>Метрики: {widget.config?.metrics?.join(', ') || 'N/A'}</p>
              <p className="widget-note">
                Данные загружаются из MWS Tables. Для полной интеграции настройте подключение к MWS API.
              </p>
            </div>
          </div>
        );
      
      case 'chart':
        return (
          <div key={widget.title} className="mws-widget chart-widget">
            <h4>{widget.title}</h4>
            <div className="widget-content">
              <p>Тип графика: {widget.config?.chart_type || 'line'}</p>
              <p>Метрика: {widget.config?.metric || 'views'}</p>
              <p className="widget-note">
                График будет отображаться здесь после настройки MWS API.
              </p>
            </div>
          </div>
        );
      
      case 'table':
        return (
          <div key={widget.title} className="mws-widget table-widget">
            <h4>{widget.title}</h4>
            <div className="widget-content">
              <p className="widget-note">
                Таблица данных из MWS Tables будет отображаться здесь.
              </p>
            </div>
          </div>
        );
      
      default:
        return (
          <div key={widget.title} className="mws-widget">
            <h4>{widget.title}</h4>
            <div className="widget-content">
              <p>Тип виджета: {widget.type}</p>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="mws-dashboard loading">
        <RefreshCw className="spinner" size={32} />
        <p>Загрузка дашборда из MWS Tables...</p>
      </div>
    );
  }

  if (error && !dashboard) {
    return (
      <div className="mws-dashboard error">
        <p>{error}</p>
        <button onClick={loadDashboard} className="btn-retry">
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="mws-dashboard">
      <div className="mws-dashboard-header">
        <div>
          <h3>
            <BarChart3 size={20} />
            {dashboard?.name || 'MWS Dashboard'}
          </h3>
          {dashboard?.description && (
            <p className="dashboard-description">{dashboard.description}</p>
          )}
        </div>
        <div className="dashboard-actions">
          <a 
            href={`https://mws.tables/dashboards/${dashboard?.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-external"
          >
            <ExternalLink size={16} />
            Открыть в MWS
          </a>
          <button onClick={loadDashboard} className="btn-refresh">
            <RefreshCw size={16} />
            Обновить
          </button>
        </div>
      </div>

      <div className="mws-widgets-grid">
        {dashboard?.widgets?.map(widget => renderWidget(widget))}
        {(!dashboard?.widgets || dashboard.widgets.length === 0) && (
          <div className="mws-widget empty">
            <p>Нет виджетов в этом дашборде</p>
            <p className="widget-note">
              Добавьте виджеты в MWS Tables для отображения здесь.
            </p>
          </div>
        )}
      </div>

      <div className="mws-integration-info">
        <h4>Интеграция с MWS Tables</h4>
        <p>
          Этот дашборд подключен к MWS Tables. Для полной функциональности:
        </p>
        <ul>
          <li>Настройте MWS_API_KEY и MWS_APP_ID в переменных окружения</li>
          <li>Убедитесь, что MWS_BASE_URL указывает на правильный API endpoint</li>
          <li>Создайте дашборды в MWS Tables с нужными виджетами</li>
        </ul>
      </div>
    </div>
  );
};

export default MWSDashboard;

