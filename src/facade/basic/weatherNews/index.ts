import dotenv from 'dotenv';
import { ApiFacade } from './weatherNews.facade';

dotenv.config();

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || '';

if (!OPENWEATHER_API_KEY) {
  console.error('Please set the OpenWeather API key in the environment variables.');
  process.exit(1);
}

async function showWeatherAndNews() {
  const apiFacade = new ApiFacade(OPENWEATHER_API_KEY);
  return await apiFacade.getCityWeatherAndNews('Paris', 'technology');
}

showWeatherAndNews()
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
