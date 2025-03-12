import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  LineChart, Line, CartesianGrid, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, ZAxis
} from 'recharts';

// Custom components for enhanced visualizations
const AnimatedProgressBar = ({ value, maxValue, color, label, darkMode }) => {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}</span>
        <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{value}</span>
      </div>
      <div className={`w-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

const PulsatingDot = ({ size = 10, color = 'bg-blue-500', pulseColor = 'bg-blue-400' }) => (
  <span className="relative flex h-3 w-3">
    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${pulseColor} opacity-75`}></span>
    <span className={`relative inline-flex rounded-full h-3 w-3 ${color}`}></span>
  </span>
);

const DataVisualization = ({ darkMode }) => {
  const [researchData, setResearchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('market');
  const [animateCharts, setAnimateCharts] = useState(false);

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899', '#14b8a6'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, this would fetch from a more comprehensive data source
        const data = await window.electronAPI.getResearchData();
        
        // Enhance the data with additional visualization datasets
        const enhancedData = {
          ...data,
          marketTrends: generateMarketTrendData(),
          adoptionRates: generateAdoptionRateData(),
          technologyComparison: generateTechnologyComparisonData(),
          featureDistribution: generateFeatureDistributionData(),
          pricingTrends: generatePricingTrendData(),
          regionalData: generateRegionalData()
        };
        
        setResearchData(enhancedData);
        setLoading(false);
        
        // Trigger animation after data is loaded
        setTimeout(() => setAnimateCharts(true), 500);
      } catch (error) {
        console.error('Failed to load research data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate sample data for visualizations
  const generateMarketTrendData = () => {
    return [
      { year: 2020, value: 20.5, forecast: null },
      { year: 2021, value: 28.7, forecast: null },
      { year: 2022, value: 38.1, forecast: null },
      { year: 2023, value: 52.4, forecast: null },
      { year: 2024, value: 62.7, forecast: null },
      { year: 2025, value: null, forecast: 85.3 },
      { year: 2026, value: null, forecast: 102.8 },
      { year: 2027, value: null, forecast: 118.6 },
      { year: 2028, value: null, forecast: 129.4 },
      { year: 2029, value: null, forecast: 138.5 }
    ];
  };

  const generateAdoptionRateData = () => {
    return [
      { name: 'Early Adopters', value: 18 },
      { name: 'Tech Enthusiasts', value: 22 },
      { name: 'Health Conscious', value: 35 },
      { name: 'Professionals', value: 15 },
      { name: 'Mainstream', value: 10 }
    ];
  };

  const generateTechnologyComparisonData = () => {
    return [
      { 
        category: 'Head-Mounted',
        battery: 6,
        privacy: 4,
        comfort: 5,
        features: 9,
        price: 7
      },
      { 
        category: 'Wrist-Worn',
        battery: 8,
        privacy: 7,
        comfort: 8,
        features: 7,
        price: 6
      },
      { 
        category: 'Neck/Torso',
        battery: 7,
        privacy: 5,
        comfort: 6,
        features: 8,
        price: 5
      },
      { 
        category: 'Finger-Worn',
        battery: 9,
        privacy: 9,
        comfort: 9,
        features: 5,
        price: 7
      }
    ];
  };

  const generateFeatureDistributionData = () => {
    return [
      { feature: 'Health Monitoring', count: 85 },
      { feature: 'Voice Assistant', count: 72 },
      { feature: 'Notifications', count: 95 },
      { feature: 'Activity Tracking', count: 90 },
      { feature: 'Sleep Analysis', count: 65 },
      { feature: 'GPS', count: 55 },
      { feature: 'Camera', count: 30 },
      { feature: 'Augmented Reality', count: 15 }
    ];
  };

  const generatePricingTrendData = () => {
    return [
      { year: 2020, premium: 450, midrange: 250, budget: 120 },
      { year: 2021, premium: 480, midrange: 240, budget: 110 },
      { year: 2022, premium: 520, midrange: 230, budget: 100 },
      { year: 2023, premium: 550, midrange: 220, budget: 90 },
      { year: 2024, premium: 580, midrange: 210, budget: 80 }
    ];
  };

  const generateRegionalData = () => {
    return [
      { region: 'North America', adoption: 35, marketShare: 42 },
      { region: 'Europe', adoption: 28, marketShare: 25 },
      { region: 'Asia Pacific', adoption: 32, marketShare: 30 },
      { region: 'Latin America', adoption: 15, marketShare: 8 },
      { region: 'Middle East & Africa', adoption: 12, marketShare: 5 }
    ];
  };

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
          Wearable AI Data Visualization
        </h1>
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Interactive visualizations of wearable AI market trends, technology adoption, and product analysis
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <div className={`flex space-x-2 mb-4 overflow-x-auto pb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {['market', 'technology', 'features', 'pricing', 'adoption', 'regional'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab
                  ? darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : darkMode
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Market Trends Visualization */}
      {activeTab === 'market' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={animateCharts ? "visible" : "hidden"}
          className="space-y-6"
        >
          <motion.div variants={itemVariants} className="dashboard-section">
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Wearable AI Market Growth (2020-2029)
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={researchData.marketTrends}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" />
                  <YAxis label={{ value: 'Market Size (Billion $)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                      borderColor: darkMode ? '#374151' : '#e5e7eb',
                      color: darkMode ? '#f3f4f6' : '#1f2937'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    name="Actual Market Size"
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="forecast" 
                    stroke="#8b5cf6" 
                    fillOpacity={1} 
                    fill="url(#colorForecast)" 
                    name="Forecast"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <div className="flex items-center">
                <PulsatingDot color="bg-blue-500" pulseColor="bg-blue-400" />
                <span className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  The wearable AI market is projected to reach $138.5 billion by 2029, with a CAGR of 17.2%
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="dashboard-section">
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Market Drivers
              </h2>
              <div className="space-y-4">
                <AnimatedProgressBar 
                  value={85} 
                  maxValue={100} 
                  color="bg-blue-500" 
                  label="Health & Wellness Focus" 
                  darkMode={darkMode} 
                />
                <AnimatedProgressBar 
                  value={78} 
                  maxValue={100} 
                  color="bg-purple-500" 
                  label="Technological Advancements" 
                  darkMode={darkMode} 
                />
                <AnimatedProgressBar 
                  value={65} 
                  maxValue={100} 
                  color="bg-green-500" 
                  label="Customization & Personalization" 
                  darkMode={darkMode} 
                />
                <AnimatedProgressBar 
                  value={72} 
                  maxValue={100} 
                  color="bg-yellow-500" 
                  label="Increasing Consumer Adoption" 
                  darkMode={darkMode} 
                />
              </div>
            </div>

            <div className="dashboard-section">
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Market Challenges
              </h2>
              <div className="space-y-4">
                <AnimatedProgressBar 
                  value={68} 
                  maxValue={100} 
                  color="bg-red-500" 
                  label="Market Saturation & Competition" 
                  darkMode={darkMode} 
                />
                <AnimatedProgressBar 
                  value={75} 
                  maxValue={100} 
                  color="bg-orange-500" 
                  label="Security & Privacy Concerns" 
                  darkMode={darkMode} 
                />
                <AnimatedProgressBar 
                  value={62} 
                  maxValue={100} 
                  color="bg-pink-500" 
                  label="Lack of Industry Standards" 
                  darkMode={darkMode} 
                />
                <AnimatedProgressBar 
                  value={58} 
                  maxValue={100} 
                  color="bg-indigo-500" 
                  label="Technical Limitations" 
                  darkMode={darkMode} 
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Technology Comparison Visualization */}
      {activeTab === 'technology' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={animateCharts ? "visible" : "hidden"}
          className="space-y-6"
        >
          <motion.div variants={itemVariants} className="dashboard-section">
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Technology Comparison by Category
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={researchData.technologyComparison}>
                  <PolarGrid stroke={darkMode ? "#374151" : "#e5e7eb"} />
                  <PolarAngleAxis dataKey="category" tick={{ fill: darkMode ? '#f3f4f6' : '#1f2937' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: darkMode ? '#f3f4f6' : '#1f2937' }} />
                  <Radar name="Battery Life" dataKey="battery" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Radar name="Privacy Features" dataKey="privacy" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  <Radar name="Comfort" dataKey="comfort" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                  <Radar name="Feature Set" dataKey="features" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                  <Radar name="Price Value" dataKey="price" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                  <Legend />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                      borderColor: darkMode ? '#374151' : '#e5e7eb',
                      color: darkMode ? '#f3f4f6' : '#1f2937'
                    }} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                This radar chart compares different wearable AI categories across key performance metrics on a scale of 1-10. 
                Finger-worn devices excel in battery life, privacy, and comfort, while head-mounted devices lead in features.
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="dashboard-section">
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Body Placement Distribution
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={researchData.categories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {researchData.categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                        borderColor: darkMode ? '#374151' : '#e5e7eb',
                        color: darkMode ? '#f3f4f6' : '#1f2937'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="dashboard-section">
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Sensory Input Distribution
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={researchData.sensoryInputs}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                    <XAxis type="number" tick={{ fill: darkMode ? '#f3f4f6' : '#1f2937' }} />
                    <YAxis dataKey="name" type="category" tick={{ fill: darkMode ? '#f3f4f6' : '#1f2937' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                        borderColor: darkMode ? '#374151' : '#e5e7eb',
                        color: darkMode ? '#f3f4f6' : '#1f2937'
                      }} 
                    />
                    <Bar dataKey="count" name="Number of Products" fill="#8b5cf6">
                      {researchData.sensoryInputs.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Features Visualization */}
      {activeTab === 'features' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={animateCharts ? "visible" : "hidden"}
          className="space-y-6"
        >
          <motion.div variants={itemVariants} className="dashboard-section">
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Feature Distribution Across Wearable AI Products
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={researchData.featureDistribution}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                  <XAxis dataKey="feature" tick={{ fill: darkMode ? '#f3f4f6' : '#1f2937' }} />
                  <YAxis tick={{ fill: darkMode ? '#f3f4f6' : '#1f2937' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                      borderColor: darkMode ? '#374151' : '#e5e7eb',
                      color: darkMode ? '#f3f4f6' : '#1f2937'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="count" name="Number of Products" fill="#3b82f6">
                    {researchData.featureDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                This chart shows the prevalence of different features across wearable AI products. 
                Notifications, activity tracking, and health monitoring are the most common features, 
                while augmented reality and camera capabilities are less widespread.
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="dashboard-section">
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Always-On Wearable AI Devices
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {researchData.alwaysOnDevices.map((device, index) => (
                <motion.div
                  key={device.name}
                  className="tech-card"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <h3 className={`font-medium text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{device.name}</h3>
                  <p className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} mt-1`}>{device.price}</p>
                  <div className="mt-3">
                    <p className={`text-xs uppercase font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Key Features</p>
                    <ul className={`mt-1 space-y-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {device.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <span className="text-blue-500 mr-2">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Pricing Visualization */}
      {activeTab === 'pricing' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={animateCharts ? "visible" : "hidden"}
          className="space-y-6"
        >
          <motion.div variants={itemVariants} className="dashboard-section">
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Pricing Trends (2020-2024)
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={researchData.pricingTrends}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                  <XAxis dataKey="year" tick={{ fill: darkMode ? '#f3f4f6' : '#1f2937' }} />
                  <YAxis tick={{ fill: darkMode ? '#f3f4f6' : '#1f2937' }} label={{ value: 'Price ($)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: darkMode ? '#f3f4f6' : '#1f2937' } }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                      borderColor: darkMode ? '#374151' : '#e5e7eb',
                      color: darkMode ? '#f3f4f6' : '#1f2937'
                    }} 
                  />
                  <Legend />
                  <Line type="monotone" dataKey="premium" name="Premium Devices" stroke="#ef4444" strokeWidth={2} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="midrange" name="Mid-range Devices" stroke="#f59e0b" strokeWidth={2} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="budget" name="Budget Devices" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                This chart shows the pricing trends for wearable AI devices across different market segments.
                Premium device prices are increasing as they add more advanced features, while budget device 
                prices are decreasing as technology becomes more accessible.
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="dashboard-section">
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Pricing Model Comparison
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={researchData.pricingModels}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {researchData.pricingModels.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                        borderColor: darkMode ? '#374151' : '#e5e7eb',
                        color: darkMode ? '#f3f4f6' : '#1f2937'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <div>
                  <h3 className="font-medium text-blue-500">One-time Purchase</h3>
                  <p className="text-sm mt-1">Single payment for hardware with no additional fees</p>
                  <p className="text-xs text-gray-500 mt-1">Examples: Meta Ray-Ban ($299), Rabbit R1 ($199)</p>
                </div>
                <div>
                  <h3 className="font-medium text-purple-500">Hardware + Required Subscription</h3>
                  <p className="text-sm mt-1">Initial hardware purchase plus mandatory subscription</p>
                  <p className="text-xs text-gray-500 mt-1">Examples: Humane AI Pin ($499-$699 + $24/mo), Oura Ring ($299+ with subscription)</p>
                </div>
                <div>
                  <h3 className="font-medium text-green-500">Hardware + Optional Subscription</h3>
                  <p className="text-sm mt-1">Basic functionality with hardware, premium features via subscription</p>
                  <p className="text-xs text-gray-500 mt-1">Examples: Bee AI Pioneer ($50 + optional $12/mo), Apple Watch (optional cellular)</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Adoption Visualization */}
      {activeTab === 'adoption' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={animateCharts ? "visible" : "hidden"}
          className="space-y-6"
        >
          <motion.div variants={itemVariants} className="dashboard-section">
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              User Adoption by Demographic
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={researchData.adoptionRates}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label
                  >
                    {researchData.adoptionRates.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                      borderColor: darkMode ? '#374151' : '#e5e7eb',
                      color: darkMode ? '#f3f4f6' : '#1f2937'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                This chart shows the distribution of wearable AI adoption across different user demographics.
                Health-conscious consumers represent the largest segment (35%), followed by tech enthusiasts (22%)
                and early adopters (18%).
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="dashboard-section">
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Adoption Barriers
              </h2>
              <div className="space-y-4">
                <AnimatedProgressBar 
                  value={82} 
                  maxValue={100} 
                  color="bg-red-500" 
                  label="Privacy Concerns" 
                  darkMode={darkMode} 
                />
                <AnimatedProgressBar 
                  value={75} 
                  maxValue={100} 
                  color="bg-orange-500" 
                  label="Battery Life Limitations" 
                  darkMode={darkMode} 
                />
                <AnimatedProgressBar 
                  value={68} 
                  maxValue={100} 
                  color="bg-yellow-500" 
                  label="High Cost" 
                  darkMode={darkMode} 
                />
                <AnimatedProgressBar 
                  value={55} 
                  maxValue={100} 
                  color="bg-purple-500" 
                  label="Limited Functionality" 
                  darkMode={darkMode} 
                />
                <AnimatedProgressBar 
                  value={48} 
                  maxValue={100} 
                  color="bg-blue-500" 
                  label="Social Acceptance" 
                  darkMode={darkMode} 
                />
              </div>
            </div>

            <div className="dashboard-section">
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Consumer Acceptance Factors
              </h2>
              <div className="space-y-4">
                <AnimatedProgressBar 
                  value={88} 
                  maxValue={100} 
                  color="bg-green-500" 
                  label="Perceived Value" 
                  darkMode={darkMode} 
                />
                <AnimatedProgressBar 
                  value={72} 
                  maxValue={100} 
                  color="bg-blue-500" 
                  label="Form Factor" 
                  darkMode={darkMode} 
                />
                <AnimatedProgressBar 
                  value={80} 
                  maxValue={100} 
                  color="bg-indigo-500" 
                  label="Trust in Brand" 
                  darkMode={darkMode} 
                />
                <AnimatedProgressBar 
                  value={65} 
                  maxValue={100} 
                  color="bg-purple-500" 
                  label="Control Granularity" 
                  darkMode={darkMode} 
                />
                <AnimatedProgressBar 
                  value={78} 
                  maxValue={100} 
                  color="bg-pink-500" 
                  label="Health Benefits" 
                  darkMode={darkMode} 
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Regional Visualization */}
      {activeTab === 'regional' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={animateCharts ? "visible" : "hidden"}
          className="space-y-6"
        >
          <motion.div variants={itemVariants} className="dashboard-section">
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Regional Adoption & Market Share
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                  <XAxis 
                    type="number" 
                    dataKey="adoption" 
                    name="Adoption Rate (%)" 
                    tick={{ fill: darkMode ? '#f3f4f6' : '#1f2937' }}
                    label={{ value: 'Adoption Rate (%)', position: 'bottom', style: { textAnchor: 'middle', fill: darkMode ? '#f3f4f6' : '#1f2937' } }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="marketShare" 
                    name="Market Share (%)" 
                    tick={{ fill: darkMode ? '#f3f4f6' : '#1f2937' }}
                    label={{ value: 'Market Share (%)', angle: -90, position: 'left', style: { textAnchor: 'middle', fill: darkMode ? '#f3f4f6' : '#1f2937' } }}
                  />
                  <ZAxis range={[100, 200]} />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                      borderColor: darkMode ? '#374151' : '#e5e7eb',
                      color: darkMode ? '#f3f4f6' : '#1f2937'
                    }}
                    formatter={(value, name, props) => [value, name]}
                    labelFormatter={(value) => researchData.regionalData[value].region}
                  />
                  <Scatter 
                    name="Regions" 
                    data={researchData.regionalData} 
                    fill="#8884d8"
                  >
                    {researchData.regionalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                This scatter plot shows the relationship between adoption rate and market share across different regions.
                North America leads in both adoption (35%) and market share (42%), followed by Asia Pacific and Europe.
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="dashboard-section">
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Regional Market Analysis
            </h2>
            <div className="overflow-x-auto">
              <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                <thead>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-gray-50'} uppercase tracking-wider`}>Region</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-gray-50'} uppercase tracking-wider`}>Adoption Rate</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-gray-50'} uppercase tracking-wider`}>Market Share</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-gray-50'} uppercase tracking-wider`}>Key Trends</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  <tr>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>North America</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>35%</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>42%</td>
                    <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Strong focus on health monitoring and productivity features</td>
                  </tr>
                  <tr>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Europe</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>28%</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>25%</td>
                    <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Privacy-focused devices with stronger data protection features</td>
                  </tr>
                  <tr>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Asia Pacific</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>32%</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>30%</td>
                    <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Rapid growth in smart glasses and AR wearables</td>
                  </tr>
                  <tr>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Latin America</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>15%</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>8%</td>
                    <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Growing interest in affordable wearable AI solutions</td>
                  </tr>
                  <tr>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Middle East & Africa</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>12%</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>5%</td>
                    <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Emerging market with focus on health and fitness applications</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DataVisualization;
