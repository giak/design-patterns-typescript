type ObserverType<T> = {
  next: (value: T) => void;
  error?: (error: Error) => void;
  complete?: () => void;
};

function createProducer<T>() {
  const observers = new Set<ObserverType<T>>();
  return {
    subscribe: (observer: ObserverType<T>) => {
      observers.add(observer);
      return {
        unsubscribe: () => observers.delete(observer),
      };
    },
    notify: (data: T) => {
      for (const observer of observers) {
        observer.next(data);
      }
    },
  };
}

const producer = createProducer();
producer.subscribe({
  next: (data) => console.log('Consumer 1:', data),
});
producer.subscribe({
  next: (data) => console.log('Consumer 2:', data),
});

producer.notify('Hello, Observers!');

export {};
