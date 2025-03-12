import React, { useState } from 'react';
import { motion } from 'framer-motion';

const WebScraper = ({ darkMode }) => {
  const [url, setUrl] = useState('');
  const [scraping, setScraping] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [urlHistory, setUrlHistory] = useState([]);

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

  const handleScrape = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setScraping(true);
    setError(null);
    setResult(null);

    try {
      const data = await window.electronAPI.scrapeWebsite(url);
      setResult(data);
      
      // Add to URL history
      if (!urlHistory.includes(url)) {
        setUrlHistory(prev => {
          const newHistory = [url, ...prev];
          return newHistory.slice(0, 10); // Keep only last 10 URLs
        });
      }
    } catch (error) {
      console.error('Scraping error:', error);
      setError(error.message || 'Failed to scrape website');
    } finally {
      setScraping(false);
    }
  };

  const handleHistoryClick = (historyUrl) => {
    setUrl(historyUrl);
    // Don't auto-scrape to give user control
  };

  // Predefined wearable AI websites for quick scraping
  const suggestedSites = [
    { name: 'The Verge - Wearables', url: 'https://www.theverge.com/wearables' },
    { name: 'Wired - Wearables', url: 'https://www.wired.com/tag/wearables/' },
    { name: 'TechCrunch - Wearables', url: 'https://techcrunch.com/tag/wearables/' },
    { name: 'CNET - Wearable Tech', url: 'https://www.cnet.com/topics/wearable-tech/' }
  ];

  return (
    <motion.div
      className="h-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} glow-text`}>
          Web Scraper
        </h1>
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Manually scrape websites for wearable AI product information
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="dashboard-section mb-6">
        <form onSubmit={handleScrape} className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL to scrape (e.g., https://www.example.com)"
            className={`tech-input flex-1 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}
            required
          />
          <motion.button
            type="submit"
            className="tech-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={scraping}
          >
            {scraping ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                Scrape
              </span>
            )}
          </motion.button>
        </form>

        <div className="mt-6">
          <p className={`text-xs uppercase font-medium ${darkMode ? 'text-gray-500' : 'text-gray-500'} mb-2`}>
            Suggested Sites
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestedSites.map((site, index) => (
              <motion.button
                key={index}
                onClick={() => setUrl(site.url)}
                className={`p-2 rounded-lg text-left text-sm ${
                  darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
                } transition-colors`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{site.name}</div>
                <div className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{site.url}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {urlHistory.length > 0 && (
          <div className="mt-6">
            <p className={`text-xs uppercase font-medium ${darkMode ? 'text-gray-500' : 'text-gray-500'} mb-2`}>
              Recently Scraped
            </p>
            <div className="flex flex-wrap gap-2">
              {urlHistory.map((historyUrl, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleHistoryClick(historyUrl)}
                  className={`px-3 py-1 rounded-full text-xs ${
                    darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } truncate max-w-xs`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={historyUrl}
                >
                  {new URL(historyUrl).hostname}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {error && (
        <motion.div
          variants={itemVariants}
          className="dashboard-section border border-red-500 mb-6"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className={`text-lg font-medium ${darkMode ? 'text-red-400' : 'text-red-800'}`}>Scraping Error</h3>
              <div className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <motion.button
                  onClick={() => setError(null)}
                  className={`text-sm px-3 py-1 rounded-md ${
                    darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Dismiss
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {result && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={itemVariants} className="dashboard-section">
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Scraping Results
              </h2>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {new Date().toLocaleString()}
              </span>
            </div>

            <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <div>
                <p className="text-xs uppercase font-medium text-gray-500 mb-1">Title</p>
                <p className="font-medium">{result.title || 'No title found'}</p>
              </div>

              <div>
                <p className="text-xs uppercase font-medium text-gray-500 mb-1">Description</p>
                <p>{result.description || 'No description found'}</p>
              </div>

              {result.headings && result.headings.length > 0 && (
                <div>
                  <p className="text-xs uppercase font-medium text-gray-500 mb-1">Headings</p>
                  <ul className="space-y-1 pl-5 list-disc">
                    {result.headings.map((heading, index) => (
                      <li key={index}>{heading}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <p className="text-xs uppercase font-medium text-gray-500 mb-1">URL</p>
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
                >
                  {result.url}
                </a>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700 flex justify-end">
              <motion.button
                onClick={() => setResult(null)}
                className={`text-sm px-3 py-1 rounded-md mr-2 ${
                  darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Dismiss
              </motion.button>
              <motion.button
                onClick={() => {
                  setUrl('');
                  setResult(null);
                }}
                className="tech-button text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Scrape Another
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {!result && !error && !scraping && (
        <motion.div 
          variants={itemVariants} 
          className="dashboard-section"
        >
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            How Web Scraping Works
          </h2>
          <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <p>
              The web scraper automatically extracts information about wearable AI products from websites. 
              Here's what happens when you scrape a site:
            </p>
            <ol className="space-y-2 list-decimal pl-5">
              <li>The scraper visits the URL you provide</li>
              <li>It extracts the page title, description, and key headings</li>
              <li>The information is stored in the product database</li>
              <li>You can view all discovered products in the Products section</li>
            </ol>
            <p className="text-sm italic mt-4">
              Note: The application also performs automated background scraping of popular wearable tech websites 
              to keep your database updated with the latest products.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WebScraper;
