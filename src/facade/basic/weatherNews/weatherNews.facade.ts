import { WeatherServiceInterface, NewsServiceInterface, WeatherDataInterface } from './weather.interface';
import { NewsService } from './news.service';
import { WeatherService } from './weather.service';

const ZERO_DEGREE_CELSIUS = 273.15;

export class ApiFacade {
  private weatherService: WeatherServiceInterface;
  private newsService: NewsServiceInterface;

  constructor(apiKey: string) {
    this.weatherService = new WeatherService(apiKey);
    this.newsService = new NewsService();
  }

  async getCityWeatherAndNews(city: string, newsTopic: string): Promise<string> {
    try {
      const weatherData: WeatherDataInterface = await this.weatherService.getWeather(city);
      const degree = Math.round(weatherData.main.temp - ZERO_DEGREE_CELSIUS);
      const news = await this.newsService.getLatestNews(newsTopic);
      return `Weather in ${city}: ${weatherData.weather[0].main}, ${degree} degrees\nNews about ${newsTopic}: ${news}`;
    } catch (error) {
      console.error('Error fetching city weather and news:', error);
      throw error;
    }
  }
}
