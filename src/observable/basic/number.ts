/**
 * @file src/console/example.ts
 * @description Exemple d'utilisation de l'Observable dans la console.
 */

import { Observable, type Observer, type Subscription } from '../Observable';

/**
 * Crée une Observable qui émet des nombres de 1 à 5 avec un intervalle de 1 seconde.
 * @returns Une Observable émettant des nombres.
 */
function createNumberObservable(): Observable<number> {
  return new Observable<number>((observer: Observer<number>) => {
    let count = 1;
    const intervalId: NodeJS.Timeout = setInterval(() => {
      observer.next(count);
      if (count === 5) {
        if (observer.complete) {
          observer.complete();
        }
        clearInterval(intervalId);
      }
      count++;
    }, 1000);

    // Fonction de nettoyage appelée lors de la désabonnement.
    return () => {
      clearInterval(intervalId);
      console.log("Désabonné de l'Observable des nombres.");
    };
  });
}

// Crée l'Observable
const numberObservable: Observable<number> = createNumberObservable();

// Souscrit à l'Observable
const subscription: Subscription = numberObservable.subscribe({
  next: (value: number) => {
    console.log(`Valeur reçue: ${value}`);
  },
  error: (err: any) => {
    console.error('Erreur:', err);
  },
  complete: () => {
    console.log('Observable complété.');
  },
});

// Exemple de désabonnement après 3,5 secondes (optionnel).
setTimeout(() => {
  subscription.unsubscribe();
}, 3500);
