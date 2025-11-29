import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  MessageCircle, 
  PieChart, 
  FileText, 
  Moon, 
  Sun 
} from 'lucide-react';

const Navigation = ({ darkMode, setDarkMode }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: BarChart3, label: 'Дашборд' },
    { path: '/networks', icon: BarChart3, label: 'Все сети' },
    { path: '/content', icon: FileText, label: 'Контент' },
    { path: '/analytics', icon: PieChart, label: 'Аналитика' },
    { path: '/chat', icon: MessageCircle, label: 'AI Ассистент' }
  ];

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <div className="logo">📊</div>
        <h1>Content Registry</h1>
      </div>
      
      <div className="nav-links">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="nav-actions">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="theme-toggle"
          title={darkMode ? 'Светлая тема' : 'Темная тема'}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default Navigation;