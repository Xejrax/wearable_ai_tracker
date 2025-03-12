const axios = require('axios');
const cheerio = require('cheerio');
const { v4: uuidv4 } = require('uuid');

class WebScraperService {
  constructor(store, mainWindow) {
    this.store = store;
    this.mainWindow = mainWindow;
    this.scrapeInterval = null;
    this.isScrapingActive = false;
    this.targetSites = [
      {
        url: 'https://www.wired.com/tag/wearables/',
        selectors: {
          articles: 'article',
          title: 'h2, h3',
          description: 'p',
          link: 'a'
        }
      },
      {
        url: 'https://techcrunch.com/tag/wearables/',
        selectors: {
          articles: 'article',
          title: 'h2',
          description: '.post-block__content',
          link: 'a.post-block__title__link'
        }
      },
      {
        url: 'https://www.theverge.com/wearables',
        selectors: {
          articles: '.c-entry-box--compact',
          title: 'h2',
          description: '.c-entry-box--compact__dek',
          link: 'a.c-entry-box--compact__image-wrapper'
        }
      },
      {
        url: 'https://www.cnet.com/topics/wearable-tech/',
        selectors: {
          articles: '.c-storiesListItem',
          title: 'h3',
          description: 'p',
          link: 'a'
        }
      }
    ];
    
    // Add custom sites for specific wearable AI products
    this.aiSpecificSites = [
      {
        url: 'https://hu.ma.ne/',
        name: 'Humane AI Pin',
        category: 'AI Assistant'
      },
      {
        url: 'https://www.meta.com/smart-glasses/',
        name: 'Meta Ray-Ban Smart Glasses',
        category: 'Smart Glasses'
      },
      {
        url: 'https://www.apple.com/apple-watch-ultra/',
        name: 'Apple Watch Ultra',
        category: 'Smartwatch'
      },
      {
        url: 'https://ouraring.com/',
        name: 'Oura Ring',
        category: 'Health Monitor'
      },
      {
        url: 'https://www.rabbit.tech/',
        name: 'Rabbit R1',
        category: 'AI Assistant'
      }
    ];
    
    // Keywords to identify wearable AI products
    this.wearableAIKeywords = [
      'ai', 'artificial intelligence', 'machine learning', 'neural', 'smart glasses',
      'smartwatch', 'wearable', 'wearable tech', 'wearable ai', 'smart ring',
      'health monitor', 'fitness tracker', 'always-on', 'always listening',
      'voice assistant', 'augmented reality', 'ar glasses', 'smart earbuds',
      'biometric', 'sensor', 'neural interface', 'brain-computer interface',
      'bci', 'eeg', 'emg', 'smart clothing', 'smart jewelry'
    ];
    
    // Body placement categories
    this.bodyPlacementKeywords = {
      'Head-Mounted': ['glasses', 'headset', 'earbuds', 'headphones', 'ar', 'vr'],
      'Wrist-Worn': ['watch', 'wristband', 'bracelet'],
      'Neck/Torso': ['necklace', 'pendant', 'pin', 'clip', 'badge'],
      'Finger-Worn': ['ring', 'finger'],
      'Face-Mounted': ['mask', 'face'],
      'Foot/Ankle': ['shoe', 'insole', 'sock', 'ankle']
    };
    
    // Sensory input types
    this.sensoryInputKeywords = {
      'Visual': ['camera', 'vision', 'image', 'photo', 'video', 'sight', 'eye tracking'],
      'Audio': ['microphone', 'voice', 'sound', 'hearing', 'listen', 'speech'],
      'Touch/Haptic': ['touch', 'haptic', 'vibration', 'pressure', 'accelerometer', 'gyroscope'],
      'Biometric': ['heart rate', 'pulse', 'temperature', 'blood', 'sweat', 'eeg', 'emg', 'ecg'],
      'Chemical': ['glucose', 'oxygen', 'ph', 'hormone', 'chemical']
    };
  }

  // Initialize the scraper with settings
  initialize() {
    const settings = this.store.get('settings');
    if (settings.autoScrapeInterval > 0) {
      this.scheduleBackgroundScraping(settings.autoScrapeInterval);
    }
  }

  // Schedule background scraping at regular intervals
  scheduleBackgroundScraping(intervalHours) {
    // Clear any existing interval
    if (this.scrapeInterval) {
      clearInterval(this.scrapeInterval);
    }
    
    // Convert hours to milliseconds
    const intervalMs = intervalHours * 60 * 60 * 1000;
    
    console.log(`Scheduling background scraping every ${intervalHours} hours`);
    
    // Set up new interval
    this.scrapeInterval = setInterval(() => {
      this.runBackgroundScraping();
    }, intervalMs);
    
    // Run immediately on startup
    setTimeout(() => {
      this.runBackgroundScraping();
    }, 5000); // Wait 5 seconds after startup
  }

  // Run the background scraping process
  async runBackgroundScraping() {
    if (this.isScrapingActive) {
      console.log('Scraping already in progress, skipping this cycle');
      return;
    }
    
    this.isScrapingActive = true;
    console.log('Running scheduled background scraping');
    
    try {
      // First scrape news sites for articles about wearable AI
      for (const site of this.targetSites) {
        try {
          await this.scrapeNewsSite(site);
        } catch (error) {
          console.error(`Error scraping ${site.url}:`, error);
        }
      }
      
      // Then scrape specific product sites for updates
      for (const site of this.aiSpecificSites) {
        try {
          await this.scrapeProductSite(site);
        } catch (error) {
          console.error(`Error scraping ${site.url}:`, error);
        }
      }
      
      // Update last scrape timestamp
      this.store.set('lastScrape', Date.now());
      
    } catch (error) {
      console.error('Background scraping error:', error);
    } finally {
      this.isScrapingActive = false;
    }
  }

  // Scrape a news site for articles about wearable AI
  async scrapeNewsSite(site) {
    console.log(`Scraping news site: ${site.url}`);
    
    try {
      const response = await axios.get(site.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });
      
      const $ = cheerio.load(response.data);
      const articles = $(site.selectors.articles);
      const scrapedUrls = this.store.get('scrapedUrls');
      const products = this.store.get('products');
      let newProductsFound = 0;
      
      console.log(`Found ${articles.length} articles on ${site.url}`);
      
      articles.each((i, element) => {
        try {
          // Extract article information
          const titleElement = $(element).find(site.selectors.title).first();
          const title = titleElement.text().trim();
          
          // Skip if no title found
          if (!title) return;
          
          const descElement = $(element).find(site.selectors.description).first();
          const description = descElement.text().trim();
          
          const linkElement = $(element).find(site.selectors.link).first();
          let link = linkElement.attr('href');
          
          // Handle relative URLs
          if (link && link.startsWith('/')) {
            const siteUrl = new URL(site.url);
            link = `${siteUrl.protocol}//${siteUrl.hostname}${link}`;
          }
          
          // Skip if already scraped
          if (scrapedUrls.includes(link)) {
            return;
          }
          
          // Check if article is about wearable AI
          const isWearableAI = this.isAboutWearableAI(title + ' ' + description);
          
          if (isWearableAI && link) {
            console.log(`Found wearable AI article: ${title}`);
            
            // Add to scraped URLs
            scrapedUrls.push(link);
            this.store.set('scrapedUrls', scrapedUrls);
            
            // Create product object
            const product = {
              id: `product-${uuidv4()}`,
              title: title,
              description: description || 'No description available',
              url: link,
              source: new URL(site.url).hostname,
              category: this.determineCategory(title + ' ' + description),
              bodyPlacement: this.determineBodyPlacement(title + ' ' + description),
              sensoryInputs: this.determineSensoryInputs(title + ' ' + description),
              features: this.extractFeatures(title + ' ' + description),
              isAlwaysOn: this.isAlwaysOn(title + ' ' + description),
              timestamp: Date.now(),
              lastUpdated: Date.now()
            };
            
            // Check if similar product already exists
            const existingProductIndex = products.findIndex(p => 
              p.title.toLowerCase() === title.toLowerCase() || 
              (p.url && p.url === link)
            );
            
            if (existingProductIndex >= 0) {
              // Update existing product
              products[existingProductIndex] = {
                ...products[existingProductIndex],
                ...product,
                lastUpdated: Date.now()
              };
            } else {
              // Add new product
              products.push(product);
              newProductsFound++;
              
              // Send notification if enabled
              this.sendNotification({
                title: 'New Wearable AI Product Discovered',
                message: `Found new product: ${title}`,
                source: new URL(site.url).hostname,
                url: link
              });
            }
          }
        } catch (error) {
          console.error('Error processing article:', error);
        }
      });
      
      // Save updated products
      this.store.set('products', products);
      
      console.log(`Scraped ${site.url}, found ${newProductsFound} new products`);
      
    } catch (error) {
      console.error(`Error scraping ${site.url}:`, error);
      throw error;
    }
  }

  // Scrape a specific product site for updates
  async scrapeProductSite(site) {
    console.log(`Scraping product site: ${site.url}`);
    
    try {
      const response = await axios.get(site.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });
      
      const $ = cheerio.load(response.data);
      const products = this.store.get('products');
      
      // Extract basic information
      const title = $('title').text().trim();
      const description = $('meta[name="description"]').attr('content') || '';
      const bodyText = $('body').text().toLowerCase();
      
      // Try to extract price information
      const priceText = bodyText.match(/(\$\d+(\.\d{2})?)|(\d+\s*\$)/g) || [];
      const price = priceText.length > 0 ? priceText[0] : 'Unknown';
      
      // Extract features
      const features = this.extractFeatures(bodyText);
      
      // Determine if it's always-on
      const isAlwaysOn = this.isAlwaysOn(bodyText);
      
      // Create or update product
      const existingProductIndex = products.findIndex(p => 
        p.url === site.url || 
        (p.title && p.title.toLowerCase().includes(site.name.toLowerCase()))
      );
      
      const product = {
        id: existingProductIndex >= 0 ? products[existingProductIndex].id : `product-${uuidv4()}`,
        title: site.name || title,
        description: description,
        url: site.url,
        source: new URL(site.url).hostname,
        category: site.category,
        bodyPlacement: this.determineBodyPlacement(bodyText),
        sensoryInputs: this.determineSensoryInputs(bodyText),
        features: features,
        price: price,
        isAlwaysOn: isAlwaysOn,
        timestamp: existingProductIndex >= 0 ? products[existingProductIndex].timestamp : Date.now(),
        lastUpdated: Date.now()
      };
      
      if (existingProductIndex >= 0) {
        // Update existing product
        products[existingProductIndex] = {
          ...products[existingProductIndex],
          ...product
        };
        
        console.log(`Updated product: ${product.title}`);
      } else {
        // Add new product
        products.push(product);
        
        console.log(`Added new product: ${product.title}`);
        
        // Send notification
        this.sendNotification({
          title: 'New Wearable AI Product Added',
          message: `Added ${product.title} to the database`,
          source: new URL(site.url).hostname,
          url: site.url
        });
      }
      
      // Save updated products
      this.store.set('products', products);
      
    } catch (error) {
      console.error(`Error scraping ${site.url}:`, error);
      throw error;
    }
  }

  // Check if text is about wearable AI
  isAboutWearableAI(text) {
    const lowerText = text.toLowerCase();
    return this.wearableAIKeywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
  }

  // Determine product category
  determineCategory(text) {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('glasses') || lowerText.includes('ar') || lowerText.includes('vr')) {
      return 'Smart Glasses';
    } else if (lowerText.includes('watch')) {
      return 'Smartwatch';
    } else if (lowerText.includes('ring')) {
      return 'Smart Ring';
    } else if (lowerText.includes('earbuds') || lowerText.includes('headphones')) {
      return 'Smart Earwear';
    } else if (lowerText.includes('pin') || lowerText.includes('clip') || lowerText.includes('badge')) {
      return 'AI Assistant';
    } else if (lowerText.includes('health') || lowerText.includes('fitness') || lowerText.includes('medical')) {
      return 'Health Monitor';
    } else {
      return 'Wearable AI';
    }
  }

  // Determine body placement
  determineBodyPlacement(text) {
    const lowerText = text.toLowerCase();
    
    for (const [placement, keywords] of Object.entries(this.bodyPlacementKeywords)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          return placement;
        }
      }
    }
    
    return 'Unknown';
  }

  // Determine sensory inputs
  determineSensoryInputs(text) {
    const lowerText = text.toLowerCase();
    const inputs = [];
    
    for (const [input, keywords] of Object.entries(this.sensoryInputKeywords)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          if (!inputs.includes(input)) {
            inputs.push(input);
          }
          break;
        }
      }
    }
    
    return inputs.length > 0 ? inputs : ['Unknown'];
  }

  // Extract features from text
  extractFeatures(text) {
    const lowerText = text.toLowerCase();
    const features = [];
    
    const featureKeywords = [
      'voice assistant', 'health monitoring', 'fitness tracking', 'sleep tracking', 
      'heart rate', 'camera', 'microphone', 'gps', 'bluetooth', 'wifi', 
      'waterproof', 'battery life', 'always-on', 'touch control', 'gesture control',
      'notification', 'app', 'ai assistant', 'machine learning', 'neural',
      'augmented reality', 'virtual reality', 'mixed reality'
    ];
    
    featureKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        features.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    });
    
    return features;
  }

  // Check if device is always-on
  isAlwaysOn(text) {
    const lowerText = text.toLowerCase();
    return lowerText.includes('always on') || 
           lowerText.includes('always-on') || 
           lowerText.includes('continuous monitoring') ||
           lowerText.includes('24/7') ||
           lowerText.includes('all day');
  }

  // Send notification about new product
  sendNotification(data) {
    const settings = this.store.get('settings');
    
    if (settings.notificationsEnabled && this.mainWindow) {
      this.mainWindow.webContents.send('new-product-found', {
        title: data.title,
        message: data.message,
        site: data.source,
        url: data.url,
        timestamp: Date.now()
      });
      
      console.log(`Notification sent: ${data.message}`);
    }
  }

  // Manually trigger scraping of a specific URL
  async scrapeUrl(url) {
    try {
      console.log(`Manually scraping URL: ${url}`);
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });
      
      const $ = cheerio.load(response.data);
      
      // Extract basic information
      const title = $('title').text().trim();
      const description = $('meta[name="description"]').attr('content') || '';
      const h1s = $('h1').map((i, el) => $(el).text().trim()).get();
      const h2s = $('h2').map((i, el) => $(el).text().trim()).get();
      const bodyText = $('body').text().toLowerCase();
      
      // Try to extract price information
      const priceText = bodyText.match(/(\$\d+(\.\d{2})?)|(\d+\s*\$)/g) || [];
      const price = priceText.length > 0 ? priceText[0] : 'Unknown';
      
      // Extract features
      const features = this.extractFeatures(bodyText);
      
      // Determine if it's always-on
      const isAlwaysOn = this.isAlwaysOn(bodyText);
      
      // Create product object
      const product = {
        id: `product-${uuidv4()}`,
        title: title,
        description: description || h1s[0] || 'No description available',
        url: url,
        source: new URL(url).hostname,
        headings: [...h1s, ...h2s],
        category: this.determineCategory(title + ' ' + description + ' ' + bodyText),
        bodyPlacement: this.determineBodyPlacement(bodyText),
        sensoryInputs: this.determineSensoryInputs(bodyText),
        features: features,
        price: price,
        isAlwaysOn: isAlwaysOn,
        timestamp: Date.now(),
        lastUpdated: Date.now()
      };
      
      // Store the scraped data
      const products = this.store.get('products');
      const scrapedUrls = this.store.get('scrapedUrls');
      
      // Check if product with similar title already exists
      const existingProductIndex = products.findIndex(p => 
        p.title.toLowerCase() === title.toLowerCase() || 
        p.url === url
      );
      
      if (existingProductIndex >= 0) {
        // Update existing product
        products[existingProductIndex] = {
          ...products[existingProductIndex],
          ...product,
          lastUpdated: Date.now()
        };
        
        console.log(`Updated existing product: ${title}`);
      } else {
        // Add new product
        products.push(product);
        
        console.log(`Added new product: ${title}`);
        
        // Send notification
        this.sendNotification({
          title: 'New Wearable AI Product Added',
          message: `Added ${title} to the database`,
          source: new URL(url).hostname,
          url: url
        });
      }
      
      // Add to scraped URLs if not already there
      if (!scrapedUrls.includes(url)) {
        scrapedUrls.push(url);
        this.store.set('scrapedUrls', scrapedUrls);
      }
      
      this.store.set('products', products);
      this.store.set('lastScrape', Date.now());
      
      return product;
      
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      throw error;
    }
  }
}

module.exports = WebScraperService;
