import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import pages
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import Search from '../pages/Search';
import WebScraper from '../pages/WebScraper';
import DataVisualization from '../pages/DataVisualization';
import Settings from '../pages/Settings';
import NotificationSettings from '../pages/NotificationSettings';

const AppRoutes = ({ darkMode, settings, updateSettings }) => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard darkMode={darkMode} />} />
      <Route path="/products" element={<Products darkMode={darkMode} />} />
      <Route path="/search" element={<Search darkMode={darkMode} />} />
      <Route path="/web-scraper" element={<WebScraper darkMode={darkMode} />} />
      <Route path="/data-visualization" element={<DataVisualization darkMode={darkMode} />} />
      <Route 
        path="/settings" 
        element={
          <Settings 
            darkMode={darkMode} 
            settings={settings} 
            updateSettings={updateSettings} 
          />
        } 
      />
      <Route 
        path="/notification-settings" 
        element={
          <NotificationSettings 
            darkMode={darkMode} 
            settings={settings} 
            updateSettings={updateSettings} 
          />
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
