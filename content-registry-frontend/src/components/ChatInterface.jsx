import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User } from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Привет! Я AI-ассистент для анализа вашего контента. Могу показать статистику, популярные посты, анализ комментариев и дать рекомендации!',
      isUser: false,
      timestamp: new Date()
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
    "Почему некоторые посты получают мало лайков?",
    "Сравни эффективность видео и постов"
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
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/bot/message', {
        message: text
      }, {
        timeout: 30000
      });

      console.log('AI Response:', response.data);

      let responseText = 'Ответ получен';
      
      if (response.data?.success && response.data?.response?.text) {
        responseText = response.data.response.text;
      } else if (response.data?.response) {
        responseText = typeof response.data.response === 'string' 
          ? response.data.response 
          : response.data.response.text || 'Ответ получен';
      } else if (response.data?.text) {
        responseText = response.data.text;
      }

      const botMessage = {
        id: Date.now() + 1,
        text: responseText,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Показываем более информативное сообщение об ошибке
      let errorText = 'Извините, произошла ошибка при отправке сообщения.';
      
      if (error.response?.data?.error) {
        errorText = `Ошибка: ${error.response.data.error}`;
      } else if (error.message) {
        errorText = `Ошибка подключения: ${error.message}`;
      }
      
      errorText += '\n\nПопробуйте:\n• Проверить подключение к интернету\n• Обновить страницу\n• Задать вопрос еще раз';
      
      const errorMessage = {
        id: Date.now() + 1,
        text: errorText,
        isUser: false,
        timestamp: new Date()
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

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMessage = (text) => {
    // Простой парсинг для выделения чисел и метрик
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      if (line.trim() === '') return <br key={index} />;
      
      // Проверяем, является ли строка заголовком (содержит **)
      if (line.includes('**')) {
        const cleanLine = line.replace(/\*\*/g, '');
        return (
          <div key={index} className="message-heading">
            {cleanLine}
          </div>
        );
      }
      
      // Проверяем, является ли строка списком
      if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
        return (
          <div key={index} className="message-list-item">
            {line}
          </div>
        );
      }
      
      // Обычный текст с подсветкой чисел
      return (
        <div key={index}>
          {line.split(/(\d+)/).map((part, i) => 
            /^\d+$/.test(part) ? (
              <span key={i} className="highlight-number">{part}</span>
            ) : (
              part
            )
          )}
        </div>
      );
    });
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="chat-status">
          <div className="status-indicator">
            <div className="status-dot connected"></div>
            <span>Подключено к AI</span>
          </div>
        </div>
      </div>

      <div className="messages-container">
        {messages.map(message => (
          <div key={message.id} className={`message ${message.isUser ? 'user' : 'bot'}`}>
            <div className="message-avatar">
              {message.isUser ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className="message-content">
              <div className="message-bubble">
                {formatMessage(message.text)}
              </div>
              <div className="message-time">
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message bot">
            <div className="message-avatar">
              <Bot size={20} />
            </div>
            <div className="message-content">
              <div className="message-bubble loading">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="examples-section">
        <h4>Примеры вопросов:</h4>
        <div className="examples-grid">
          {exampleQuestions.map((question, index) => (
            <button
              key={index}
              className="example-question"
              onClick={() => handleExampleClick(question)}
              disabled={isLoading}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <div className="input-section">
        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-container">
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
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;