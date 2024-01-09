import { NewsServiceInterface } from './weather.interface';

export class NewsService implements NewsServiceInterface {
  async getLatestNews(topic: string): Promise<string> {
    // Imagine calling an external news API here
    return `Latest news on ${topic}`;
  }
}
