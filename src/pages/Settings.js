import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Settings = ({ settings, updateSettings, darkMode }) => {
  const [formData, setFormData] = useState({
    autoScrapeInterval: 24,
    notificationsEnabled: true,
    darkMode: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateSettings(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
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
          Settings
        </h1>
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Configure your wearable AI tracker application preferences
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="dashboard-section">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Scraping Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Auto-Scrape Interval (hours)
                  </label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      name="autoScrapeInterval"
                      min="0"
                      max="72"
                      step="1"
                      value={formData.autoScrapeInterval}
                      onChange={handleChange}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className={`ml-3 w-12 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {formData.autoScrapeInterval === 0 ? 'Off' : `${formData.autoScrapeInterval}h`}
                    </span>
                  </div>
                  <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formData.autoScrapeInterval === 0 
                      ? 'Automatic background scraping is disabled' 
                      : `The application will automatically scrape websites every ${formData.autoScrapeInterval} hours`}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Notification Settings
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
                    Enable notifications for new wearable AI products
                  </label>
                </div>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  When enabled, you'll receive notifications when new wearable AI products are discovered during background scraping
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Appearance
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="darkMode"
                    name="darkMode"
                    checked={formData.darkMode}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                  />
                  <label htmlFor="darkMode" className={`ml-2 block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Dark Mode
                  </label>
                </div>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Toggle between dark and light theme for the application
                </p>
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
                  <p>Settings saved successfully!</p>
                </div>
              </motion.div>
            )}
          </div>
        </form>
      </motion.div>

      <motion.div variants={itemVariants} className="dashboard-section mt-6">
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          About Wearable AI Tracker
        </h2>
        <div className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <p>Version: 1.0.0</p>
          <p>This application helps you track and discover the latest wearable AI technologies.</p>
          <p className="text-sm mt-4">
            Features include:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Interactive dashboard with wearable AI market insights</li>
            <li>Automated web scraping to discover new products</li>
            <li>Search functionality for finding specific wearable AI technologies</li>
            <li>Product database with filtering and sorting capabilities</li>
            <li>Notification system for updates on new discoveries</li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Settings;
