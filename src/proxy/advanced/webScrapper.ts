// Use Case: Web Scraping with Proxy and Data Extraction (Realistic Example)

import axios from 'axios';
import * as cheerio from 'cheerio';

// Interface describing a web scraper with data extraction
interface DataExtractorInterface {
  extractPrices(html: string): number[];
}

// Implementation of the data extractor
class DataExtractor implements DataExtractorInterface {
  extractPrices(html: string): number[] {
    const $ = cheerio.load(html);

    // Extracting product prices from a realistic HTML structure
    const prices: number[] = [];

    if ($('.product-wrapper').length > 0) {
      $('.product-wrapper').each((index, element) => {
        const product = $(element);
        const priceString = product.find('.price').text().trim();

        try {
          prices.push(this.parsePrice(priceString));
        } catch (error) {
          console.error(`Failed to parse price: ${priceString}`);
        }
      });
    } else {
      console.warn('No products found in the HTML document.');
    }

    return prices;
  }

  private parsePrice(priceString: string): number {
    // Handle any non-digit characters except for the decimal separator
    const price = parseFloat(priceString.replace(/[^\d.]/g, ''));
    if (Number.isNaN(price)) {
      throw new Error(`Invalid price format: ${priceString}`);
    }
    return price;
  }
}

// Proxy for web scraping with access control, performance monitoring, and data extraction
class EnhancedWebScrapingProxy {
  private target: DataExtractorInterface = new DataExtractor();

  async scrape(url: string) {
    // Access control logic
    if (!this.isAuthorized(url)) {
      console.log(`Access to ${url} denied. Authorization required.`);
      return;
    }

    // Performance monitoring - Start Timer
    const startTime = Date.now();

    // Actual web scraping - Fetch HTML content using Axios
    const html = await this.retrieveHtml(url);

    // Data extraction
    const prices = this.target.extractPrices(html);

    // Performance monitoring - End Timer
    const endTime = Date.now();
    const executionTime = endTime - startTime;

    console.log(`Scraping and data extraction completed in ${executionTime} milliseconds.`);
    console.log('Extracted Prices:', prices);
  }

  // Simple authorization check (for demonstration purposes)
  private isAuthorized(url: string): boolean {
    // Implement your authorization logic here
    // For demonstration, allow scraping for URLs containing "allowed-ecommerce-site.com"
    return url.includes('webscraper.io');
  }

  // Fetch HTML content using Axios
  private async retrieveHtml(url: string): Promise<string> {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching HTML from ${url}: ${error}`);
      return '';
    }
  }
}

// Using the EnhancedWebScrapingProxy
const enhancedWebScrapingProxy = new EnhancedWebScrapingProxy();

// Attempting to scrape and extract data from an unauthorized site
enhancedWebScrapingProxy.scrape('https://unauthorized-ecommerce-site.com');
// Output: Access to https://unauthorized-ecommerce-site.com denied. Authorization required.

// Attempting to scrape and extract data from an authorized site
enhancedWebScrapingProxy.scrape('https://webscraper.io/test-sites/e-commerce/allinone/computers/laptops');
// Output: Scraping and data extraction completed in X milliseconds.
// Output: Extracted Prices: [19.99, 29.99, 14.99]
