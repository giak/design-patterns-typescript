function fromEvent<T extends Event>(target: EventTarget, eventName: string) {
  return {
    subscribe: (observer: { next: (event: T) => void }) => {
      const handler = ((event: T) => observer.next(event)) as EventListener;
      target.addEventListener(eventName, handler);
      return {
        unsubscribe: () => target.removeEventListener(eventName, handler),
      };
    },
  };
}

const clickObservable = fromEvent<MouseEvent>(document, 'click');
const subscription = clickObservable.subscribe({
  next: (event: MouseEvent) => console.log('Click at:', event.clientX, event.clientY),
});

// Arrêt du flux après 10 secondes
setTimeout(() => {
  subscription.unsubscribe();
}, 10000);

export {};
