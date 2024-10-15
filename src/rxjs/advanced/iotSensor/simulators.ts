import { type Observable, timer } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SENSOR_CONFIG } from './config';
import { SensorError } from './errors';
import type { SensorReadingInterface, SensorSimulatorInterface, SensorType } from './types';

/**
 * Classe pour simuler les lectures de capteurs.
 */
export class DefaultSensorSimulator implements SensorSimulatorInterface<SensorReadingInterface> {
  createSensor(type: SensorType): Observable<SensorReadingInterface> {
    const config = SENSOR_CONFIG[type];

    return timer(0, config.interval).pipe(
      map((tick) => {
        const trendValue = Math.sin(tick / 100) * config.trend;
        const noiseValue = (Math.random() - 0.5) * 2 * config.noise;
        const value = config.baseValue + trendValue + noiseValue;
        const perturbation = Math.random() > 0.95 ? (Math.random() - 0.5) * 10 : 0;

        return {
          id: `sensor-${type}-${Math.floor(Math.random() * 1000)}`,
          type,
          value: this.clampValue(type, value + perturbation),
          timestamp: Date.now(),
        };
      }),
      catchError((error) => {
        throw new SensorError(`Error creating sensor ${type}: ${error.message}`);
      }),
    );
  }

  private clampValue(type: SensorType, value: number): number {
    const { minValue, maxValue } = SENSOR_CONFIG[type];
    return Math.max(minValue, Math.min(maxValue, value));
  }
}
