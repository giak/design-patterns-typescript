import type { SensorConfigInterface, SensorType } from './types';

export const SENSOR_CONFIG: Record<SensorType, SensorConfigInterface> = {
  temperature: { baseValue: 20, noise: 0.5, trend: 0.01, interval: 5000, minValue: -30, maxValue: 50 },
  humidity: { baseValue: 50, noise: 1, trend: 0.05, interval: 10000, minValue: 0, maxValue: 100 },
  pressure: { baseValue: 1013, noise: 0.2, trend: 0.02, interval: 15000, minValue: 800, maxValue: 1200 },
};
