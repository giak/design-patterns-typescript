interface SensorDataInterface {
  timestamp: string;
  temperature?: number;
  pressure?: number;
  humidity?: number;
}

interface SensorObserverInterface {
  next: (value: SensorDataInterface) => void;
  error?: (error: Error) => void;
  complete?: () => void;
}

function createSensorDataObservable() {
  return {
    subscribe: (observer: SensorObserverInterface) => {
      const intervalId = setInterval(() => {
        const sensorData = {
          timestamp: new Date().toISOString(),
          temperature: Math.random() * 30 + 10,
          humidity: Math.random() * 50 + 30,
          pressure: Math.random() * 10 + 1000,
        };

        observer.next(sensorData);
      }, 2000);

      return {
        unsubscribe: () => {
          clearInterval(intervalId);
          observer.complete?.();
        },
      };
    },
  };
}

const sensorObservable = createSensorDataObservable();
const subscription = sensorObservable.subscribe({
  next: (data) =>
    console.log(
      `Température: ${data.temperature?.toFixed(1)}°C, Humidité: ${data.humidity?.toFixed(1)}%, Pression: ${data.pressure?.toFixed(1)} hPa`,
    ),
  error: (err) => console.error('Erreur:', err),
  complete: () => console.log('Flux de données terminé'),
});

// Arrêt du flux après 10 secondes
setTimeout(() => {
  subscription.unsubscribe();
}, 10000);

export {};
