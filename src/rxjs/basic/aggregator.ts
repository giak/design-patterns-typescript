import { Observable, Subject, Subscription } from "rxjs";

/**
 * Une classe qui agrège plusieurs observables en un seul flux de données.
 * @template T Le type de données émises par les observables.
 */
class ObservableAggregator<T> extends Subject<T[]> {
  private data: T[] = [];
  private subscriptions: Subscription = new Subscription();

  /**
   * Crée une instance d'ObservableAggregator.
   * @param {Observable<T>[]} observables - Un tableau d'observables à agréger.
   */
  constructor(observables: Observable<T>[]) {
    super();

    for (const obs of observables) {
      const subscription = obs.subscribe({
        next: (value: T) => {
          this.data.push(value);
          this.next(this.data);
        },
        error: (error: Error) => this.error(error),
        complete: () => {
          if (this.subscriptions.closed) {
            this.complete();
          }
        },
      });
      this.subscriptions.add(subscription);
    }
  }

  /**
   * Se désabonne de tous les observables lorsque l'agrégateur est détruit.
   */
  override complete(): void {
    this.subscriptions.unsubscribe();
    super.complete();
  }
}

// Exemple d'utilisation de l'ObservableAggregator
const obs1$: Observable<number> = new Observable((observer) => {
  observer.next(1);
  setTimeout(() => observer.next(2), 2000);
});

const obs2$: Observable<string> = new Observable((observer) => {
  observer.next("A");
  setTimeout(() => observer.next("B"), 1000);
});

const aggregator = new ObservableAggregator<number | string>([obs1$, obs2$]);

aggregator.subscribe({
  next: (aggregatedData: (number | string)[]) => console.log("Données agrégées:", aggregatedData),
  error: (error: Error) => console.error("Erreur:", error),
  complete: () => console.log("Terminé"),
});

// Données agrégées: [ 1, 'A', 'B' ]
// Données agrégées: [ 1, 'A', 'B', 2 ]

