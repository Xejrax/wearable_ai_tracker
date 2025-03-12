import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Products = ({ darkMode }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await window.electronAPI.getProducts();
        setProducts(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
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

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true;
    // This is a placeholder - in a real app, products would have categories
    return product.category === filter;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'newest') {
      return b.timestamp - a.timestamp;
    } else if (sortBy === 'oldest') {
      return a.timestamp - b.timestamp;
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          animate={{
            rotate: 360,
            transition: { duration: 2, repeat: Infinity, ease: "linear" }
          }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      className="h-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} glow-text`}>
          Wearable AI Products
        </h1>
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Discovered and tracked wearable AI technologies from automated web scraping
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`tech-input text-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}
          >
            <option value="all">All Categories</option>
            <option value="head">Head-Mounted</option>
            <option value="wrist">Wrist-Worn</option>
            <option value="neck">Neck/Torso</option>
            <option value="finger">Finger-Worn</option>
            <option value="face">Face-Mounted</option>
            <option value="foot">Foot/Ankle</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`tech-input text-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
        
        <motion.button
          className="tech-button flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.electronAPI.scrapeWebsite('https://www.theverge.com/wearables')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Refresh Data
        </motion.button>
      </motion.div>

      {sortedProducts.length === 0 ? (
        <motion.div 
          variants={itemVariants} 
          className={`dashboard-section flex flex-col items-center justify-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-lg mb-2">No products discovered yet</p>
          <p className="text-sm max-w-md text-center">
            Use the Web Scraper to discover wearable AI products or wait for the automated background scraping to find new products.
          </p>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {sortedProducts.map((product, index) => (
            <motion.div
              key={product.url || index}
              variants={itemVariants}
              className="tech-card"
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="flex justify-between items-start">
                <h3 className={`font-medium text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {product.title || 'Unnamed Product'}
                </h3>
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {product.timestamp ? new Date(product.timestamp).toLocaleDateString() : 'Unknown date'}
                </span>
              </div>
              
              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                {product.description || 'No description available'}
              </p>
              
              {product.headings && product.headings.length > 0 && (
                <div className="mt-4">
                  <p className={`text-xs uppercase font-medium ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Key Information
                  </p>
                  <ul className={`mt-1 space-y-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {product.headings.slice(0, 3).map((heading, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span className="line-clamp-1">{heading}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {product.url && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <a 
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} flex items-center`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                    View Source
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Products;
