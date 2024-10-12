/**
 * @file src/observable/Observable.ts
 * @description Implémentation native d'Observable en TypeScript selon la proposition TC39.
 * Cette classe permet de créer et de gérer des flux de données asynchrones.
 */

/**
 * Représente un observateur qui peut recevoir des notifications d'un Observable.
 * @template T Le type de données émises par l'Observable.
 */
type Observer<T> = {
  /** Appelé pour chaque nouvelle valeur émise */
  next: (value: T) => void;
  /** Appelé en cas d'erreur (optionnel) */                         
  error?: (err: any) => void;
  /** Appelé lorsque l'Observable a terminé d'émettre des valeurs (optionnel) */
  complete?: () => void;
};

/** Fonction de nettoyage appelée lors du désabonnement */
type TeardownLogic = () => void;

/**
 * Représente un abonnement à un Observable.
 * Permet de se désabonner de l'Observable.
 */
interface Subscription {
  /** Annule l'abonnement */
  unsubscribe(): void;
}

/**
 * Classe Observable qui implémente le pattern Observable.
 * Permet de créer des flux de données asynchrones et de s'y abonner.
 * @template T Le type de données émises par l'Observable.
 */
class Observable<T> {
  private _subscribe: (observer: Observer<T>) => TeardownLogic | void;

  /**
   * Crée une nouvelle instance d'Observable.
   * @param subscribe Fonction appelée lors de l'abonnement à l'Observable.
   */
  constructor(subscribe: (observer: Observer<T>) => TeardownLogic | void) {
    this._subscribe = subscribe;
  }

  /**
   * Permet de s'abonner à l'Observable pour recevoir des notifications.
   * @param observer L'observateur qui recevra les notifications.
   * @returns Un objet Subscription permettant de se désabonner.
   */
  subscribe(observer: Observer<T>): Subscription {
    const teardown = this._subscribe(observer) || (() => {});

    return {
      unsubscribe: teardown,
    };
  }

  /**
   * Méthode statique pour créer un Observable à partir d'un itérable.
   * @template U Le type des éléments de l'itérable.
   * @param iterable L'itérable à convertir en Observable.
   * @returns Un nouvel Observable émettant les éléments de l'itérable.
   */
  static fromIterable<U>(iterable: Iterable<U>): Observable<U> {
    return new Observable<U>((observer) => {
      try {
        for (const item of iterable) {
          observer.next(item);
        }
        if (observer.complete) {
          observer.complete();
        }
      } catch (err) {
        if (observer.error) {
          observer.error(err);
        }
      }
    });
  }
}

export { Observable, type Observer, type Subscription };
