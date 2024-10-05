import { BehaviorSubject, type Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

/**
 * Interface représentant l'état du compteur.
 * @property {number} count - La valeur actuelle du compteur, en lecture seule.
 */
interface CounterStateInterface {
  readonly count: number;
}

/**
 * Énumération des types d'événements possibles pour le compteur.
 * Définit les actions que le compteur peut effectuer.
 */
enum CounterEventEnum {
  INCREMENT = 'INCREMENT',
  DECREMENT = 'DECREMENT',
  RESET = 'RESET',
}

/**
 * Type conditionnel pour les payloads d'événements.
 * Définit la structure du payload pour chaque type d'événement.
 * @template T - Le type d'événement du compteur.
 */
type EventPayloadType<T extends CounterEventEnum> = T extends CounterEventEnum.INCREMENT | CounterEventEnum.DECREMENT
  ? { amount: number }
  : T extends CounterEventEnum.RESET
    ? { type: CounterEventEnum.RESET }
    : never;

/**
 * Type d'union discriminée pour les événements du compteur avec payload.
 * Combine le type d'événement avec son payload correspondant.
 */
type CounterEventType = {
  [K in CounterEventEnum]: { type: K } & EventPayloadType<K>;
}[CounterEventEnum];

/**
 * État initial du compteur avec const assertion.
 * Définit la valeur initiale du compteur à 0.
 */
const INITIAL_STATE = { count: 0 } as const;

/**
 * Décorateur de journalisation pour les méthodes.
 * Enregistre les appels de méthode avec leurs arguments.
 * @param {object} target - La classe cible.
 * @param {string} propertyKey - Le nom de la méthode.
 * @param {PropertyDescriptor} descriptor - Le descripteur de la propriété.
 * @returns {PropertyDescriptor} Le descripteur modifié.
 */
function log(target: object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const originalMethod = descriptor.value;
  descriptor.value = function (this: unknown, ...args: unknown[]) {
    console.log(`Calling ${propertyKey} with args: ${JSON.stringify(args)}`);
    return originalMethod.apply(this, args);
  };
  return descriptor;
}

/**
 * Classe BLoC (Business Logic Component) pour gérer l'état du compteur.
 * Implémente le pattern BLoC pour la gestion d'état réactive.
 */
class CounterBloc implements Iterable<CounterStateInterface> {
  private readonly state$: BehaviorSubject<CounterStateInterface>;
  private history: CounterStateInterface[] = [];

  /**
   * Crée une instance de CounterBloc.
   * @param {CounterStateInterface} initialState - L'état initial du compteur.
   */
  constructor(initialState: CounterStateInterface = INITIAL_STATE) {
    this.state$ = new BehaviorSubject<CounterStateInterface>(initialState);
    this.history.push(initialState);
  }

  /**
   * Obtient l'état actuel du compteur.
   * @returns {Readonly<CounterStateInterface>} L'état actuel en lecture seule.
   */
  get currentState(): Readonly<CounterStateInterface> {
    return this.state$.value;
  }

  /**
   * Retourne un Observable de l'état complet du compteur.
   * @returns {Observable<Readonly<CounterStateInterface>>} Observable de l'état.
   */
  getState$(): Observable<Readonly<CounterStateInterface>> {
    return this.state$.asObservable();
  }

  /**
   * Retourne un Observable de la valeur du compteur.
   * @returns {Observable<number>} Observable de la valeur du compteur.
   */
  getCount$(): Observable<number> {
    return this.state$.pipe(
      map((state) => state.count),
      distinctUntilChanged(),
    );
  }

  /**
   * Dispatche un événement pour modifier l'état du compteur.
   * @param {CounterEventType} event - L'événement à dispatcher.
   */
  @log
  dispatch(event: CounterEventType): void {
    const currentState = this.currentState;
    const newState = this.reduceState(currentState, event);
    this.state$.next(newState);
    this.history.push(newState);
  }

  /**
   * Réduit l'état en fonction de l'événement reçu.
   * @param {CounterStateInterface} state - L'état actuel.
   * @param {CounterEventType} event - L'événement à traiter.
   * @returns {CounterStateInterface} Le nouvel état.
   */
  private reduceState(state: CounterStateInterface, event: CounterEventType): CounterStateInterface {
    switch (event.type) {
      case CounterEventEnum.INCREMENT:
        return { ...state, count: state.count + event.amount };
      case CounterEventEnum.DECREMENT:
        return { ...state, count: state.count - event.amount };
      case CounterEventEnum.RESET:
        return { count: 0 };
      default:
        return state;
    }
  }

  /**
   * Implémente l'interface Iterable pour permettre l'itération sur l'historique des états.
   * @returns {Iterator<CounterStateInterface>} Un itérateur sur l'historique des états.
   */
  *[Symbol.iterator](): Iterator<CounterStateInterface> {
    yield* this.history;
  }
}

/**
 * Type pour les créateurs d'actions typées.
 * Définit la signature des fonctions de création d'actions pour chaque type d'événement.
 */
type ActionCreatorsType = {
  [K in CounterEventEnum]: K extends CounterEventEnum.INCREMENT | CounterEventEnum.DECREMENT
    ? (amount: number) => CounterEventType
    : () => CounterEventType;
};

/**
 * Crée et retourne les créateurs d'actions typées.
 * @returns {ActionCreatorsType} Les créateurs d'actions.
 */
const createActions = (): ActionCreatorsType => ({
  INCREMENT: (amount: number) => ({ type: CounterEventEnum.INCREMENT, amount }),
  DECREMENT: (amount: number) => ({ type: CounterEventEnum.DECREMENT, amount }),
  RESET: () => ({ type: CounterEventEnum.RESET }),
});

// Exemple d'utilisation
const counterBloc = new CounterBloc();
const actions = createActions();

const subscription = counterBloc.getCount$().subscribe((count) => {
  console.log(`Current count: ${count}`);
});

counterBloc.dispatch(actions.INCREMENT(1));
counterBloc.dispatch(actions.INCREMENT(2));
counterBloc.dispatch(actions.DECREMENT(1));
counterBloc.dispatch(actions.RESET());

// Itération sur l'historique des états
for (const state of counterBloc) {
  console.log(`Historical state: ${JSON.stringify(state)}`);
}

subscription.unsubscribe();

/**
 * Type utilitaire pour rendre mutable un type en lecture seule.
 * @template T - Le type à rendre mutable.
 */
type MutableType<T> = {
  -readonly [P in keyof T]: T[P];
};

/**
 * Version mutable de l'interface CounterStateInterface.
 */
type MutableCounterState = MutableType<CounterStateInterface>;

// Note: Ce code implémente un pattern BLoC amélioré avec des fonctionnalités TypeScript 5.5 avancées.
