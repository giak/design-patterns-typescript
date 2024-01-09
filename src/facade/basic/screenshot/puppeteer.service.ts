import puppeteer, { Browser, Page } from 'puppeteer';

export class PuppeteerService {
  private browser: Browser | null = null;

  async init(): Promise<void> {
    try {
      this.browser = await puppeteer.launch();
    } catch (error) {
      console.error('Error launching browser:', error);
    }
  }

  async newPage(): Promise<Page | undefined> {
    if (!this.browser) {
      await this.init();
    }
    try {
      return this.browser ? await this.browser.newPage() : Promise.reject('Browser not initialized');
    } catch (error) {
      console.error('Error creating new page:', error);
    }
    return undefined;
  }

  async close(): Promise<void> {
    if (this.browser) {
      try {
        await this.browser.close();
        this.browser = null;
      } catch (error) {
        console.error('Error closing browser:', error);
      }
    }
  }
}