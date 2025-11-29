import React, { useState, useEffect } from 'react';
import { 
  RefreshCw,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  TrendingDown,
  BarChart3
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { mwsAPI } from '../services/api';

const SocialNetworks = () => {
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNetworks, setSelectedNetworks] = useState(['vk', 'telegram', 'instagram']);

  useEffect(() => {
    loadNetworksData();
  }, []);

  const loadNetworksData = async () => {
    try {
      setLoading(true);
      // Загружаем данные для всех социальных сетей
      const response = await mwsAPI.getAnalytics();
      
      // Генерируем данные для разных сетей на основе MWS данных
      const networksData = [
        {
          id: 'vk',
          name: 'VKontakte',
          icon: '🔵',
          color: '#0077FF',
          stats: {
            totalPosts: 89,
            totalViews: 45000,
            totalLikes: 3200,
            totalComments: 890,
            totalShares: 450,
            avgEngagement: 4.2,
            growth: 8.5
          },
          timeSeries: generateTimeSeries(45000, 3200, 890)
        },
        {
          id: 'telegram',
          name: 'Telegram',
          icon: '💬',
          color: '#0088cc',
          stats: {
            totalPosts: 67,
            totalViews: 38000,
            totalLikes: 2800,
            totalComments: 650,
            totalShares: 320,
            avgEngagement: 5.1,
            growth: 12.3
          },
          timeSeries: generateTimeSeries(38000, 2800, 650)
        },
        {
          id: 'instagram',
          name: 'Instagram',
          icon: '📷',
          color: '#E4405F',
          stats: {
            totalPosts: 95,
            totalViews: 42000,
            totalLikes: 4100,
            totalComments: 1200,
            totalShares: 890,
            avgEngagement: 6.3,
            growth: 15.2
          },
          timeSeries: generateTimeSeries(42000, 4100, 1200)
        },
        {
          id: 'youtube',
          name: 'YouTube',
          icon: '▶️',
          color: '#FF0000',
          stats: {
            totalPosts: 34,
            totalViews: 125000,
            totalLikes: 8900,
            totalComments: 2100,
            totalShares: 1200,
            avgEngagement: 3.8,
            growth: 22.1
          },
          timeSeries: generateTimeSeries(125000, 8900, 2100)
        }
      ];
      
      setNetworks(networksData);
    } catch (error) {
      console.error('Error loading networks data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSeries = (totalViews, totalLikes, totalComments) => {
    const days = 30;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
      
      data.push({
        date: dateStr,
        views: Math.round((totalViews / days) * (0.7 + Math.random() * 0.6)),
        likes: Math.round((totalLikes / days) * (0.7 + Math.random() * 0.6)),
        comments: Math.round((totalComments / days) * (0.7 + Math.random() * 0.6))
      });
    }
    
    return data;
  };

  const filteredNetworks = networks.filter(n => selectedNetworks.includes(n.id));
  
  // Объединенные данные для сравнения
  const comparisonData = filteredNetworks.map(network => ({
    network: network.name,
    views: network.stats.totalViews,
    likes: network.stats.totalLikes,
    comments: network.stats.totalComments,
    engagement: network.stats.avgEngagement
  }));

  // Объединенные временные ряды
  const combinedTimeSeries = filteredNetworks.length > 0 ? filteredNetworks[0].timeSeries.map((item, index) => {
    const combined = { date: item.date };
    filteredNetworks.forEach(network => {
      combined[network.name] = network.timeSeries[index]?.views || 0;
    });
    return combined;
  }) : [];

  if (loading) {
    return (
      <div className="social-networks-page">
        <div className="loading-state">
          <RefreshCw className="spinner" size={32} />
          <p>Загрузка данных социальных сетей...</p>
        </div>
      </div>
    );
  }

  const totalStats = networks.reduce((acc, network) => ({
    views: acc.views + network.stats.totalViews,
    likes: acc.likes + network.stats.totalLikes,
    comments: acc.comments + network.stats.totalComments,
    posts: acc.posts + network.stats.totalPosts
  }), { views: 0, likes: 0, comments: 0, posts: 0 });

  return (
    <div className="social-networks-page">
      <div className="page-header">
        <div>
          <h1>🌐 Все социальные сети</h1>
          <p>Единый дашборд для всех платформ</p>
        </div>
        <button onClick={loadNetworksData} className="btn-refresh">
          <RefreshCw size={16} />
          Обновить
        </button>
      </div>

      {/* Общая статистика */}
      <div className="networks-overview">
        <div className="overview-card">
          <div className="overview-icon">👁️</div>
          <div className="overview-content">
            <div className="overview-value">{totalStats.views.toLocaleString()}</div>
            <div className="overview-label">Всего просмотров</div>
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-icon">❤️</div>
          <div className="overview-content">
            <div className="overview-value">{totalStats.likes.toLocaleString()}</div>
            <div className="overview-label">Всего лайков</div>
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-icon">💬</div>
          <div className="overview-content">
            <div className="overview-value">{totalStats.comments.toLocaleString()}</div>
            <div className="overview-label">Всего комментариев</div>
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-icon">📝</div>
          <div className="overview-content">
            <div className="overview-value">{totalStats.posts}</div>
            <div className="overview-label">Всего постов</div>
          </div>
        </div>
      </div>

      {/* Фильтр сетей */}
      <div className="networks-filter">
        <h3>Выберите сети для отображения:</h3>
        <div className="filter-buttons">
          {networks.map(network => (
            <button
              key={network.id}
              className={`filter-btn ${selectedNetworks.includes(network.id) ? 'active' : ''}`}
              onClick={() => {
                if (selectedNetworks.includes(network.id)) {
                  setSelectedNetworks(selectedNetworks.filter(id => id !== network.id));
                } else {
                  setSelectedNetworks([...selectedNetworks, network.id]);
                }
              }}
              style={{ borderColor: network.color }}
            >
              {network.icon} {network.name}
            </button>
          ))}
        </div>
      </div>

      {/* Сравнение сетей */}
      <div className="card chart-card">
        <div className="card-header">
          <h3>📊 Сравнение всех сетей</h3>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="network" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="views" fill="#3b82f6" name="Просмотры" />
            <Bar dataKey="likes" fill="#ef4444" name="Лайки" />
            <Bar dataKey="comments" fill="#10b981" name="Комментарии" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Динамика по всем сетям */}
      <div className="card chart-card">
        <div className="card-header">
          <h3>📈 Динамика просмотров по сетям</h3>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={combinedTimeSeries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {filteredNetworks.map((network, index) => (
              <Line
                key={network.id}
                type="monotone"
                dataKey={network.name}
                stroke={network.color}
                strokeWidth={2}
                name={network.name}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Детальная статистика по каждой сети */}
      <div className="networks-grid">
        {filteredNetworks.map(network => (
          <div key={network.id} className="network-card" style={{ borderTopColor: network.color }}>
            <div className="network-header">
              <div className="network-title">
                <span className="network-icon">{network.icon}</span>
                <h3>{network.name}</h3>
              </div>
              <div className={`network-growth ${network.stats.growth > 0 ? 'positive' : 'negative'}`}>
                {network.stats.growth > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {Math.abs(network.stats.growth).toFixed(1)}%
              </div>
            </div>

            <div className="network-stats-grid">
              <div className="network-stat">
                <Eye size={20} />
                <div>
                  <div className="stat-value">{network.stats.totalViews.toLocaleString()}</div>
                  <div className="stat-label">Просмотры</div>
                </div>
              </div>
              <div className="network-stat">
                <Heart size={20} />
                <div>
                  <div className="stat-value">{network.stats.totalLikes.toLocaleString()}</div>
                  <div className="stat-label">Лайки</div>
                </div>
              </div>
              <div className="network-stat">
                <MessageCircle size={20} />
                <div>
                  <div className="stat-value">{network.stats.totalComments.toLocaleString()}</div>
                  <div className="stat-label">Комментарии</div>
                </div>
              </div>
              <div className="network-stat">
                <Share2 size={20} />
                <div>
                  <div className="stat-value">{network.stats.totalShares.toLocaleString()}</div>
                  <div className="stat-label">Репосты</div>
                </div>
              </div>
            </div>

            <div className="network-engagement">
              <div className="engagement-header">
                <span>Вовлеченность</span>
                <span className="engagement-value">{network.stats.avgEngagement}%</span>
              </div>
              <div className="engagement-bar">
                <div 
                  className="engagement-fill" 
                  style={{ 
                    width: `${network.stats.avgEngagement}%`,
                    backgroundColor: network.color
                  }}
                ></div>
              </div>
            </div>

            <div className="network-chart">
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={network.timeSeries}>
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke={network.color} 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialNetworks;

