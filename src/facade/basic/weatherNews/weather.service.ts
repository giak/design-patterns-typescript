import axios from 'axios';
import { WeatherServiceInterface, WeatherDataInterface } from './weather.interface';

const OPENWEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
export class WeatherService implements WeatherServiceInterface {
  private apiKey: string;
  private baseUrl = OPENWEATHER_API_URL;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getWeather(city: string): Promise<WeatherDataInterface> {
    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: { q: city, appid: this.apiKey },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }
}
