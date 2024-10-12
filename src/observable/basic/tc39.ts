interface Observer<T> {
  next: (value: T) => void;
  error: (err: unknown) => void;
  complete: () => void;
}

const observable = new Observable<number>((observer: Observer<number>) => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  setTimeout(() => {
    observer.next(4);
    observer.complete();
  }, 1000);
});

// Souscription à l'Observable
observable.subscribe({
  next(x: number) {
    console.log(`got value ${x}`);
  },
  error(err: unknown) {
    console.error(`something wrong occurred: ${err}`);
  },
  complete() {
    console.log('done');
  },
});

export {};
