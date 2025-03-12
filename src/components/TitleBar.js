import React from 'react';
import { motion } from 'framer-motion';

const TitleBar = () => {
  const handleMinimize = () => window.electronAPI.minimizeWindow();
  const handleMaximize = () => window.electronAPI.maximizeWindow();
  const handleClose = () => window.electronAPI.closeWindow();

  return (
    <div className="flex items-center justify-between h-10 bg-gray-900 border-b border-gray-800 px-4 select-none">
      <div className="flex items-center">
        <motion.div 
          className="w-6 h-6 mr-2"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </motion.div>
        <span className="text-blue-500 font-semibold text-sm">Wearable AI Tracker</span>
      </div>
      
      <div className="flex space-x-2">
        <button 
          onClick={handleMinimize}
          className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 focus:outline-none"
        />
        <button 
          onClick={handleMaximize}
          className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 focus:outline-none"
        />
        <button 
          onClick={handleClose}
          className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 focus:outline-none"
        />
      </div>
    </div>
  );
};

export default TitleBar;
