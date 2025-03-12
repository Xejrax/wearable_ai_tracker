import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const Dashboard = ({ darkMode }) => {
  const [researchData, setResearchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await window.electronAPI.getResearchData();
        setResearchData(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load research data:', error);
        setLoading(false);
      }
    };

    fetchData();
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
          Wearable AI Technology Dashboard
        </h1>
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Interactive visualization of wearable AI technologies, trends, and market insights
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <div className={`flex space-x-2 mb-4 overflow-x-auto pb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {['overview', 'body placement', 'sensory inputs', 'pricing models', 'always-on devices'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeSection === section
                  ? darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : darkMode
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {activeSection === 'overview' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <motion.div variants={itemVariants} className="dashboard-section">
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Market Overview
            </h2>
            <div className="space-y-4">
              <div>
                <p className="data-label">Current Market Size (2024)</p>
                <p className="data-value">$62.7 Billion</p>
              </div>
              <div>
                <p className="data-label">Projected Growth (2029)</p>
                <p className="data-value">$138.5 Billion</p>
              </div>
              <div>
                <p className="data-label">CAGR</p>
                <p className="data-value">17.2%</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="dashboard-section">
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Technology Distribution
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="dashboard-section">
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Key Insights
            </h2>
            <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p>Health monitoring remains the primary use case for wearable AI</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p>Subscription models are gaining popularity among premium devices</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p>Always-on monitoring features are becoming standard in new devices</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p>Privacy concerns are driving innovation in on-device processing</p>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      )}

      {activeSection === 'body placement' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6"
        >
          <motion.div variants={itemVariants} className="dashboard-section">
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Body Placement Distribution
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={researchData.categories}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Number of Products" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="dashboard-section">
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Body Placement Analysis
            </h2>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-blue-500">Head-Mounted</h3>
                  <p className="text-sm mt-1">Smart glasses, AR/VR headsets, earwear with AI capabilities</p>
                </div>
                <div>
                  <h3 className="font-medium text-blue-500">Wrist-Worn</h3>
                  <p className="text-sm mt-1">Smartwatches, fitness trackers, medical alert bracelets</p>
                </div>
                <div>
                  <h3 className="font-medium text-blue-500">Neck/Torso</h3>
                  <p className="text-sm mt-1">AI pins, pendants, smart necklaces, posture monitors</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-blue-500">Finger-Worn</h3>
                  <p className="text-sm mt-1">Smart rings, fingertip sensors with AI analysis</p>
                </div>
                <div>
                  <h3 className="font-medium text-blue-500">Face-Mounted</h3>
                  <p className="text-sm mt-1">Smart masks, face-worn cameras with AI capabilities</p>
                </div>
                <div>
                  <h3 className="font-medium text-blue-500">Foot/Ankle</h3>
                  <p className="text-sm mt-1">Smart footwear, gait analysis devices, activity trackers</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {activeSection === 'sensory inputs' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6"
        >
          <motion.div variants={itemVariants} className="dashboard-section">
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Sensory Input Distribution
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={researchData.sensoryInputs}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Number of Products" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="dashboard-section">
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Sensory Input Technologies
            </h2>
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <div className="space-y-2">
                <h3 className="font-medium text-purple-500">Visual Sensing</h3>
                <ul className="text-sm space-y-1">
                  <li>• Cameras</li>
                  <li>• Infrared/Thermal</li>
                  <li>• Depth Sensors</li>
                  <li>• Light Sensors</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-purple-500">Audio Sensing</h3>
                <ul className="text-sm space-y-1">
                  <li>• Microphones</li>
                  <li>• Bone Conduction</li>
                  <li>• Ultrasonic Sensors</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-purple-500">Touch/Haptic</h3>
                <ul className="text-sm space-y-1">
                  <li>• Pressure Sensors</li>
                  <li>• Accelerometers</li>
                  <li>• Gyroscopes</li>
                  <li>• Vibration Sensors</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-purple-500">Biometric</h3>
                <ul className="text-sm space-y-1">
                  <li>• Heart Rate Monitors</li>
                  <li>• EEG Sensors</li>
                  <li>• EMG Sensors</li>
                  <li>• Temperature Sensors</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-purple-500">Chemical/Biological</h3>
                <ul className="text-sm space-y-1">
                  <li>• Sweat Analysis</li>
                  <li>• Breath Analysis</li>
                  <li>• Blood Analysis</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {activeSection === 'pricing models' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6"
        >
          <motion.div variants={itemVariants} className="dashboard-section">
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Pricing Model Distribution
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={researchData.pricingModels}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="percentage"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {researchData.pricingModels.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="dashboard-section">
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Pricing Model Comparison
            </h2>
            <div className="overflow-x-auto">
              <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                <thead>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-gray-50'} uppercase tracking-wider`}>Model</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-gray-50'} uppercase tracking-wider`}>Description</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-gray-50'} uppercase tracking-wider`}>Examples</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  <tr>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>One-time Purchase</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Single payment for hardware with no additional fees</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Meta Ray-Ban ($299), Rabbit R1 ($199)</td>
                  </tr>
                  <tr>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Hardware + Required Subscription</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Initial hardware purchase plus mandatory subscription</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Humane AI Pin ($499-$699 + $24/mo), Oura Ring ($299+ with subscription)</td>
                  </tr>
                  <tr>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Hardware + Optional Subscription</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Basic functionality with hardware, premium features via subscription</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Bee AI Pioneer ($50 + optional $12/mo), Apple Watch (optional cellular)</td>
                  </tr>
                  <tr>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Freemium</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Free basic app with premium features via subscription</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Various health monitoring apps with AI features</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      )}

      {activeSection === 'always-on devices' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6"
        >
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

          <motion.div variants={itemVariants} className="dashboard-section">
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Always-On Technology Considerations
            </h2>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <div>
                <h3 className="font-medium text-green-500 mb-2">Technical Approaches</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span><span className="font-medium">Low-Power Sensing:</span> Ambient sensors, low-power microphones, passive biometrics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span><span className="font-medium">Edge AI Processing:</span> Neural processing units, wake word detection, sensor fusion</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span><span className="font-medium">Power Management:</span> Selective activation, dynamic scaling, energy harvesting</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-red-500 mb-2">Privacy Considerations</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span><span className="font-medium">User Transparency:</span> Indicator lights, activation feedback, data usage clarity</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span><span className="font-medium">Control Mechanisms:</span> Physical controls, granular settings, temporary disabling</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span><span className="font-medium">Data Processing:</span> On-device vs. cloud processing, retention policies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span><span className="font-medium">Consent:</span> User opt-in, bystander privacy, regulatory compliance</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;
