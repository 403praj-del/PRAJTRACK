import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Capture from './components/Capture';
import Settings from './components/Settings';

function App() {
  const [currentTab, setCurrentTab] = useState('home');

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return <Dashboard onCapture={() => setCurrentTab('capture')} />;
      case 'capture':
        return <Capture onCancel={() => setCurrentTab('home')} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onCapture={() => setCurrentTab('capture')} />;
    }
  };

  return (
    <Layout currentTab={currentTab} onTabChange={setCurrentTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;
