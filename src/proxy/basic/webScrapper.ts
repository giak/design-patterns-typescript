// Use Case: Web Scraping with Proxy

// Interface describing a web scraper
interface WebScraperInterface {
  scrape(url: string): void;
}

// Implementation of the web scraper
class WebScraper implements WebScraperInterface {
  scrape(url: string) {
    // Simulating web scraping logic
    console.log(`Scraping data from ${url}`);
  }
}

// Proxy for web scraping with access control and performance monitoring
class WebScrapingProxy implements WebScraperInterface {
  private target: WebScraper = new WebScraper();

  scrape(url: string) {
    // Access control logic
    if (!this.isAuthorized(url)) {
      console.log(`Access to ${url} denied. Authorization required.`);
      return;
    }

    // Performance monitoring - Start Timer
    const startTime = Date.now();

    // Actual web scraping
    this.target.scrape(url);

    // Performance monitoring - End Timer
    const endTime = Date.now();
    const executionTime = endTime - startTime;

    console.log(`Scraping completed in ${executionTime} milliseconds.`);
  }

  // Simple authorization check (for demonstration purposes)
  private isAuthorized(url: string): boolean {
    // Implement your authorization logic here
    // For demonstration, allow scraping for URLs containing "allowed-site.com"
    return url.includes('allowed-site.com');
  }
}

// Using the WebScrapingProxy
const webScrapingProxy = new WebScrapingProxy();

// Attempting to scrape from an unauthorized site
webScrapingProxy.scrape('unauthorized-site.com');
// Output: Access to unauthorized-site.com denied. Authorization required.

// Attempting to scrape from an authorized site
webScrapingProxy.scrape('allowed-site.com');
// Output: Scraping data from allowed-site.com
// Output: Scraping completed in X milliseconds.
