import { Observable, Subject, merge } from 'rxjs';
import { catchError, distinctUntilChanged, shareReplay, takeUntil } from 'rxjs/operators';
import { SimulationError } from './errors';
import type { IoTSensorServiceInterface, SensorReadingInterface, SensorSimulatorInterface } from './types';

/**
 * Service principal pour gérer les capteurs IoT.
 */
export class IoTSensorService implements IoTSensorServiceInterface<SensorReadingInterface> {
  private sensorSubject = new Subject<SensorReadingInterface>();
  private stopSimulationSubject = new Subject<void>();
  private sensorStream$: Observable<SensorReadingInterface>;

  constructor(private simulator: SensorSimulatorInterface<SensorReadingInterface>) {
    this.sensorStream$ = this.sensorSubject.asObservable().pipe(
      distinctUntilChanged((prev, curr) => prev.id === curr.id && prev.value === curr.value),
      shareReplay(1),
    );
  }

  public getSensorStream(): Observable<SensorReadingInterface> {
    return this.sensorStream$;
  }

  public simulateSensorReadings(): void {
    const sensorTypes = ['temperature', 'humidity', 'pressure'] as const;
    const sensors = sensorTypes.map((type) => this.simulator.createSensor(type));

    merge(...sensors)
      .pipe(
        takeUntil(this.stopSimulationSubject),
        catchError((error) => {
          console.error('Error in sensor simulation:', error);
          return new Observable<never>((observer) => {
            observer.error(new SimulationError(`Simulation error: ${error.message}`));
          });
        }),
      )
      .subscribe({
        next: (reading) => {
          if (reading) {
            this.sensorSubject.next(reading);
          }
        },
        error: (error) => console.error('Simulation error:', error),
      });
  }

  public endSimulation(): void {
    this.stopSimulationSubject.next();
    this.stopSimulationSubject.complete();
  }
}
