import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import ChatBot from './pages/ChatBot';
import Analytics from './pages/Analytics';
import Content from './pages/Content';
import SocialNetworks from './pages/SocialNetworks';
import NotificationsPage from './pages/NotificationsPage';
import Companies from './pages/Companies';
import './styles/index.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Сохраняем предпочтение темы в localStorage
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  return (
    <Router>
      <div className={`app ${darkMode ? 'dark' : ''}`}>
        <Navigation darkMode={darkMode} setDarkMode={toggleDarkMode} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/content" element={<Content />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/networks" element={<SocialNetworks />} />
            <Route path="/chat" element={<ChatBot />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/companies" element={<Companies />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;