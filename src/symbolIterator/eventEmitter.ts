type Listener = (...args: any[]) => void;

class IterableEventEmitter {
  private events: Map<string, Set<Listener>> = new Map();
  private eventQueue: Array<{ event: string; args: any[] }> = [];

  on(event: string, listener: Listener): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(listener);
  }

  off(event: string, listener: Listener): void {
    if (this.events.has(event)) {
      this.events.get(event)!.delete(listener);
    }
  }

  emit(event: string, ...args: any[]): void {
    if (this.events.has(event)) {
      for (const listener of this.events.get(event)!) {
        listener(...args);
      }
    }
    this.eventQueue.push({ event, args });
  }

  [Symbol.iterator](): Iterator<{ event: string; args: any[] }> {
    let index = 0;
    const queue = this.eventQueue;

    return {
      next(): IteratorResult<{ event: string; args: any[] }> {
        if (index < queue.length) {
          return { value: queue[index++], done: false };
        } else {
          return { value: undefined, done: true };
        }
      },
    };
  }

  // Méthode pour vider la file d'événements
  clearEventQueue(): void {
    this.eventQueue = [];
  }
}

// Exemple d'utilisation
const emitter = new IterableEventEmitter();

// Ajout d'écouteurs d'événements
emitter.on("event1", (data) => console.log("Event 1 occurred:", data));
emitter.on("event2", (data1, data2) =>
  console.log("Event 2 occurred:", data1, data2)
);

// Émission d'événements
emitter.emit("event1", "Hello");
emitter.emit("event2", "World", "!");
emitter.emit("event1", "TypeScript");

// Itération sur les événements émis
console.log("Iterating over emitted events:");
for (const { event, args } of emitter) {
  console.log(`Event: ${event}, Arguments:`, args);
}

// Vider la file d'événements
emitter.clearEventQueue();

// Émettre de nouveaux événements
emitter.emit("event1", "New event");

// Itérer à nouveau
console.log("Iterating after clearing and emitting new event:");
for (const { event, args } of emitter) {
  console.log(`Event: ${event}, Arguments:`, args);
}

export type {};
