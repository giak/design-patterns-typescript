import { BehaviorSubject, Observable, merge, of } from 'rxjs';
import {
  bufferTime,
  catchError,
  concatMap,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  retry,
  shareReplay,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { ProcessingError } from './errors';
import { EmojiDataFormatter } from './formatters';
import { IoTSensorService } from './services';
import { DefaultSensorSimulator } from './simulators';
import type {
  AggregatedReadingInterface,
  IoTSensorServiceFactoryInterface,
  IoTSensorServiceInterface,
  SensorReadingInterface,
  SensorType,
} from './types';
import {
  aggregateReadings,
  createInitialState,
  filterOutliers,
  logAggregatedState,
  updateStateWithNewAggregations,
} from './utils';

/**
 * Implémentation par défaut de la factory de services IoT.
 */
class DefaultIoTSensorServiceFactory implements IoTSensorServiceFactoryInterface {
  createSensorService(): IoTSensorServiceInterface<SensorReadingInterface> {
    const simulator = new DefaultSensorSimulator();
    return new IoTSensorService(simulator);
  }

  createDataFormatter(): EmojiDataFormatter {
    return new EmojiDataFormatter();
  }
}

/**
 * Traite les données des capteurs et retourne un Observable d'états agrégés.
 * @template T
 * @param {IoTSensorServiceInterface<T>} sensorService - Service de capteurs IoT
 * @returns {Observable<Record<SensorType, AggregatedReadingInterface>>} Observable d'états agrégés
 */
function processSensorData<T extends SensorReadingInterface>(
  sensorService: IoTSensorServiceInterface<T>,
): Observable<Record<SensorType, AggregatedReadingInterface>> {
  const initialState = createInitialState<T>();
  const stateSubject = new BehaviorSubject<Record<SensorType, AggregatedReadingInterface>>(initialState);

  return sensorService.getSensorStream().pipe(
    retry(3),
    filter((reading): reading is T => filterOutliers(reading)),
    bufferTime(5000),
    filter((readings): readings is T[] => readings.length > 0),
    concatMap((readings) =>
      of(readings).pipe(
        withLatestFrom(stateSubject),
        map(([readings, currentState]) => {
          const newAggregations = aggregateReadings(readings);
          return updateStateWithNewAggregations(currentState, newAggregations);
        }),
      ),
    ),
    debounceTime(100),
    distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
    tap(logAggregatedState),
    tap((state) => stateSubject.next(state)),
    catchError((error) => {
      console.error('Error processing sensor data:', error);
      return new Observable<never>((observer) => {
        observer.error(new ProcessingError(`Data processing error: ${error.message}`));
      });
    }),
    shareReplay(1),
  ) as Observable<Record<SensorType, AggregatedReadingInterface>>;
}

/**
 * Démarre le traitement des données IoT.
 * @param {IoTSensorServiceFactoryInterface} factory - Factory pour créer les services nécessaires
 */
function startIoTDataProcessing(factory: IoTSensorServiceFactoryInterface): void {
  const sensorService = factory.createSensorService();
  const dataFormatter = factory.createDataFormatter();

  const processedData$ = processSensorData(sensorService);

  const cloudService$ = processedData$.pipe(
    debounceTime(1000),
    concatMap((aggregatedState) => {
      return new Observable<string>((observer) => {
        try {
          const formattedData = dataFormatter.formatWithEmojis(Object.values(aggregatedState));
          observer.next(`📡 Data sent to cloud:\n${formattedData}`);
          observer.complete();
        } catch (error) {
          observer.error(new Error(`Cloud service error: ${error instanceof Error ? error.message : String(error)}`));
        }
      });
    }),
    retry(2),
    catchError((error) => {
      console.error('Error sending data to cloud:', error);
      return of('❌ Failed to send data to cloud');
    }),
  );

  merge(
    processedData$.pipe(
      debounceTime(5000),
      map(() => '🔄 Data processed'),
    ),
    cloudService$,
  ).subscribe({
    next: (message) => console.log(message),
    error: (error) => console.error('❌ Error in data processing pipeline:', error),
    complete: () => console.log('✅ Data processing completed'),
  });

  sensorService.simulateSensorReadings();
}

// Exécution
const factory = new DefaultIoTSensorServiceFactory();
startIoTDataProcessing(factory);
