interface WeatherInterface {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface MainInterface {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

interface WindInterface {
  speed: number;
  deg: number;
}

interface CloudsInterface {
  all: number;
}

interface SysInterface {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface WeatherDataInterface {
  coord: { lon: number; lat: number };
  weather: WeatherInterface[];
  base: string;
  main: MainInterface;
  visibility: number;
  wind: WindInterface;
  clouds: CloudsInterface;
  dt: number;
  sys: SysInterface;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface WeatherServiceInterface {
  getWeather(city: string): Promise<WeatherDataInterface>;
}

export interface NewsServiceInterface {
  getLatestNews(topic: string): Promise<string>;
}
