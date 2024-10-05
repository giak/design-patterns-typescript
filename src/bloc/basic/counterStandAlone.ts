import { BehaviorSubject, type Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

/**
 * Interface définissant la structure de l'état du compteur.
 */
interface CounterStateInterface {
  count: number;
}

/**
 * Type union représentant les différents événements possibles pour le compteur.
 */
type CounterEventType = { type: 'INCREMENT' } | { type: 'DECREMENT' } | { type: 'RESET' };

/**
 * Classe implémentant le pattern BLoC (Business Logic Component) pour un compteur.
 * Cette classe gère l'état du compteur et réagit aux événements pour mettre à jour cet état.
 */
class CounterBloc {
  /**
   * BehaviorSubject stockant l'état actuel du compteur.
   * BehaviorSubject est utilisé car il maintient toujours une valeur courante et émet cette valeur
   * immédiatement aux nouveaux abonnés.
   */
  private state$: BehaviorSubject<CounterStateInterface>;

  /**
   * Constructeur initialisant l'état du compteur.
   * @param initialState - L'état initial du compteur (par défaut à 0).
   */
  constructor(initialState: CounterStateInterface = { count: 0 }) {
    this.state$ = new BehaviorSubject(initialState);
  }

  /**
   * Getter retournant l'état actuel du compteur.
   * @returns L'état actuel du compteur.
   */
  get currentState(): CounterStateInterface {
    return this.state$.value;
  }

  /**
   * Méthode retournant un Observable de l'état complet du compteur.
   * @returns Un Observable émettant la valeur actuelle du compteur.
   */
  getState$(): Observable<number> {
    return this.state$.pipe(map((state) => state.count));
  }

  /**
   * Méthode retournant un Observable de la valeur du compteur.
   * Utilise distinctUntilChanged pour n'émettre que lorsque la valeur change réellement.
   * @returns Un Observable émettant la valeur actuelle du compteur.
   */
  getCount$(): Observable<number> {
    return this.state$.pipe(
      map((state) => state.count),
      distinctUntilChanged(),
    );
  }

  /**
   * Méthode pour dispatcher des événements et mettre à jour l'état du compteur.
   * @param event - L'événement à traiter (INCREMENT, DECREMENT ou RESET).
   */
  dispatch(event: CounterEventType): void {
    const currentState = this.currentState;
    let newState: CounterStateInterface;

    // Détermine le nouvel état en fonction de l'événement reçu
    switch (event.type) {
      case 'INCREMENT':
        newState = { count: currentState.count + 1 };
        break;
      case 'DECREMENT':
        newState = { count: currentState.count - 1 };
        break;
      case 'RESET':
        newState = { count: 0 };
        break;
      default:
        newState = currentState;
    }

    // Émet le nouvel état
    this.state$.next(newState);
  }
}

// Exemple d'utilisation du BLoC

/**
 * Création d'une instance du CounterBloc.
 */
const counterBloc = new CounterBloc();

/**
 * Souscription aux changements d'état du compteur.
 * Cette souscription affichera la valeur actuelle du compteur à chaque changement.
 */
counterBloc.getCount$().subscribe((count) => {
  console.log(`Current count: ${count}`);
});

/**
 * Dispatch d'événements pour tester le fonctionnement du BLoC.
 * Ces dispatches vont incrémenter, décrémenter et réinitialiser le compteur.
 */
counterBloc.dispatch({ type: 'INCREMENT' });
counterBloc.dispatch({ type: 'INCREMENT' });
counterBloc.dispatch({ type: 'DECREMENT' });
counterBloc.dispatch({ type: 'RESET' });
