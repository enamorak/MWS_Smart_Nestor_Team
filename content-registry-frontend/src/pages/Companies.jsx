import React, { useState, useEffect } from 'react';
import { Building2, Users, TrendingUp, Eye, Heart, MessageCircle, BarChart3, DollarSign, Globe, Target, Zap } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { mwsAPI } from '../services/api';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    loadCompaniesData();
  }, []);

  const loadCompaniesData = async () => {
    setLoading(true);
    try {
      // Мок-данные компаний (в реальности из MWS Tables)
      const mockCompanies = [
        {
          id: '1',
          name: 'TechCorp',
          industry: 'Технологии',
          users: 12500,
          revenue: 2500000,
          growth: 15.5,
          engagement: 8.2,
          topContent: [
            { title: 'Новый продукт 2025', views: 45000, engagement: 9.1 },
            { title: 'Корпоративная культура', views: 32000, engagement: 7.8 }
          ],
          metrics: {
            totalViews: 1250000,
            totalLikes: 95000,
            totalComments: 15000,
            avgEngagement: 8.2,
            sentiment: { positive: 72, neutral: 22, negative: 6 }
          },
          timeSeries: generateTimeSeries(1250000, 95000, 15000)
        },
        {
          id: '2',
          name: 'RetailPro',
          industry: 'Ритейл',
          users: 8500,
          revenue: 1800000,
          growth: 12.3,
          engagement: 6.8,
          topContent: [
            { title: 'Акция месяца', views: 38000, engagement: 8.5 },
            { title: 'Новая коллекция', views: 29000, engagement: 6.2 }
          ],
          metrics: {
            totalViews: 890000,
            totalLikes: 62000,
            totalComments: 11000,
            avgEngagement: 6.8,
            sentiment: { positive: 68, neutral: 25, negative: 7 }
          },
          timeSeries: generateTimeSeries(890000, 62000, 11000)
        },
        {
          id: '3',
          name: 'ServiceHub',
          industry: 'Услуги',
          users: 5200,
          revenue: 950000,
          growth: 18.7,
          engagement: 7.5,
          topContent: [
            { title: 'Кейс клиента', views: 28000, engagement: 8.9 },
            { title: 'Экспертное мнение', views: 22000, engagement: 7.1 }
          ],
          metrics: {
            totalViews: 560000,
            totalLikes: 42000,
            totalComments: 8500,
            avgEngagement: 7.5,
            sentiment: { positive: 75, neutral: 20, negative: 5 }
          },
          timeSeries: generateTimeSeries(560000, 42000, 8500)
        }
      ];
      setCompanies(mockCompanies);
      if (mockCompanies.length > 0) {
        setSelectedCompany(mockCompanies[0]);
      }
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setLoading(false);
    }
  };

  function generateTimeSeries(totalViews, totalLikes, totalComments) {
    const days = 30;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
        views: Math.round((totalViews / days) * (0.8 + Math.random() * 0.4)),
        likes: Math.round((totalLikes / days) * (0.7 + Math.random() * 0.6)),
        comments: Math.round((totalComments / days) * (0.6 + Math.random() * 0.8))
      });
    }
    return data;
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner">⏳</div>
        <p>Загрузка данных компаний...</p>
      </div>
    );
  }

  return (
    <div className="companies-page">
      <div className="page-header">
        <div>
          <h1><Building2 size={32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />Компании</h1>
          <p>B2B аналитика и управление клиентскими компаниями</p>
        </div>
      </div>

      <div className="companies-layout">
        {/* Список компаний */}
        <div className="companies-sidebar">
          <h3>Клиентские компании</h3>
          <div className="companies-list">
            {companies.map(company => (
              <div
                key={company.id}
                className={`company-card ${selectedCompany?.id === company.id ? 'active' : ''}`}
                onClick={() => setSelectedCompany(company)}
              >
                <div className="company-header">
                  <Building2 size={20} />
                  <h4>{company.name}</h4>
                </div>
                <div className="company-info">
                  <span className="company-industry">{company.industry}</span>
                  <div className="company-stats">
                    <span><Users size={14} /> {company.users.toLocaleString()}</span>
                    <span><DollarSign size={14} /> {(company.revenue / 1000).toFixed(0)}K</span>
                  </div>
                </div>
                <div className="company-growth">
                  <TrendingUp size={14} />
                  <span>+{company.growth}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Детальная информация о компании */}
        {selectedCompany && (
          <div className="company-details">
            <div className="company-details-header">
              <div>
                <h2>{selectedCompany.name}</h2>
                <p>{selectedCompany.industry}</p>
              </div>
              <div className="company-metrics-overview">
                <div className="metric-item">
                  <Eye size={20} />
                  <div>
                    <div className="metric-value">{selectedCompany.metrics.totalViews.toLocaleString()}</div>
                    <div className="metric-label">Просмотры</div>
                  </div>
                </div>
                <div className="metric-item">
                  <Heart size={20} />
                  <div>
                    <div className="metric-value">{selectedCompany.metrics.totalLikes.toLocaleString()}</div>
                    <div className="metric-label">Лайки</div>
                  </div>
                </div>
                <div className="metric-item">
                  <MessageCircle size={20} />
                  <div>
                    <div className="metric-value">{selectedCompany.metrics.totalComments.toLocaleString()}</div>
                    <div className="metric-label">Комментарии</div>
                  </div>
                </div>
                <div className="metric-item">
                  <Target size={20} />
                  <div>
                    <div className="metric-value">{selectedCompany.metrics.avgEngagement}%</div>
                    <div className="metric-label">Вовлеченность</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="company-charts-grid">
              {/* Динамика метрик */}
              <div className="card chart-card">
                <div className="card-header">
                  <h3><TrendingUp size={20} style={{ marginRight: '8px' }} />Динамика метрик</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={selectedCompany.timeSeries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="views" stroke="#dc2626" name="Просмотры" />
                    <Line type="monotone" dataKey="likes" stroke="#991b1b" name="Лайки" />
                    <Line type="monotone" dataKey="comments" stroke="#9ca3af" name="Комментарии" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Тональность */}
              <div className="card chart-card">
                <div className="card-header">
                  <h3><BarChart3 size={20} style={{ marginRight: '8px' }} />Тональность</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Позитивные', value: selectedCompany.metrics.sentiment.positive, color: '#dc2626' },
                        { name: 'Нейтральные', value: selectedCompany.metrics.sentiment.neutral, color: '#9ca3af' },
                        { name: 'Негативные', value: selectedCompany.metrics.sentiment.negative, color: '#991b1b' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Позитивные', value: selectedCompany.metrics.sentiment.positive, color: '#dc2626' },
                        { name: 'Нейтральные', value: selectedCompany.metrics.sentiment.neutral, color: '#9ca3af' },
                        { name: 'Негативные', value: selectedCompany.metrics.sentiment.negative, color: '#991b1b' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Топ контент */}
            <div className="card">
              <div className="card-header">
                <h3><Zap size={20} style={{ marginRight: '8px' }} />Топ контент</h3>
              </div>
              <div className="top-content-list">
                {selectedCompany.topContent.map((content, index) => (
                  <div key={index} className="top-content-item">
                    <div className="content-rank">#{index + 1}</div>
                    <div className="content-info">
                      <div className="content-title">{content.title}</div>
                      <div className="content-stats">
                        <span><Eye size={14} /> {content.views.toLocaleString()}</span>
                        <span><Target size={14} /> {content.engagement}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;

