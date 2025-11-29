import React from 'react';

const Message = ({ message, isUser }) => {
  const formatMessage = (text) => {
    // Простой парсинг для выделения чисел и метрик
    return text.split('\n').map((line, index) => (
      <div key={index}>
        {line.split(/(\d+)/).map((part, i) => 
          /^\d+$/.test(part) ? (
            <span key={i} style={{color: '#4f46e5', fontWeight: 'bold'}}>{part}</span>
          ) : (
            part
          )
        )}
      </div>
    ));
  };

  return (
    <div className={`message ${isUser ? 'user' : 'bot'}`}>
      <div className="message-bubble">
        {formatMessage(message)}
      </div>
    </div>
  );
};

export default Message;