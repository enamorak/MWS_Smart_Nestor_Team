import React from 'react';

const LoadingSpinner = () => (
  <div className="message bot">
    <div className="message-bubble loading">
      <div className="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
);

export default LoadingSpinner;