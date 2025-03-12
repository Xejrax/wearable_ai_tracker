import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const NotificationSettings = ({ darkMode, settings, updateSettings }) => {
  const [formData, setFormData] = useState({
    notificationsEnabled: true,
    notificationSound: true,
    notificationDesktop: true,
    notificationFrequency: 'immediate',
    notificationTypes: {
      newProducts: true,
      productUpdates: true,
      trendingTopics: true,
      industryNews: false
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (settings && settings.notifications) {
      setFormData(settings.notifications);
    }
  }, [settings]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  const handleChange = (e) => {
    const { name, checked, value, type } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (e.g., notificationTypes.newProducts)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // Update settings with notification preferences
      const updatedSettings = {
        ...settings,
        notifications: formData
      };
      
      await updateSettings(updatedSettings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save notification settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      className="h-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} glow-text`}>
          Notification Settings
        </h1>
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Configure how you want to be notified about new wearable AI discoveries
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="dashboard-section">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                General Notification Settings
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notificationsEnabled"
                    name="notificationsEnabled"
                    checked={formData.notificationsEnabled}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                  />
                  <label htmlFor="notificationsEnabled" className={`ml-2 block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Enable notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notificationSound"
                    name="notificationSound"
                    checked={formData.notificationSound}
                    onChange={handleChange}
                    disabled={!formData.notificationsEnabled}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded disabled:opacity-50"
                  />
                  <label htmlFor="notificationSound" className={`ml-2 block text-sm ${
                    formData.notificationsEnabled 
                      ? darkMode ? 'text-gray-300' : 'text-gray-700' 
                      : darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Play sound for new notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notificationDesktop"
                    name="notificationDesktop"
                    checked={formData.notificationDesktop}
                    onChange={handleChange}
                    disabled={!formData.notificationsEnabled}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded disabled:opacity-50"
                  />
                  <label htmlFor="notificationDesktop" className={`ml-2 block text-sm ${
                    formData.notificationsEnabled 
                      ? darkMode ? 'text-gray-300' : 'text-gray-700' 
                      : darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Show desktop notifications
                  </label>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${
                    formData.notificationsEnabled 
                      ? darkMode ? 'text-gray-300' : 'text-gray-700' 
                      : darkMode ? 'text-gray-500' : 'text-gray-400'
                  } mb-1`}>
                    Notification Frequency
                  </label>
                  <select
                    name="notificationFrequency"
                    value={formData.notificationFrequency}
                    onChange={handleChange}
                    disabled={!formData.notificationsEnabled}
                    className={`block w-full rounded-md shadow-sm ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-gray-300' 
                        : 'bg-white border-gray-300 text-gray-700'
                    } disabled:opacity-50 py-2 px-3`}
                  >
                    <option value="immediate">Immediate - Notify as soon as discovered</option>
                    <option value="hourly">Hourly - Group notifications hourly</option>
                    <option value="daily">Daily - Send a daily summary</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Notification Types
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notificationTypes.newProducts"
                    name="notificationTypes.newProducts"
                    checked={formData.notificationTypes?.newProducts}
                    onChange={handleChange}
                    disabled={!formData.notificationsEnabled}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded disabled:opacity-50"
                  />
                  <label htmlFor="notificationTypes.newProducts" className={`ml-2 block text-sm ${
                    formData.notificationsEnabled 
                      ? darkMode ? 'text-gray-300' : 'text-gray-700' 
                      : darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    New wearable AI products discovered
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notificationTypes.productUpdates"
                    name="notificationTypes.productUpdates"
                    checked={formData.notificationTypes?.productUpdates}
                    onChange={handleChange}
                    disabled={!formData.notificationsEnabled}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded disabled:opacity-50"
                  />
                  <label htmlFor="notificationTypes.productUpdates" className={`ml-2 block text-sm ${
                    formData.notificationsEnabled 
                      ? darkMode ? 'text-gray-300' : 'text-gray-700' 
                      : darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Updates to existing products
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notificationTypes.trendingTopics"
                    name="notificationTypes.trendingTopics"
                    checked={formData.notificationTypes?.trendingTopics}
                    onChange={handleChange}
                    disabled={!formData.notificationsEnabled}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded disabled:opacity-50"
                  />
                  <label htmlFor="notificationTypes.trendingTopics" className={`ml-2 block text-sm ${
                    formData.notificationsEnabled 
                      ? darkMode ? 'text-gray-300' : 'text-gray-700' 
                      : darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Trending wearable AI topics
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notificationTypes.industryNews"
                    name="notificationTypes.industryNews"
                    checked={formData.notificationTypes?.industryNews}
                    onChange={handleChange}
                    disabled={!formData.notificationsEnabled}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded disabled:opacity-50"
                  />
                  <label htmlFor="notificationTypes.industryNews" className={`ml-2 block text-sm ${
                    formData.notificationsEnabled 
                      ? darkMode ? 'text-gray-300' : 'text-gray-700' 
                      : darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Industry news and announcements
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-700 flex justify-end">
              <motion.button
                type="submit"
                className="tech-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSaving}
              >
                {isSaving ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Save Settings
                  </span>
                )}
              </motion.button>
            </div>

            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-4 p-3 rounded-md ${darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}
              >
                <div className="flex">
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p>Notification settings saved successfully!</p>
                </div>
              </motion.div>
            )}
          </div>
        </form>
      </motion.div>

      <motion.div variants={itemVariants} className="dashboard-section mt-6">
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          About Notifications
        </h2>
        <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <p>
            The Wearable AI Tracker application uses an advanced notification system to keep you informed about the latest developments in wearable AI technology.
          </p>
          <p>
            Our automated web scraping system continuously monitors popular technology websites and specific product pages to discover new wearable AI products and updates to existing ones.
          </p>
          <p className="text-sm mt-4">
            Key features of the notification system:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Real-time alerts for new wearable AI product discoveries</li>
            <li>Customizable notification preferences</li>
            <li>Desktop notifications when the app is running in the background</li>
            <li>Notification history for tracking past discoveries</li>
            <li>Sound alerts for important updates</li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NotificationSettings;
