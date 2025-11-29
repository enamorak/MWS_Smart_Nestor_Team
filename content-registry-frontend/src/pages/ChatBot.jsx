import React from 'react';
import ChatInterface from '../components/ChatInterface';

const ChatBot = () => {
  return (
    <div className="chat-page">
      <div className="page-header">
        <h1>AI Ассистент контента</h1>
        <p>Задавайте вопросы о вашем контенте на естественном языке</p>
      </div>
      <ChatInterface />
    </div>
  );
};

export default ChatBot;