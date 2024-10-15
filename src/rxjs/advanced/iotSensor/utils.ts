import { SENSOR_CONFIG } from './config';
import type { AggregatedReadingInterface, BaseReadingInterface, SensorReadingInterface, SensorType } from './types';

/**
 * Initialise une lecture agrégée à partir d'une lecture de base.
 */
export function initializeAggregatedReading<T extends BaseReadingInterface>(
  reading: T,
): AggregatedReadingInterface & { sum: number } {
  return {
    type: reading.type,
    sum: 0,
    min: Number.POSITIVE_INFINITY,
    max: Number.NEGATIVE_INFINITY,
    count: 0,
    timestamp: reading.timestamp,
    average: 0,
  };
}

/**
 * Met à jour une lecture agrégée avec une nouvelle lecture.
 */
export function updateAggregatedReading<T extends BaseReadingInterface & { value: number }>(
  agg: AggregatedReadingInterface & { sum: number },
  reading: T,
): void {
  agg.sum += reading.value;
  agg.min = Math.min(agg.min, reading.value);
  agg.max = Math.max(agg.max, reading.value);
  agg.count++;
  agg.timestamp = Math.max(agg.timestamp, reading.timestamp);
}

/**
 * Agrège un ensemble de lectures.
 */
export function aggregateReadings<T extends BaseReadingInterface & { value: number }>(
  readings: T[],
): AggregatedReadingInterface[] {
  const aggregated = readings.reduce(
    (acc, reading) => {
      if (!acc[reading.type]) {
        acc[reading.type] = initializeAggregatedReading(reading);
      }
      updateAggregatedReading(acc[reading.type], reading);
      return acc;
    },
    {} as Record<SensorType, AggregatedReadingInterface & { sum: number }>,
  );

  return Object.values(aggregated).map(({ sum, ...rest }) => ({
    ...rest,
    average: sum / rest.count,
  }));
}

/**
 * Filtre les valeurs aberrantes des lectures de capteurs.
 */
export function filterOutliers<T extends SensorReadingInterface>(reading: T): boolean {
  const config = SENSOR_CONFIG[reading.type];
  return reading.value >= config.minValue && reading.value <= config.maxValue;
}

/**
 * Crée l'état initial pour les lectures agrégées.
 */
export function createInitialState<T extends BaseReadingInterface>(): Record<SensorType, AggregatedReadingInterface> {
  return {
    temperature: initializeAggregatedReading({ type: 'temperature' as SensorType, timestamp: 0 } as T),
    humidity: initializeAggregatedReading({ type: 'humidity' as SensorType, timestamp: 0 } as T),
    pressure: initializeAggregatedReading({ type: 'pressure' as SensorType, timestamp: 0 } as T),
  };
}

/**
 * Met à jour l'état avec de nouvelles agrégations.
 */
export function updateStateWithNewAggregations<T extends AggregatedReadingInterface>(
  currentState: Record<SensorType, T>,
  newAggregations: T[],
): Record<SensorType, T> {
  const updatedState = { ...currentState };
  for (const agg of newAggregations) {
    updatedState[agg.type] = agg;
  }
  return updatedState;
}

/**
 * Affiche l'état agrégé dans la console.
 */
export function logAggregatedState<T extends AggregatedReadingInterface>(state: Record<SensorType, T>): void {
  console.log('Aggregated readings:', JSON.stringify(state, null, 2));
}
