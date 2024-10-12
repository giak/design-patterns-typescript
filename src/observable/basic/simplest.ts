type ObserverType<T> = {
  next: (value: T) => void;
  error?: (error: Error) => void;
  complete?: () => void;
};

function createObservable() {
  return {
    subscribe: (observer: ObserverType<Date>) => {
      const intervalId = setInterval(() => {
        observer.next(new Date());
      }, 1000);

      return {
        unsubscribe: () => {
          clearInterval(intervalId);
        },
      };
    },
  };
}

const timeObservable = createObservable();
const subscription = timeObservable.subscribe({
  next: (value: Date) => console.log('Date reçue:', value.toLocaleString()),
  error: (err) => console.error('Erreur:', err),
  complete: () => console.log('Observable terminé'),
});

setTimeout(() => {
  console.log('Unsubscribing...');
  subscription.unsubscribe();
}, 5000);

export {};
