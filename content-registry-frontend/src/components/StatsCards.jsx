import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const StatsCards = ({ stats }) => {
  return (
    <div className="stats-grid">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <div key={index} className={`stat-card stat-${stat.color}`}>
            <div className="stat-header">
              <div className="stat-icon">
                <Icon size={24} />
              </div>
              <div className={`stat-trend ${stat.trend}`}>
                {stat.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                {stat.change}
              </div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-title">{stat.title}</div>
            <div className="stat-description">{stat.description}</div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;