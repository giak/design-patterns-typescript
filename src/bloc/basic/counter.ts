import { Bloc } from './bloc';

/**
 * Interface representing the state of the counter.
 */
interface CounterState {
  /** The current count value. */
  count: number;
}

/**
 * Class representing a Counter Bloc.
 * @extends Bloc<CounterState>
 */
class CounterBloc extends Bloc<CounterState> {
  /**
   * Creates an instance of CounterBloc.
   * Initializes the counter state with a count of 0.
   */
  constructor() {
    super({ count: 0 });
  }

  /**
   * Increments the counter by 1.
   * @returns {Promise<void>} A promise that resolves when the state has been updated.
   */
  increment = () => this.next((_, next) => next({ count: this.value.count + 1 }));

  /**
   * Decrements the counter by 1.
   * @returns {Promise<void>} A promise that resolves when the state has been updated.
   */
  decrement = () => this.next((_, next) => next({ count: this.value.count - 1 }));

  /**
   * Resets the counter to 0.
   * @returns {Promise<void>} A promise that resolves when the state has been updated.
   */
  reset = () => this.next((_, next) => next({ count: 0 }));
}

// Utilisation du CounterBloc
const counter = new CounterBloc();

/**
 * Subscription to the CounterBloc state changes.
 * Logs the current state, errors, and completion.
 */
const subscription = counter.subscribe({
  next: (state) => console.log("État actuel:", state),
  error: (error) => console.error("Erreur:", error),
  complete: () => console.log("Terminé"),
});

/**
 * Asynchronous function to demonstrate the usage of CounterBloc.
 * Performs a series of counter operations and then cleans up.
 */
async function runExample() {
  await counter.increment();
  await counter.increment();
  await counter.decrement();
  await counter.reset();

  // Nettoyage
  subscription.unsubscribe();
  counter.complete();
}

// Run the example
runExample();
