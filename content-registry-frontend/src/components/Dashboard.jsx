import React from 'react';

const Dashboard = () => {
  return (
    <div style={{ padding: '20px', background: '#f8fafc', minHeight: '100vh' }}>
      <h1>Дашборд контента</h1>
      <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Всего материалов</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4f46e5' }}>156</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Средняя вовлеченность</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>4.2%</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Общий охват</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>125K</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;