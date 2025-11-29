import React from 'react';
import ContentTable from '../components/ContentTable';

const Content = () => {
  return (
    <div className="content-page">
      <div className="page-header">
        <div>
          <h1>Управление контентом</h1>
          <p>Все ваши публикации в одном месте</p>
        </div>
      </div>
      <ContentTable />
    </div>
  );
};

export default Content;