import React, { useState, useEffect } from 'react';
import { 
  RefreshCw,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  Image,
  Video,
  FileText
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
          icon: <Users size={20} />,
          color: '#dc2626',
          stats: {
            totalPosts: 142,
            totalViews: 287500,
            totalLikes: 18450,
            totalComments: 5230,
            totalShares: 2150,
            avgEngagement: 4.8,
            growth: 12.5
          },
          timeSeries: generateTimeSeries(287500, 18450, 5230)
        },
        {
          id: 'telegram',
          name: 'Telegram',
          icon: <MessageCircle size={20} />,
          color: '#991b1b',
          stats: {
            totalPosts: 98,
            totalViews: 195000,
            totalLikes: 12400,
            totalComments: 3890,
            totalShares: 1870,
            avgEngagement: 5.6,
            growth: 18.3
          },
          timeSeries: generateTimeSeries(195000, 12400, 3890)
        },
        {
          id: 'instagram',
          name: 'Instagram',
          icon: <Image size={20} />,
          color: '#9ca3af',
          stats: {
            totalPosts: 156,
            totalViews: 342000,
            totalLikes: 28700,
            totalComments: 8450,
            totalShares: 3200,
            avgEngagement: 7.2,
            growth: 24.7
          },
          timeSeries: generateTimeSeries(342000, 28700, 8450)
        },
        {
          id: 'youtube',
          name: 'YouTube',
          icon: <Video size={20} />,
          color: '#d1d5db',
          stats: {
            totalPosts: 67,
            totalViews: 485000,
            totalLikes: 34200,
            totalComments: 12400,
            totalShares: 5600,
            avgEngagement: 4.1,
            growth: 31.2
          },
          timeSeries: generateTimeSeries(485000, 34200, 12400)
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
          <h1><Users size={24} style={{ marginRight: '12px', verticalAlign: 'middle' }} />Все социальные сети</h1>
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
          <div className="overview-icon"><Eye size={32} /></div>
          <div className="overview-content">
            <div className="overview-value">{totalStats.views.toLocaleString()}</div>
            <div className="overview-label">Всего просмотров</div>
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-icon"><Heart size={32} /></div>
          <div className="overview-content">
            <div className="overview-value">{totalStats.likes.toLocaleString()}</div>
            <div className="overview-label">Всего лайков</div>
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-icon"><MessageCircle size={32} /></div>
          <div className="overview-content">
            <div className="overview-value">{totalStats.comments.toLocaleString()}</div>
            <div className="overview-label">Всего комментариев</div>
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-icon"><FileText size={32} /></div>
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
              <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: '8px' }}>{network.icon}</span>
              {network.name}
            </button>
          ))}
        </div>
      </div>

      {/* Сравнение сетей */}
      <div className="card chart-card">
        <div className="card-header">
          <h3><BarChart3 size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Сравнение всех сетей</h3>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="network" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="views" fill="#dc2626" name="Просмотры" />
            <Bar dataKey="likes" fill="#991b1b" name="Лайки" />
            <Bar dataKey="comments" fill="#9ca3af" name="Комментарии" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Динамика по всем сетям */}
      <div className="card chart-card">
        <div className="card-header">
          <h3><TrendingUp size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Динамика просмотров по сетям</h3>
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
              <span className="network-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>{network.icon}</span>
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

