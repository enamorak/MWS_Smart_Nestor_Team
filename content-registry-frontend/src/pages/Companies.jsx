import React, { useState, useEffect } from 'react';
import { Building2, Users, TrendingUp, Eye, Heart, MessageCircle, BarChart3, DollarSign, Globe, Target, Zap, Calendar, GanttChart, Plus } from 'lucide-react';
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
import PublicationCalendar from '../components/PublicationCalendar';
import GanttChartComponent from '../components/GanttChart';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' или 'publications'
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: '',
    users: '',
    revenue: ''
  });

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
            { title: 'Корпоративная культура', views: 32000, engagement: 7.8 },
            { title: 'Инновации в AI', views: 41000, engagement: 8.9 },
            { title: 'Открытие нового офиса', views: 28000, engagement: 7.5 },
            { title: 'Партнерство с лидерами', views: 35000, engagement: 8.2 }
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
            { title: 'Новая коллекция', views: 29000, engagement: 6.2 },
            { title: 'Скидки до 70%', views: 52000, engagement: 9.3 },
            { title: 'Открытие нового магазина', views: 24000, engagement: 6.8 },
            { title: 'Сотрудничество с брендами', views: 31000, engagement: 7.1 }
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
            { title: 'Экспертное мнение', views: 22000, engagement: 7.1 },
            { title: 'Новые услуги', views: 19000, engagement: 6.5 },
            { title: 'Отзывы клиентов', views: 25000, engagement: 8.2 },
            { title: 'Сертификация качества', views: 16000, engagement: 6.9 }
          ],
          metrics: {
            totalViews: 560000,
            totalLikes: 42000,
            totalComments: 8500,
            avgEngagement: 7.5,
            sentiment: { positive: 75, neutral: 20, negative: 5 }
          },
          timeSeries: generateTimeSeries(560000, 42000, 8500)
        },
        {
          id: '4',
          name: 'FinanceGroup',
          industry: 'Финансы',
          users: 15200,
          revenue: 3200000,
          growth: 22.1,
          engagement: 9.1,
          topContent: [
            { title: 'Новые инвестиционные продукты', views: 68000, engagement: 9.8 },
            { title: 'Финансовые советы', views: 45000, engagement: 8.5 },
            { title: 'Аналитика рынка', views: 52000, engagement: 9.2 },
            { title: 'Клиентские истории успеха', views: 38000, engagement: 8.1 },
            { title: 'Обновление мобильного приложения', views: 41000, engagement: 7.9 }
          ],
          metrics: {
            totalViews: 2100000,
            totalLikes: 185000,
            totalComments: 28000,
            avgEngagement: 9.1,
            sentiment: { positive: 78, neutral: 18, negative: 4 }
          },
          timeSeries: generateTimeSeries(2100000, 185000, 28000)
        },
        {
          id: '5',
          name: 'HealthCare Plus',
          industry: 'Здравоохранение',
          users: 9800,
          revenue: 1950000,
          growth: 16.8,
          engagement: 7.9,
          topContent: [
            { title: 'Новые медицинские услуги', views: 42000, engagement: 8.7 },
            { title: 'Советы по здоровью', views: 35000, engagement: 7.8 },
            { title: 'Открытие клиники', views: 29000, engagement: 7.2 },
            { title: 'Врачи-эксперты', views: 31000, engagement: 8.0 },
            { title: 'Программы лояльности', views: 26000, engagement: 6.9 }
          ],
          metrics: {
            totalViews: 1450000,
            totalLikes: 112000,
            totalComments: 19500,
            avgEngagement: 7.9,
            sentiment: { positive: 81, neutral: 16, negative: 3 }
          },
          timeSeries: generateTimeSeries(1450000, 112000, 19500)
        },
        {
          id: '6',
          name: 'EduPlatform',
          industry: 'Образование',
          users: 7200,
          revenue: 1200000,
          growth: 19.3,
          engagement: 8.5,
          topContent: [
            { title: 'Новые курсы', views: 38000, engagement: 9.0 },
            { title: 'Успехи студентов', views: 32000, engagement: 8.3 },
            { title: 'Бесплатные вебинары', views: 45000, engagement: 9.5 },
            { title: 'Партнерство с университетами', views: 28000, engagement: 7.6 },
            { title: 'Обновление платформы', views: 24000, engagement: 7.2 }
          ],
          metrics: {
            totalViews: 980000,
            totalLikes: 82000,
            totalComments: 14500,
            avgEngagement: 8.5,
            sentiment: { positive: 85, neutral: 13, negative: 2 }
          },
          timeSeries: generateTimeSeries(980000, 82000, 14500)
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

  const handleAddCompany = () => {
    if (!newCompany.name || !newCompany.industry) {
      alert('Заполните обязательные поля');
      return;
    }
    
    const company = {
      id: String(companies.length + 1),
      name: newCompany.name,
      industry: newCompany.industry,
      users: parseInt(newCompany.users) || 0,
      revenue: parseFloat(newCompany.revenue) || 0,
      growth: (Math.random() * 20 + 5).toFixed(1),
      engagement: (Math.random() * 5 + 5).toFixed(1),
      topContent: [
        { title: 'Новый пост 1', views: Math.floor(Math.random() * 50000) + 10000, engagement: (Math.random() * 5 + 5).toFixed(1) },
        { title: 'Новый пост 2', views: Math.floor(Math.random() * 40000) + 8000, engagement: (Math.random() * 5 + 5).toFixed(1) },
        { title: 'Новый пост 3', views: Math.floor(Math.random() * 30000) + 5000, engagement: (Math.random() * 5 + 5).toFixed(1) },
        { title: 'Новый пост 4', views: Math.floor(Math.random() * 25000) + 4000, engagement: (Math.random() * 5 + 5).toFixed(1) },
        { title: 'Новый пост 5', views: Math.floor(Math.random() * 20000) + 3000, engagement: (Math.random() * 5 + 5).toFixed(1) }
      ],
      metrics: {
        totalViews: Math.floor(Math.random() * 2000000) + 500000,
        totalLikes: Math.floor(Math.random() * 200000) + 50000,
        totalComments: Math.floor(Math.random() * 30000) + 10000,
        avgEngagement: (Math.random() * 5 + 5).toFixed(1),
        sentiment: {
          positive: Math.floor(Math.random() * 20) + 65,
          neutral: Math.floor(Math.random() * 15) + 15,
          negative: Math.floor(Math.random() * 10) + 3
        }
      },
      timeSeries: generateTimeSeries(
        Math.floor(Math.random() * 2000000) + 500000,
        Math.floor(Math.random() * 200000) + 50000,
        Math.floor(Math.random() * 30000) + 10000
      )
    };
    
    setCompanies([...companies, company]);
    setSelectedCompany(company);
    setShowAddCompanyModal(false);
    setNewCompany({ name: '', industry: '', users: '', revenue: '' });
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
          <h1><Building2 size={32} strokeWidth={1.5} style={{ marginRight: '12px', verticalAlign: 'middle' }} />Компании</h1>
          <p>B2B аналитика и управление клиентскими компаниями</p>
        </div>
      </div>

      {/* Компании в горизонтальном ряду */}
      <div className="companies-horizontal">
        <div className="companies-section-header">
          <h3 className="companies-section-title">Клиентские компании</h3>
          <button className="btn-primary" onClick={() => setShowAddCompanyModal(true)}>
            <Plus size={16} strokeWidth={1.5} />
            <span>Добавить компанию</span>
          </button>
        </div>
        <div className="companies-row">
          {companies.map(company => (
            <div
              key={company.id}
              className={`company-card-horizontal ${selectedCompany?.id === company.id ? 'active' : ''}`}
              onClick={() => setSelectedCompany(company)}
            >
              <div className="company-card-header">
                <Building2 size={24} strokeWidth={1.5} />
                <div>
                  <h4>{company.name}</h4>
                  <span className="company-industry">{company.industry}</span>
                </div>
              </div>
              <div className="company-card-stats">
                <div className="company-stat-item">
                  <Users size={16} strokeWidth={1.5} />
                  <span>{company.users.toLocaleString()}</span>
                </div>
                <div className="company-stat-item">
                  <DollarSign size={16} strokeWidth={1.5} />
                  <span>{(company.revenue / 1000).toFixed(0)}K</span>
                </div>
                <div className="company-stat-item growth">
                  <TrendingUp size={16} strokeWidth={1.5} />
                  <span>+{company.growth}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Детальная информация о компании */}
      {selectedCompany && (
        <div className="company-details-full">
            <div className="company-details-header">
              <div>
                <h2>{selectedCompany.name}</h2>
                <p>{selectedCompany.industry}</p>
              </div>
              
              {/* Вкладки */}
              <div className="company-tabs">
                <button
                  className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
                  onClick={() => setActiveTab('analytics')}
                >
                  <BarChart3 size={18} strokeWidth={1.5} />
                  <span>Аналитика</span>
                </button>
                <button
                  className={`tab-button ${activeTab === 'publications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('publications')}
                >
                  <Calendar size={18} strokeWidth={1.5} />
                  <span>План публикаций</span>
                </button>
              </div>
            </div>

            {/* Контент вкладок */}
            {activeTab === 'analytics' && (
              <div>
                <div className="company-metrics-overview">
                  <div className="metric-item">
                    <Eye size={20} strokeWidth={1.5} />
                    <div>
                      <div className="metric-value">{selectedCompany.metrics.totalViews.toLocaleString()}</div>
                      <div className="metric-label">Просмотры</div>
                    </div>
                  </div>
                  <div className="metric-item">
                    <Heart size={20} strokeWidth={1.5} />
                    <div>
                      <div className="metric-value">{selectedCompany.metrics.totalLikes.toLocaleString()}</div>
                      <div className="metric-label">Лайки</div>
                    </div>
                  </div>
                  <div className="metric-item">
                    <MessageCircle size={20} strokeWidth={1.5} />
                    <div>
                      <div className="metric-value">{selectedCompany.metrics.totalComments.toLocaleString()}</div>
                      <div className="metric-label">Комментарии</div>
                    </div>
                  </div>
                  <div className="metric-item">
                    <Target size={20} strokeWidth={1.5} />
                    <div>
                      <div className="metric-value">{selectedCompany.metrics.avgEngagement}%</div>
                      <div className="metric-label">Вовлеченность</div>
                    </div>
                  </div>
                </div>

                <div className="company-charts-grid">
                  {/* Динамика метрик */}
                  <div className="card chart-card">
                    <div className="card-header">
                      <h3><TrendingUp size={20} strokeWidth={1.5} style={{ marginRight: '8px' }} />Динамика метрик</h3>
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
                      <h3><BarChart3 size={20} strokeWidth={1.5} style={{ marginRight: '8px' }} />Тональность</h3>
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
                    <h3><Zap size={20} strokeWidth={1.5} style={{ marginRight: '8px' }} />Топ контент</h3>
                  </div>
                  <div className="top-content-list">
                    {selectedCompany.topContent.map((content, index) => (
                      <div key={index} className="top-content-item">
                        <div className="content-rank">#{index + 1}</div>
                        <div className="content-info">
                          <div className="content-title">{content.title}</div>
                          <div className="content-stats">
                            <span><Eye size={14} strokeWidth={1.5} /> {content.views.toLocaleString()}</span>
                            <span><Target size={14} strokeWidth={1.5} /> {content.engagement}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'publications' && (
              <div className="publications-tab-content">
                <PublicationCalendar companyId={selectedCompany.id} />
                <div style={{ marginTop: '32px' }}>
                  <GanttChartComponent companyId={selectedCompany.id} />
                </div>
              </div>
            )}
          </div>
        )}

      {/* Модальное окно добавления компании */}
      {showAddCompanyModal && (
        <div className="modal-overlay" onClick={() => setShowAddCompanyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Добавить компанию</h3>
              <button className="modal-close" onClick={() => setShowAddCompanyModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Название компании *</label>
                <input
                  type="text"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  className="form-input"
                  placeholder="Введите название"
                />
              </div>
              
              <div className="form-group">
                <label>Отрасль *</label>
                <select
                  value={newCompany.industry}
                  onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                  className="form-input"
                >
                  <option value="">Выберите отрасль</option>
                  <option value="Технологии">Технологии</option>
                  <option value="Ритейл">Ритейл</option>
                  <option value="Услуги">Услуги</option>
                  <option value="Финансы">Финансы</option>
                  <option value="Здравоохранение">Здравоохранение</option>
                  <option value="Образование">Образование</option>
                  <option value="Недвижимость">Недвижимость</option>
                  <option value="Производство">Производство</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Количество пользователей</label>
                <input
                  type="number"
                  value={newCompany.users}
                  onChange={(e) => setNewCompany({ ...newCompany, users: e.target.value })}
                  className="form-input"
                  placeholder="Введите количество"
                />
              </div>
              
              <div className="form-group">
                <label>Выручка (руб.)</label>
                <input
                  type="number"
                  value={newCompany.revenue}
                  onChange={(e) => setNewCompany({ ...newCompany, revenue: e.target.value })}
                  className="form-input"
                  placeholder="Введите выручку"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAddCompanyModal(false)}>
                Отмена
              </button>
              <button className="btn-primary" onClick={handleAddCompany}>
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies;

