import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Message from './Message';
import LoadingSpinner from './LoadingSpinner';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Привет! Я AI-ассистент для анализа вашего контента. Могу показать статистику, популярные посты, анализ комментариев и дать рекомендации!',
      isUser: false
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const exampleQuestions = [
    "Какие посты были самыми популярными на прошлой неделе?",
    "Покажи статистику за последний месяц",
    "Какие темы чаще всего обсуждают в комментариях?",
    "Какое лучшее время для публикации?",
    "Почему некоторые посты получают мало лайков?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text = inputMessage) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: text,
      isUser: true
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/bot/message', {
        message: text
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.response.text,
        isUser: false
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Извините, произошла ошибка. Пожалуйста, попробуйте еще раз.',
        isUser: false
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleExampleClick = (question) => {
    sendMessage(question);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>AI Ассистент контента</h1>
        <div className="status-indicator">
          <div className="status-dot"></div>
          <span>Подключено к бэкенду</span>
        </div>
      </div>

      <div className="messages-container">
        {messages.map(message => (
          <Message
            key={message.id}
            message={message.text}
            isUser={message.isUser}
          />
        ))}
        {isLoading && <LoadingSpinner />}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Задайте вопрос о вашем контенте..."
            className="message-input"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="send-button"
            disabled={isLoading || !inputMessage.trim()}
          >
            Отправить
          </button>
        </form>

        <div className="examples-grid">
          {exampleQuestions.map((question, index) => (
            <button
              key={index}
              className="example-button"
              onClick={() => handleExampleClick(question)}
              disabled={isLoading}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBot;