const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  closeWindow: () => ipcRenderer.send('close-window'),
  
  // Database operations
  getProducts: () => ipcRenderer.invoke('get-products'),
  getProduct: (id) => ipcRenderer.invoke('get-product', id),
  addProduct: (product) => ipcRenderer.invoke('add-product', product),
  updateProduct: (product) => ipcRenderer.invoke('update-product', product),
  deleteProduct: (id) => ipcRenderer.invoke('delete-product', id),
  
  // Settings
  getSettings: () => ipcRenderer.invoke('get-settings'),
  updateSettings: (settings) => ipcRenderer.invoke('update-settings', settings),
  
  // Search functionality
  getSearchHistory: () => ipcRenderer.invoke('get-search-history'),
  clearSearchHistory: () => ipcRenderer.invoke('clear-search-history'),
  performSearch: (query) => ipcRenderer.invoke('perform-search', query),
  
  // Web scraping
  scrapeWebsite: (url) => ipcRenderer.invoke('scrape-website', url),
  
  // Research data
  getResearchData: () => ipcRenderer.invoke('get-research-data'),
  
  // Notifications
  getNotifications: () => ipcRenderer.invoke('get-notifications'),
  markNotificationAsRead: (id) => ipcRenderer.invoke('mark-notification-as-read', id),
  clearAllNotifications: () => ipcRenderer.invoke('clear-all-notifications'),
  
  // Event listeners
  onNewProductFound: (callback) => {
    const subscription = (event, data) => callback(data);
    ipcRenderer.on('new-product-found', subscription);
    return () => {
      ipcRenderer.removeListener('new-product-found', subscription);
    };
  },
  
  // Database management
  backupDatabase: () => ipcRenderer.invoke('backup-database'),
  restoreDatabase: (path) => ipcRenderer.invoke('restore-database', path),
  exportProductsCsv: () => ipcRenderer.invoke('export-products-csv')
});
