import React, { useState, useEffect } from 'react';
import PublicationCalendar from '../components/PublicationCalendar';
import ContentTable from '../components/ContentTable';
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
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { mwsAPI } from '../services/api';
import { BarChart3, TrendingUp, PieChart as PieChartIcon, Calendar, Table } from 'lucide-react';

const Content = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' или 'table'

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await mwsAPI.getAnalytics();
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Генерация данных для графиков
  const generateChartData = () => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
        views: Math.floor(Math.random() * 5000) + 2000,
        likes: Math.floor(Math.random() * 500) + 200,
        comments: Math.floor(Math.random() * 100) + 50
      });
    }
    return data;
  };

  const chartData = generateChartData();

  // Распределение по типам
  const typeDistribution = analytics ? Object.entries(analytics.typeStats).map(([type, stats]) => ({
    name: type === 'video' ? 'Видео' : type === 'post' ? 'Посты' : 'Изображения',
    value: stats.count,
    color: type === 'video' ? '#dc2626' : type === 'post' ? '#991b1b' : '#9ca3af'
  })) : [];

  // Данные по дням недели
  const dayOfWeekData = [
    { day: 'Пн', views: 4500, likes: 320 },
    { day: 'Вт', views: 5200, likes: 380 },
    { day: 'Ср', views: 4800, likes: 350 },
    { day: 'Чт', views: 6100, likes: 450 },
    { day: 'Пт', views: 5800, likes: 420 },
    { day: 'Сб', views: 4200, likes: 300 },
    { day: 'Вс', views: 3800, likes: 280 }
  ];

  return (
    <div className="content-page">
      <div className="page-header">
        <div>
          <h1>Мои публикации</h1>
          <p>Управление и планирование вашего контента</p>
        </div>
        <div className="view-mode-selector">
          <button 
            className={`view-mode-btn ${viewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => setViewMode('calendar')}
          >
            <Calendar size={18} strokeWidth={1.5} />
            <span>Календарь</span>
          </button>
          <button 
            className={`view-mode-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            <Table size={18} strokeWidth={1.5} />
            <span>Таблица</span>
          </button>
        </div>
      </div>
      
      {/* Календарь или Таблица */}
      {viewMode === 'calendar' ? (
        <div style={{ marginBottom: '32px' }}>
          <PublicationCalendar companyId="personal" />
        </div>
      ) : (
        <div style={{ marginBottom: '32px' }}>
          <ContentTable />
        </div>
      )}

      {/* Графики */}
      <div className="content-charts-grid">
        <div className="chart-card-modern">
          <div className="chart-header">
            <div>
              <BarChart3 size={20} strokeWidth={1.5} style={{ marginRight: '8px' }} />
              <h3>Динамика публикаций</h3>
              <p>Просмотры, лайки и комментарии за последние 30 дней</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorViewsContent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLikesContent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#991b1b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#991b1b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Area type="monotone" dataKey="views" stroke="#dc2626" fillOpacity={1} fill="url(#colorViewsContent)" name="Просмотры" />
              <Area type="monotone" dataKey="likes" stroke="#991b1b" fillOpacity={1} fill="url(#colorLikesContent)" name="Лайки" />
              <Line type="monotone" dataKey="comments" stroke="#9ca3af" strokeWidth={2} name="Комментарии" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card-modern">
          <div className="chart-header">
            <div>
              <PieChartIcon size={20} strokeWidth={1.5} style={{ marginRight: '8px' }} />
              <h3>Типы контента</h3>
              <p>Распределение по форматам</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={typeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {typeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card-modern">
        <div className="chart-header">
          <div>
            <TrendingUp size={20} strokeWidth={1.5} style={{ marginRight: '8px' }} />
            <h3>Активность по дням недели</h3>
            <p>Средние показатели по дням</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dayOfWeekData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            <Bar dataKey="views" fill="#dc2626" name="Просмотры" />
            <Bar dataKey="likes" fill="#991b1b" name="Лайки" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Content;
