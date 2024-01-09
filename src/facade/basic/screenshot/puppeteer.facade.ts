import { PuppeteerService } from './puppeteer.service';
import { Page } from 'puppeteer';

export class PuppeteerFacade {
  private puppeteerService: PuppeteerService = new PuppeteerService();

  async setup(): Promise<void> {
    await this.puppeteerService.init();
  }

  private async getPageWithUrl(url: string): Promise<Page> {
    const page: Page | undefined = await this.puppeteerService.newPage();
    if (!page) {
      throw new Error('Failed to create new page');
    }
    await page.goto(url, { waitUntil: 'networkidle0' });
    return page;
  }

  async takeScreenshot(url: string, path: string): Promise<void> {
    try {
      const page = await this.getPageWithUrl(url);
      await page.screenshot({ path, fullPage: true });
      await page.close();
    } catch (error) {
      console.error('Error taking screenshot:', error);
    }
  }

  async getContent(url: string): Promise<string | undefined> {
    try {
      const page = await this.getPageWithUrl(url);
      const content = await page.content();
      await page.close();
      return content;
    } catch (error) {
      console.error('Error getting content:', error);
    }
    return undefined;
  }

  async teardown(): Promise<void> {
    await this.puppeteerService.close();
  }
}
