import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Search = ({ darkMode }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('web');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Load search history when component mounts
    const loadSearchHistory = async () => {
      try {
        const history = await window.electronAPI.getSearchHistory();
        setSearchHistory(history || []);
      } catch (error) {
        console.error('Failed to load search history:', error);
      }
    };

    loadSearchHistory();
  }, []);

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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResults(null);
    
    try {
      const data = await window.electronAPI.performSearch(query);
      setResults(data);
      
      // Update local search history state
      if (searchHistory.findIndex(item => item.query === query) === -1) {
        setSearchHistory(prev => {
          const newHistory = [{ query, timestamp: Date.now() }, ...prev];
          return newHistory.slice(0, 10); // Keep only last 10 searches
        });
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (historyQuery) => {
    setQuery(historyQuery);
    // Don't auto-search to give user control
  };

  const handleClearHistory = async () => {
    try {
      await window.electronAPI.clearSearchHistory();
      setSearchHistory([]);
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }
  };

  const handleScrapeWebsite = async (url) => {
    try {
      const result = await window.electronAPI.scrapeWebsite(url);
      // Show notification of successful scrape
      if (result && !result.error) {
        // Refresh results to show the newly added product
        handleSearch({ preventDefault: () => {} });
      }
    } catch (error) {
      console.error('Failed to scrape website:', error);
    }
  };

  const handleAddToDatabase = async (webResult) => {
    try {
      // Create a product object from the web result
      const product = {
        title: webResult.title,
        description: webResult.snippet,
        url: webResult.url,
        source: webResult.source,
        timestamp: Date.now(),
        lastUpdated: Date.now()
      };
      
      await window.electronAPI.addProduct(product);
      // Show notification of successful addition
    } catch (error) {
      console.error('Failed to add product to database:', error);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
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
          Wearable AI Search
        </h1>
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Search for the latest wearable AI technologies and developments
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="dashboard-section mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for wearable AI products, companies, or technologies..."
            className={`tech-input flex-1 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}
          />
          <motion.button
            type="submit"
            className="tech-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                Search
              </span>
            )}
          </motion.button>
        </form>

        <div className="flex justify-between items-center mt-4">
          {searchHistory.length > 0 && (
            <div>
              <p className={`text-xs uppercase font-medium ${darkMode ? 'text-gray-500' : 'text-gray-500'} mb-2`}>
                Recent Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((item, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleHistoryClick(item.query)}
                    className={`px-3 py-1 rounded-full text-xs ${
                      darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.query}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {searchHistory.length > 0 && (
            <motion.button
              onClick={handleClearHistory}
              className={`text-xs ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear History
            </motion.button>
          )}
        </div>
      </motion.div>

      {results && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={itemVariants} className="flex space-x-2 mb-4">
            <button
              onClick={() => setActiveTab('web')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'web'
                  ? darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : darkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Web Results ({results.webResults?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('local')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'local'
                  ? darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : darkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Database Results ({results.localResults?.length || 0})
            </button>
          </motion.div>

          {activeTab === 'web' && (
            <motion.div variants={itemVariants} className="dashboard-section">
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Web Search Results for "{results.query}"
                </h2>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {results.webResults?.length || 0} results found
                </span>
              </div>

              {results.webResults?.length > 0 ? (
                <div className="space-y-4">
                  {results.webResults.map((result, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className={`p-4 rounded-lg ${
                        darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                      } transition-colors border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {result.title}
                        </h3>
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {result.date}
                        </span>
                      </div>
                      
                      <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {result.snippet}
                      </p>
                      
                      <div className="mt-3 flex justify-between items-center">
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          Source: {result.source}
                        </span>
                        
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`text-xs px-3 py-1 rounded-full ${
                              darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            onClick={() => handleScrapeWebsite(result.url)}
                          >
                            Scrape
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`text-xs px-3 py-1 rounded-full ${
                              darkMode ? 'bg-purple-600 text-white hover:bg-purple-500' : 'bg-purple-500 text-white hover:bg-purple-400'
                            }`}
                            onClick={() => handleAddToDatabase(result)}
                          >
                            Add to Database
                          </motion.button>
                          
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-xs px-3 py-1 rounded-full ${
                              darkMode ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-500 text-white hover:bg-blue-400'
                            }`}
                          >
                            Visit
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No web results found for "{results.query}"</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'local' && (
            <motion.div variants={itemVariants} className="dashboard-section">
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Database Results for "{results.query}"
                </h2>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {results.localResults?.length || 0} results found
                </span>
              </div>

              {results.localResults?.length > 0 ? (
                <div className="space-y-4">
                  {results.localResults.map((product) => (
                    <motion.div
                      key={product.id}
                      variants={itemVariants}
                      className={`p-4 rounded-lg ${
                        darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                      } transition-colors border ${darkMode ? 'border-gray-700' : 'border-gray-200'} cursor-pointer`}
                      onClick={() => handleProductSelect(product)}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {product.title}
                        </h3>
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {new Date(product.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {product.description}
                      </p>
                      
                      <div className="mt-3 flex flex-wrap gap-2">
                        {product.bodyPlacement && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {product.bodyPlacement}
                          </span>
                        )}
                        
                        {product.isAlwaysOn && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                          }`}>
                            Always-On
                          </span>
                        )}
                        
                        {product.pricingModel && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {product.pricingModel}
                          </span>
                        )}
                      </div>
                      
                      {product.features && product.features.length > 0 && (
                        <div className="mt-3">
                          <p className={`text-xs uppercase font-medium ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Features
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {product.features.slice(0, 3).map((feature, index) => (
                              <span key={index} className={`text-xs px-2 py-0.5 rounded-full ${
                                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                              }`}>
                                {feature}
                              </span>
                            ))}
                            {product.features.length > 3 && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                              }`}>
                                +{product.features.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No matching products found in database for "{results.query}"</p>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      )}

      {selectedProduct && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedProduct(null)}
        >
          <motion.div
            className={`w-full max-w-2xl rounded-lg ${darkMode ? 'bg-gray-900' : 'bg-white'} p-6 max-h-[90vh] overflow-y-auto`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedProduct.title}
              </h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className={`text-xs uppercase font-medium ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Description</p>
                <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{selectedProduct.description || 'No description available'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-xs uppercase font-medium ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Body Placement</p>
                  <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{selectedProduct.bodyPlacement || 'Unknown'}</p>
                </div>
                
                <div>
                  <p className={`text-xs uppercase font-medium ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Price</p>
                  <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{selectedProduct.price || 'Unknown'}</p>
                </div>
                
                <div>
                  <p className={`text-xs uppercase font-medium ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Pricing Model</p>
                  <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{selectedProduct.pricingModel || 'Unknown'}</p>
                </div>
                
                <div>
                  <p className={`text-xs uppercase font-medium ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Always-On</p>
                  <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{selectedProduct.isAlwaysOn ? 'Yes' : 'No'}</p>
                </div>
              </div>
              
              {selectedProduct.features && selectedProduct.features.length > 0 && (
                <div>
                  <p className={`text-xs uppercase font-medium ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Features</p>
                  <ul className={`mt-1 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'} list-disc pl-5`}>
                    {selectedProduct.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedProduct.sensoryInputs && selectedProduct.sensoryInputs.length > 0 && (
                <div>
                  <p className={`text-xs uppercase font-medium ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Sensory Inputs</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedProduct.sensoryInputs.map((input, index) => (
                      <span key={index} className={`text-xs px-2 py-1 rounded-full ${
                        darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {input}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <p className={`text-xs uppercase font-medium ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Source</p>
                <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{selectedProduct.source || 'Unknown'}</p>
              </div>
              
              {selectedProduct.url && (
                <div>
                  <p className={`text-xs uppercase font-medium ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>URL</p>
                  <a 
                    href={selectedProduct.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`mt-1 block truncate ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
                  >
                    {selectedProduct.url}
                  </a>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-700 flex justify-end space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1 rounded-md ${
                    darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => setSelectedProduct(null)}
                >
                  Close
                </motion.button>
                
                {selectedProduct.url && (
                  <motion.a
                    href={selectedProduct.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-1 rounded-md ${
                      darkMode ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-500 text-white hover:bg-blue-400'
                    }`}
                  >
                    Visit Website
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {!results && !loading && (
        <motion.div 
          variants={itemVariants} 
          className={`dashboard-section flex flex-col items-center justify-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg mb-2">Search for wearable AI technologies</p>
          <p className="text-sm max-w-md text-center">
            Enter keywords like "smart glasses", "AI wearable", "neural interface" to discover the latest products and developments.
          </p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-2">
            {['smart glasses', 'AI wearable', 'neural interface', 'health monitor', 'always-on', 'AR glasses', 'smart ring', 'AI pin'].map((suggestion) => (
              <motion.button
                key={suggestion}
                onClick={() => {
                  setQuery(suggestion);
                  handleSearch({ preventDefault: () => {} });
                }}
                className={`px-3 py-2 rounded-lg text-sm ${
                  darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Search;
