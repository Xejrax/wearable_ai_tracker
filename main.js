const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const Store = require('electron-store');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const WebScraperService = require('./src/services/WebScraperService');

// Define database schema
const schema = {
  products: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        url: { type: 'string' },
        source: { type: 'string' },
        category: { type: 'string' },
        bodyPlacement: { type: 'string' },
        sensoryInputs: { 
          type: 'array',
          items: { type: 'string' }
        },
        features: { 
          type: 'array',
          items: { type: 'string' }
        },
        price: { type: 'string' },
        pricingModel: { type: 'string' },
        isAlwaysOn: { type: 'boolean' },
        imageUrl: { type: 'string' },
        timestamp: { type: 'number' },
        lastUpdated: { type: 'number' }
      }
    }
  },
  searchHistory: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        timestamp: { type: 'number' }
      }
    }
  },
  scrapedUrls: {
    type: 'array',
    items: { type: 'string' }
  },
  lastScrape: { type: 'number' },
  settings: {
    type: 'object',
    properties: {
      autoScrapeInterval: { type: 'number' },
      notificationsEnabled: { type: 'boolean' },
      darkMode: { type: 'boolean' },
      notifications: {
        type: 'object',
        properties: {
          notificationsEnabled: { type: 'boolean' },
          notificationSound: { type: 'boolean' },
          notificationDesktop: { type: 'boolean' },
          notificationFrequency: { type: 'string' },
          notificationTypes: {
            type: 'object',
            properties: {
              newProducts: { type: 'boolean' },
              productUpdates: { type: 'boolean' },
              trendingTopics: { type: 'boolean' },
              industryNews: { type: 'boolean' }
            }
          }
        }
      }
    }
  },
  notifications: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        message: { type: 'string' },
        timestamp: { type: 'number' },
        read: { type: 'boolean' },
        url: { type: 'string' },
        source: { type: 'string' }
      }
    }
  }
};

// Initialize data store with schema
const store = new Store({
  name: 'wearable-ai-data',
  schema,
  defaults: {
    products: [],
    searchHistory: [],
    scrapedUrls: [],
    lastScrape: null,
    notifications: [],
    settings: {
      autoScrapeInterval: 24, // hours
      notificationsEnabled: true,
      darkMode: true,
      notifications: {
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
      }
    }
  }
});

// Import research data
const importResearchData = () => {
  try {
    // Check if we already have products in the database
    const existingProducts = store.get('products');
    if (existingProducts.length > 0) {
      console.log('Products already imported, skipping import');
      return;
    }

    // Sample products based on our research
    const sampleProducts = [
      {
        id: 'humane-ai-pin',
        title: 'Humane AI Pin',
        description: 'A wearable AI device that clips to your clothing and projects information onto your hand.',
        url: 'https://hu.ma.ne/',
        source: 'Official Website',
        category: 'AI Assistant',
        bodyPlacement: 'Neck/Torso',
        sensoryInputs: ['Visual', 'Audio'],
        features: ['Voice Activation', 'Environmental Scanning', 'Laser Projection'],
        price: '$499-$699 + $24/month',
        pricingModel: 'Hardware + Required Subscription',
        isAlwaysOn: true,
        imageUrl: '',
        timestamp: Date.now(),
        lastUpdated: Date.now()
      },
      {
        id: 'meta-ray-ban',
        title: 'Meta Ray-Ban Smart Glasses',
        description: 'Smart glasses with built-in cameras and speakers for hands-free capture and AI assistance.',
        url: 'https://www.meta.com/smart-glasses/',
        source: 'Official Website',
        category: 'Smart Glasses',
        bodyPlacement: 'Head-Mounted',
        sensoryInputs: ['Visual', 'Audio'],
        features: ['Voice Activation', 'Camera Capture', 'Audio Playback'],
        price: '$299',
        pricingModel: 'One-time Purchase',
        isAlwaysOn: true,
        imageUrl: '',
        timestamp: Date.now(),
        lastUpdated: Date.now()
      },
      {
        id: 'bee-ai-pioneer',
        title: 'Bee AI Pioneer',
        description: 'Wearable bracelet that continuously monitors conversations and generates automated to-do lists.',
        url: 'https://www.bee.ai/',
        source: 'Research Report',
        category: 'Productivity Assistant',
        bodyPlacement: 'Wrist-Worn',
        sensoryInputs: ['Audio'],
        features: ['Conversation Capture', 'Task Extraction', 'Automated Summaries'],
        price: '$50 + optional $12/month',
        pricingModel: 'Hardware + Optional Subscription',
        isAlwaysOn: true,
        imageUrl: '',
        timestamp: Date.now(),
        lastUpdated: Date.now()
      },
      {
        id: 'omi-wearable',
        title: 'Omi',
        description: 'Temple-attached wearable with EEG capabilities that can detect when you\'re thinking about interacting with it.',
        url: 'https://www.omi.ai/',
        source: 'Research Report',
        category: 'Neural Interface',
        bodyPlacement: 'Head-Mounted',
        sensoryInputs: ['Audio', 'Biometric'],
        features: ['EEG Sensing', 'Audio Monitoring', 'Thought Detection'],
        price: '$89',
        pricingModel: 'Hardware + Subscription',
        isAlwaysOn: true,
        imageUrl: '',
        timestamp: Date.now(),
        lastUpdated: Date.now()
      },
      {
        id: 'apple-watch-ultra',
        title: 'Apple Watch Ultra',
        description: 'Advanced smartwatch with comprehensive health monitoring and emergency detection features.',
        url: 'https://www.apple.com/apple-watch-ultra/',
        source: 'Official Website',
        category: 'Smartwatch',
        bodyPlacement: 'Wrist-Worn',
        sensoryInputs: ['Touch/Haptic', 'Biometric', 'Audio'],
        features: ['Health Monitoring', 'Fall Detection', 'Crash Detection', 'Activity Tracking'],
        price: '$799+',
        pricingModel: 'Hardware + Optional Subscription',
        isAlwaysOn: true,
        imageUrl: '',
        timestamp: Date.now(),
        lastUpdated: Date.now()
      },
      {
        id: 'oura-ring-gen3',
        title: 'Oura Ring (Gen 3)',
        description: 'Smart ring that tracks sleep, activity, and health metrics with a focus on recovery and readiness.',
        url: 'https://ouraring.com/',
        source: 'Official Website',
        category: 'Health Monitor',
        bodyPlacement: 'Finger-Worn',
        sensoryInputs: ['Biometric'],
        features: ['Sleep Tracking', 'Health Monitoring', 'Activity Tracking'],
        price: '$299+ with subscription',
        pricingModel: 'Hardware + Required Subscription',
        isAlwaysOn: true,
        imageUrl: '',
        timestamp: Date.now(),
        lastUpdated: Date.now()
      },
      {
        id: 'rabbit-r1',
        title: 'Rabbit R1',
        description: 'Pocket-sized AI device with a camera that can understand and interact with the world around you.',
        url: 'https://www.rabbit.tech/',
        source: 'Official Website',
        category: 'AI Assistant',
        bodyPlacement: 'Portable',
        sensoryInputs: ['Visual', 'Audio'],
        features: ['Visual Recognition', 'Voice Interaction', 'Task Automation'],
        price: '$199',
        pricingModel: 'One-time Purchase',
        isAlwaysOn: false,
        imageUrl: '',
        timestamp: Date.now(),
        lastUpdated: Date.now()
      },
      {
        id: 'plaud-notepin',
        title: 'PLAUD NotePin',
        description: 'Wearable microphone that captures conversations throughout the day for note-taking and memory augmentation.',
        url: 'https://www.plaud.ai/',
        source: 'Research Report',
        category: 'Productivity Assistant',
        bodyPlacement: 'Neck/Torso',
        sensoryInputs: ['Audio'],
        features: ['Conversation Capture', 'Note-taking', 'Memory Augmentation'],
        price: 'Unknown',
        pricingModel: 'Unknown',
        isAlwaysOn: true,
        imageUrl: '',
        timestamp: Date.now(),
        lastUpdated: Date.now()
      }
    ];

    // Store the sample products
    store.set('products', sampleProducts);
    console.log('Sample products imported successfully');
  } catch (error) {
    console.error('Error importing research data:', error);
  }
};

let mainWindow;
let webScraperService;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: '#0a0a16', // Dark blue background for futuristic look
    show: false, // Don't show until ready-to-show
    frame: false, // Frameless for modern look
    titleBarStyle: 'hidden'
  });

  // Load the index.html file
  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Import research data
    importResearchData();
    
    // Initialize web scraper service
    webScraperService = new WebScraperService(store, mainWindow);
    webScraperService.initialize();
  });

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for window controls
ipcMain.on('minimize-window', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('maximize-window', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('close-window', () => {
  if (mainWindow) mainWindow.close();
});

// IPC handlers for database operations
ipcMain.handle('get-products', () => {
  return store.get('products');
});

ipcMain.handle('get-product', (event, id) => {
  const products = store.get('products');
  return products.find(product => product.id === id) || null;
});

ipcMain.handle('add-product', (event, product) => {
  try {
    const products = store.get('products');
    
    // Generate ID if not provided
    if (!product.id) {
      product.id = `product-${uuidv4()}`;
    }
    
    // Add timestamps
    product.timestamp = Date.now();
    product.lastUpdated = Date.now();
    
    // Add to products array
    products.push(product);
    store.set('products', products);
    
    // Add notification
    addNotification({
      title: 'New Product Added',
      message: `Added ${product.title} to the database`,
      url: product.url,
      source: product.source || 'Manual Entry'
    });
    
    return { success: true, product };
  } catch (error) {
    console.error('Error adding product:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-product', (event, updatedProduct) => {
  try {
    const products = store.get('products');
    const index = products.findIndex(p => p.id === updatedProduct.id);
    
    if (index === -1) {
      return { success: false, error: 'Product not found' };
    }
    
    // Update lastUpdated timestamp
    updatedProduct.lastUpdated = Date.now();
    
    // Update product
    products[index] = updatedProduct;
    store.set('products', products);
    
    // Add notification for product update
    addNotification({
      title: 'Product Updated',
      message: `Updated information for ${updatedProduct.title}`,
      url: updatedProduct.url,
      source: updatedProduct.source || 'Manual Update'
    });
    
    return { success: true, product: updatedProduct };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-product', (event, id) => {
  try {
    const products = store.get('products');
    const productToDelete = products.find(p => p.id === id);
    const filteredProducts = products.filter(p => p.id !== id);
    
    if (filteredProducts.length === products.length) {
      return { success: false, error: 'Product not found' };
    }
    
    store.set('products', filteredProducts);
    
    // Add notification for product deletion
    if (productToDelete) {
      addNotification({
        title: 'Product Deleted',
        message: `Removed ${productToDelete.title} from the database`,
        source: 'Manual Deletion'
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-settings', () => {
  return store.get('settings');
});

ipcMain.handle('update-settings', (event, settings) => {
  store.set('settings', settings);
  
  // Update web scraper settings if interval changed
  if (webScraperService && settings.autoScrapeInterval > 0) {
    webScraperService.scheduleBackgroundScraping(settings.autoScrapeInterval);
  }
  
  return true;
});

ipcMain.handle('get-search-history', () => {
  return store.get('searchHistory');
});

ipcMain.handle('clear-search-history', () => {
  store.set('searchHistory', []);
  return true;
});

ipcMain.handle('perform-search', async (event, query) => {
  try {
    // Add to search history
    const searchHistory = store.get('searchHistory');
    searchHistory.unshift({ query, timestamp: Date.now() });
    store.set('searchHistory', searchHistory.slice(0, 20)); // Keep only last 20 searches
    
    // First search local database
    const products = store.get('products');
    const localResults = products.filter(product => {
      const searchableText = `${product.title} ${product.description} ${product.category} ${product.bodyPlacement} ${product.features?.join(' ')}`.toLowerCase();
      return searchableText.includes(query.toLowerCase());
    });
    
    // Then perform web search (this is a placeholder - actual implementation would use a real search API)
    const webResults = await searchWearableAI(query);
    
    return {
      query,
      localResults,
      webResults: webResults.results
    };
  } catch (error) {
    console.error('Search error:', error);
    return { error: error.message };
  }
});

ipcMain.handle('scrape-website', async (event, url) => {
  try {
    if (!webScraperService) {
      webScraperService = new WebScraperService(store, mainWindow);
    }
    
    const scrapedData = await webScraperService.scrapeUrl(url);
    return scrapedData;
  } catch (error) {
    console.error('Scraping error:', error);
    return { error: error.message };
  }
});

ipcMain.handle('get-research-data', () => {
  // This would return the research data from the previous analysis
  return {
    categories: [
      { name: 'Head-Mounted', count: 15 },
      { name: 'Wrist-Worn', count: 28 },
      { name: 'Neck/Torso', count: 12 },
      { name: 'Finger-Worn', count: 8 },
      { name: 'Face-Mounted', count: 5 },
      { name: 'Foot/Ankle', count: 3 }
    ],
    pricingModels: [
      { name: 'One-time Purchase', percentage: 45 },
      { name: 'Subscription Required', percentage: 30 },
      { name: 'Freemium', percentage: 15 },
      { name: 'Hardware + Subscription', percentage: 10 }
    ],
    sensoryInputs: [
      { name: 'Visual', count: 32 },
      { name: 'Audio', count: 40 },
      { name: 'Touch/Haptic', count: 38 },
      { name: 'Biometric', count: 25 },
      { name: 'Chemical', count: 5 }
    ],
    alwaysOnDevices: [
      { name: 'Bee AI Pioneer', price: '$50 + $12/mo', features: ['Audio Monitoring', 'Conversation Capture'] },
      { name: 'Humane AI Pin', price: '$499-$699 + $24/mo', features: ['Voice Activation', 'Environmental Scanning'] },
      { name: 'Meta Ray-Ban', price: '$299', features: ['Voice Activation', 'Camera Capture'] },
      { name: 'Omi', price: '$89', features: ['Audio Monitoring', 'EEG Sensing'] },
      { name: 'Apple Watch', price: '$249-$799+', features: ['Health Monitoring', 'Fall Detection'] }
    ]
  };
});

// Function to search for wearable AI products
async function searchWearableAI(query) {
  // This would use a real search API in production
  // For now, we'll simulate a search with placeholder data
  console.log(`Searching for: ${query}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    query,
    results: [
      {
        title: "New Meta Ray-Ban Smart Glasses Pro",
        url: "https://example.com/meta-ray-ban-pro",
        snippet: "Meta's latest smart glasses feature enhanced AI capabilities with 8-hour battery life.",
        source: "TechCrunch",
        date: "2025-02-15"
      },
      {
        title: "Apple Introduces AR Glasses with Neural Interface",
        url: "https://example.com/apple-ar-glasses",
        snippet: "Apple's first AR glasses include neural sensing technology for thought-based control.",
        source: "Bloomberg",
        date: "2025-01-20"
      },
      {
        title: "Oura Ring Gen 4 with Enhanced AI Features",
        url: "https://example.com/oura-ring-gen4",
        snippet: "The latest Oura Ring includes advanced AI for sleep analysis and health predictions.",
        source: "Wired",
        date: "2025-03-01"
      }
    ]
  };
}

// Notification handlers
ipcMain.handle('get-notifications', () => {
  return store.get('notifications');
});

ipcMain.handle('mark-notification-as-read', (event, id) => {
  try {
    const notifications = store.get('notifications');
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    
    store.set('notifications', updatedNotifications);
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
});

ipcMain.handle('clear-all-notifications', () => {
  try {
    store.set('notifications', []);
    return true;
  } catch (error) {
    console.error('Error clearing notifications:', error);
    return false;
  }
});

// Function to add a notification
function addNotification(data) {
  try {
    const settings = store.get('settings');
    const notificationSettings = settings.notifications || {};
    
    // Check if notifications are enabled
    if (!settings.notificationsEnabled || !notificationSettings.notificationsEnabled) {
      return;
    }
    
    // Create notification object
    const notification = {
      id: `notification-${uuidv4()}`,
      title: data.title,
      message: data.message,
      timestamp: Date.now(),
      read: false,
      url: data.url || null,
      source: data.source || null
    };
    
    // Add to notifications list
    const notifications = store.get('notifications');
    notifications.unshift(notification);
    store.set('notifications', notifications.slice(0, 100)); // Keep only last 100 notifications
    
    // Send to renderer process
    if (mainWindow) {
      mainWindow.webContents.send('new-product-found', {
        title: notification.title,
        message: notification.message,
        site: notification.source,
        url: notification.url,
        timestamp: notification.timestamp
      });
    }
    
    // Show desktop notification if enabled
    if (notificationSettings.notificationDesktop) {
      showDesktopNotification(notification);
    }
    
    return notification;
  } catch (error) {
    console.error('Error adding notification:', error);
  }
}

// Function to show desktop notification
function showDesktopNotification(notification) {
  try {
    if (Notification.isSupported()) {
      const desktopNotification = new Notification({
        title: notification.title,
        body: notification.message,
        silent: false
      });
      
      desktopNotification.show();
      
      // Handle click on notification
      desktopNotification.on('click', () => {
        if (mainWindow) {
          mainWindow.focus();
        }
      });
    }
  } catch (error) {
    console.error('Error showing desktop notification:', error);
  }
}

// Database backup functionality
ipcMain.handle('backup-database', () => {
  try {
    const data = {
      products: store.get('products'),
      searchHistory: store.get('searchHistory'),
      scrapedUrls: store.get('scrapedUrls'),
      lastScrape: store.get('lastScrape'),
      settings: store.get('settings'),
      notifications: store.get('notifications')
    };
    
    const backupPath = path.join(app.getPath('userData'), `wearable-ai-backup-${Date.now()}.json`);
    fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
    
    return { success: true, path: backupPath };
  } catch (error) {
    console.error('Backup error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('restore-database', (event, backupPath) => {
  try {
    const data = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    
    if (data.products) store.set('products', data.products);
    if (data.searchHistory) store.set('searchHistory', data.searchHistory);
    if (data.scrapedUrls) store.set('scrapedUrls', data.scrapedUrls);
    if (data.lastScrape) store.set('lastScrape', data.lastScrape);
    if (data.settings) store.set('settings', data.settings);
    if (data.notifications) store.set('notifications', data.notifications);
    
    return { success: true };
  } catch (error) {
    console.error('Restore error:', error);
    return { success: false, error: error.message };
  }
});

// Export database as CSV
ipcMain.handle('export-products-csv', () => {
  try {
    const products = store.get('products');
    
    // Create CSV header
    let csv = 'ID,Title,Description,URL,Source,Category,Body Placement,Price,Always On,Features,Last Updated\n';
    
    // Add product rows
    products.forEach(product => {
      const features = product.features ? `"${product.features.join(', ')}"` : '';
      const description = product.description ? `"${product.description.replace(/"/g, '""')}"` : '';
      
      csv += `${product.id},${product.title.replace(/,/g, ' ')},${description},${product.url},${product.source || ''},${product.category || ''},${product.bodyPlacement || ''},${product.price || ''},${product.isAlwaysOn ? 'Yes' : 'No'},${features},${new Date(product.lastUpdated).toISOString()}\n`;
    });
    
    const exportPath = path.join(app.getPath('userData'), `wearable-ai-export-${Date.now()}.csv`);
    fs.writeFileSync(exportPath, csv);
    
    return { success: true, path: exportPath };
  } catch (error) {
    console.error('Export error:', error);
    return { success: false, error: error.message };
  }
});
