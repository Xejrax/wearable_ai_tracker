import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// Import components
import Sidebar from './components/Sidebar';
import TitleBar from './components/TitleBar';
import NotificationCenter from './components/NotificationCenter';
import AppRoutes from './components/AppRoutes';

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings and notifications on app start
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        
        // Load settings
        const appSettings = await window.electronAPI.getSettings();
        setSettings(appSettings);
        setDarkMode(appSettings.darkMode);
        
        // Load notifications
        const notificationData = await window.electronAPI.getNotifications();
        setNotifications(notificationData || []);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Listen for new product notifications
  useEffect(() => {
    const unsubscribe = window.electronAPI.onNewProductFound((data) => {
      const newNotification = {
        id: `notification-${Date.now()}`,
        title: data.title || 'New Wearable AI Product Detected',
        message: data.message || `New information found on ${data.site}`,
        timestamp: data.timestamp || Date.now(),
        url: data.url || null,
        source: data.site || null,
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev]);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Update settings
  const updateSettings = async (newSettings) => {
    try {
      await window.electronAPI.updateSettings(newSettings);
      setSettings(newSettings);
      setDarkMode(newSettings.darkMode);
      return true;
    } catch (error) {
      console.error('Failed to update settings:', error);
      return false;
    }
  };

  // Mark notification as read
  const markNotificationAsRead = async (id) => {
    try {
      await window.electronAPI.markNotificationAsRead(id);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      await window.electronAPI.clearAllNotifications();
      setNotifications([]);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex h-screen items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className={`flex h-screen ${darkMode ? 'bg-tech-dark' : 'bg-gray-100'}`}>
        <Sidebar darkMode={darkMode} />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <TitleBar darkMode={darkMode} />
          
          <main className="flex-1 overflow-y-auto p-6">
            <AppRoutes 
              darkMode={darkMode} 
              settings={settings} 
              updateSettings={updateSettings} 
            />
          </main>
          
          <NotificationCenter 
            notifications={notifications}
            markAsRead={markNotificationAsRead}
            clearAll={clearAllNotifications}
            darkMode={darkMode}
          />
        </div>
      </div>
    </Router>
  );
};

export default App;
