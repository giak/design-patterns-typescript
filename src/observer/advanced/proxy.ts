// Type for the Observer function
type Observer<T> = (state: T) => void;

// Subject class (observable)
class Subject<T extends object> {
  private observers: Set<Observer<T>> = new Set();

  // Register an observer
  public addObserver(observer: Observer<T>): void {
    this.observers.add(observer);
  }

  // Unregister an observer
  public removeObserver(observer: Observer<T>): void {
    this.observers.delete(observer);
  }

  // Notify all observers about the state change
  private notify(state: T): void {
    for (const observer of this.observers) {
      observer(state);
    }
  }

  // Create a proxy to observe the state changes
  public createObservable(initialState: T): T {
    return new Proxy(initialState, {
      set: (target, property, value) => {
        const result = Reflect.set(target, property, value);
        this.notify(target);
        return result;
      },
      deleteProperty: (target, property) => {
        const result = Reflect.deleteProperty(target, property);
        this.notify(target);
        return result;
      },
    });
  }
}

// Example usage:

// Define the state type
interface State {
  count: number;
  message: string;
}

// Create a subject instance
const subject = new Subject<State>();

// Create an observable state
const state = subject.createObservable({ count: 0, message: 'Hello' });

// Add observers
subject.addObserver((newState) => {
  console.log('Observer 1:', newState);
});

subject.addObserver((newState) => {
  console.log('Observer 2:', newState);
});

// Modify the state
state.count += 1;
state.message = 'Hello, World!';
state.count += 1;
state.message = 'Hello the World !';
state.count = 0;

