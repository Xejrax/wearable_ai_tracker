# Wearable AI Tracker - README

## Overview
Wearable AI Tracker is an interactive Electron application designed to track, analyze, and visualize the latest developments in wearable AI technology. The application features automated web scraping to discover new wearable AI products, comprehensive data visualization, and a notification system to keep users informed about the latest trends and releases.

## Features

### Comprehensive Database
- Tracks wearable AI products with details on body placement, sensory inputs, features, pricing models, and "always-on" capabilities
- Categorizes products by type, body placement, and functionality
- Stores historical data for trend analysis

### Interactive Data Visualization
- Multiple visualization types (charts, graphs, radar plots)
- Organized by categories:
  - Market trends
  - Technology comparison
  - Features analysis
  - Pricing models
  - Adoption rates
  - Regional analysis

### Web Search & Scraping
- Search for new wearable AI products
- Automatically scrape websites to discover emerging technologies
- Add new products to the database from search results

### Automated Background Monitoring
- Scheduled background scraping of popular tech websites
- Continuous updates to the database with the latest wearable AI developments
- Configurable scraping intervals

### Notification System
- Alerts when new products are discovered
- Customizable notification preferences
- Desktop notifications for important updates

### Futuristic UI
- Modern, tech-forward interface
- Glassmorphism effects
- Interactive elements with animations
- Dark mode support

## Technical Details

### Built With
- Electron - Cross-platform desktop application framework
- React - UI library
- TailwindCSS - Styling
- Recharts - Data visualization
- Framer Motion - Animations
- Axios & Cheerio - Web scraping

### Key Components
- **WebScraperService**: Handles automated discovery of new wearable AI products
- **NotificationCenter**: Manages alerts about new discoveries
- **DataVisualization**: Provides interactive charts and graphs
- **Search**: Enables finding products in the database and on the web

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the application:
   ```
   npm start
   ```

### Building for Distribution
To build the application for distribution:

```
# For all platforms
npm run build

# For specific platforms
npm run build:win
npm run build:mac
npm run build:linux
```

## Usage

### Dashboard
The dashboard provides an overview of the wearable AI market, including:
- Latest discoveries
- Market trends
- Product categories
- Technology adoption rates

### Products
Browse and filter the database of wearable AI products by:
- Body placement (head, wrist, finger, etc.)
- Sensory inputs (visual, audio, touch, etc.)
- Features and capabilities
- Pricing models
- "Always-on" monitoring capabilities

### Search
Search for wearable AI products:
- Search the local database
- Search the web for new products
- Add new discoveries to the database

### Web Scraper
Configure and monitor the automated web scraping:
- Set scraping intervals
- Add custom websites to monitor
- View scraping logs and statistics

### Settings
Customize the application:
- Configure notification preferences
- Set dark/light mode
- Manage database backups
- Configure automated scraping settings

## License
MIT
