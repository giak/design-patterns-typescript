import type { Observable } from 'rxjs';

/**
 * Types de capteurs supportés par le système IoT.
 */
export type SensorType = 'temperature' | 'humidity' | 'pressure';

/**
 * Interface de base pour les lectures de capteurs.
 */
export interface BaseReadingInterface {
  type: SensorType;
  timestamp: number;
}

/**
 * Interface pour les lectures brutes des capteurs.
 */
export interface SensorReadingInterface extends BaseReadingInterface {
  id: string;
  value: number;
}

/**
 * Interface pour les lectures agrégées des capteurs.
 */
export interface AggregatedReadingInterface extends BaseReadingInterface {
  average: number;
  min: number;
  max: number;
  count: number;
}

/**
 * Interface de configuration pour les capteurs.
 */
export interface SensorConfigInterface {
  baseValue: number;
  noise: number;
  trend: number;
  interval: number;
  minValue: number;
  maxValue: number;
}

/**
 * Interface pour le service de capteurs IoT.
 */
export interface IoTSensorServiceInterface<T extends BaseReadingInterface> {
  getSensorStream(): Observable<T>;
  simulateSensorReadings(): void;
  endSimulation(): void;
}

/**
 * Interface pour le formateur de données.
 */
export interface DataFormatterInterface<T extends BaseReadingInterface> {
  formatWithEmojis(aggregatedData: T[]): string;
}

/**
 * Interface pour le simulateur de capteurs.
 */
export interface SensorSimulatorInterface<T extends BaseReadingInterface> {
  createSensor(type: SensorType): Observable<T>;
}

/**
 * Interface pour la factory de services IoT.
 */
export interface IoTSensorServiceFactoryInterface {
  createSensorService(): IoTSensorServiceInterface<SensorReadingInterface>;
  createDataFormatter(): DataFormatterInterface<AggregatedReadingInterface>;
}
