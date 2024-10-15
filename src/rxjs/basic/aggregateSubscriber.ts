import { Observable } from 'rxjs';

// Création de trois Observables distincts avec des types explicites
const observable1$: Observable<number> = new Observable<number>((observer) => {
  observer.next(1);
  setTimeout(() => observer.next(2), 2000);
});

const observable2$: Observable<string> = new Observable<string>((observer) => {
  observer.next('A');
  setTimeout(() => observer.next('B'), 1000);
});

const observable3$: Observable<boolean> = new Observable<boolean>((observer) => {
  setTimeout(() => observer.next(true), 3000);
});

// Création d'un Subscriber qui agrège les trois Observables
class AggregateSubscriber {
  private data: { numbers: number[]; strings: string[]; booleans: boolean[] } = {
    numbers: [],
    strings: [],
    booleans: [],
  };

  constructor() {
    observable1$.subscribe((num: number) => this.data.numbers.push(num));
    observable2$.subscribe((str: string) => this.data.strings.push(str));
    observable3$.subscribe((bool: boolean) => this.data.booleans.push(bool));
  }

  /**
   * Retourne les données agrégées de toutes les souscriptions.
   * @returns Un objet contenant des tableaux de nombres, chaînes de caractères et booléens.
   */
  public getAggregatedData(): { numbers: number[]; strings: string[]; booleans: boolean[] } {
    return this.data;
  }
}

const aggregateSubscriber = new AggregateSubscriber();

// Vérification des données agrégées après 4 secondes
setTimeout(() => {
  console.log(aggregateSubscriber.getAggregatedData());
}, 4000);

//  { numbers: [ 1, 2 ], strings: [ 'A', 'B' ], booleans: [ true ] }
