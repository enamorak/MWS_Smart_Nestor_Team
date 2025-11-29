import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import ChatBot from './pages/ChatBot';
import Analytics from './pages/Analytics';
import Content from './pages/Content';
import './styles/index.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Router>
      <div className={`app ${darkMode ? 'dark' : ''}`}>
        <Navigation darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/content" element={<Content />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/chat" element={<ChatBot />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;