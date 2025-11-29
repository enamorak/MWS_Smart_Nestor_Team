import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/index.css';

// Простой компонент для отладки
const DebugApp = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    console.log('✅ App component mounted');
    console.log('✅ React Router is working');
  }, []);

  return (
    <Router>
      <div style={{ 
        minHeight: '100vh', 
        background: darkMode ? '#1f2937' : '#f8fafc',
        color: darkMode ? 'white' : 'black'
      }}>
        {/* Простая навигация */}
        <nav style={{
          background: darkMode ? '#374151' : 'white',
          padding: '20px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="/" style={{ 
              textDecoration: 'none', 
              color: darkMode ? '#60a5fa' : '#4f46e5', 
              fontWeight: 'bold',
              fontSize: '18px'
            }}>📊 Content Registry</a>
            <a href="/" style={{ textDecoration: 'none', color: darkMode ? '#d1d5db' : '#6b7280' }}>Дашборд</a>
            <a href="/content" style={{ textDecoration: 'none', color: darkMode ? '#d1d5db' : '#6b7280' }}>Контент</a>
            <a href="/analytics" style={{ textDecoration: 'none', color: darkMode ? '#d1d5db' : '#6b7280' }}>Аналитика</a>
            <a href="/chat" style={{ textDecoration: 'none', color: darkMode ? '#d1d5db' : '#6b7280' }}>AI Ассистент</a>
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            style={{
              background: 'none',
              border: '1px solid #d1d5db',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              color: darkMode ? 'white' : 'black'
            }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </nav>

        {/* Основной контент */}
        <main style={{ padding: '40px' }}>
          <Routes>
            <Route path="/" element={
              <div>
                <h1>🚀 Content Registry Dashboard</h1>
                <p>Система успешно запущена! {new Date().toLocaleTimeString()}</p>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '20px', 
                  marginTop: '30px' 
                }}>
                  <div style={{ 
                    background: darkMode ? '#374151' : 'white', 
                    padding: '20px', 
                    borderRadius: '12px', 
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h3>Всего материалов</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4f46e5' }}>156</p>
                  </div>
                  <div style={{ 
                    background: darkMode ? '#374151' : 'white', 
                    padding: '20px', 
                    borderRadius: '12px', 
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h3>Общий охват</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>125K</p>
                  </div>
                  <div style={{ 
                    background: darkMode ? '#374151' : 'white', 
                    padding: '20px', 
                    borderRadius: '12px', 
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h3>Вовлеченность</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>4.2%</p>
                  </div>
                </div>

                <div style={{ marginTop: '30px' }}>
                  <h3>Быстрые ссылки:</h3>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <a href="/content" style={{ 
                      textDecoration: 'none', 
                      background: '#4f46e5', 
                      color: 'white', 
                      padding: '10px 16px', 
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}>Управление контентом</a>
                    <a href="/chat" style={{ 
                      textDecoration: 'none', 
                      background: '#10b981', 
                      color: 'white', 
                      padding: '10px 16px', 
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}>AI Ассистент</a>
                    <a href="/analytics" style={{ 
                      textDecoration: 'none', 
                      background: '#f59e0b', 
                      color: 'white', 
                      padding: '10px 16px', 
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}>Аналитика</a>
                  </div>
                </div>
              </div>
            } />
            
            <Route path="/content" element={
              <div>
                <h1>📝 Управление контентом</h1>
                <p>Здесь будет таблица с вашими материалами</p>
                <a href="/" style={{ color: '#4f46e5' }}>← Назад к дашборду</a>
              </div>
            } />
            
            <Route path="/analytics" element={
              <div>
                <h1>📊 Аналитика</h1>
                <p>Здесь будут графики и аналитика</p>
                <a href="/" style={{ color: '#4f46e5' }}>← Назад к дашборду</a>
              </div>
            } />
            
            <Route path="/chat" element={
              <div>
                <h1>🤖 AI Ассистент</h1>
                <p>Здесь будет чат с AI ассистентом</p>
                <a href="/" style={{ color: '#4f46e5' }}>← Назад к дашборду</a>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default DebugApp;