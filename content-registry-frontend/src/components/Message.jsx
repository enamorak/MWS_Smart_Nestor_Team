import React from 'react';

const Message = ({ message, isUser }) => {
  const formatMessage = (text) => {
    if (!text) return null;

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
    <div className={`message ${isUser ? 'user' : 'bot'}`}>
      <div className="message-bubble">
        {formatMessage(message)}
      </div>
    </div>
  );
};

export default Message;