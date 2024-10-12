/**
 * @file src/observable/basic/button.ts
 * @description Gestion des clics de bouton en utilisant l'Observable natif.
 */

import { Observable, type Observer } from '../Observable';

/**
 * Crée une Observable pour les clics sur un bouton.
 * @returns Une Observable émettant des événements de souris.
 */
function createButtonClickObservable(): Observable<MouseEvent> {
  return new Observable<MouseEvent>((observer: Observer<MouseEvent>) => {
    const button: HTMLButtonElement | null = document.querySelector('#myButton');

    if (!button) {
      observer.error?.(new Error("Button with id 'myButton' not found."));
      return;
    }

    /**
     * Gestionnaire de clic pour le bouton.
     * @param event L'événement de souris.
     */
    const clickHandler = (event: MouseEvent): void => {
      observer.next(event);
    };

    button.addEventListener('click', clickHandler);

    // Fonction de nettoyage appelée lors de la désabonnement.
    return () => {
      button.removeEventListener('click', clickHandler);
    };
  });
}

const buttonClicks: Observable<MouseEvent> = createButtonClickObservable();

const subscription = buttonClicks.subscribe({
  next: (event: MouseEvent) => {
    console.log('Button clicked at:', event.clientX, event.clientY);
  },
  error: (err: any) => {
    console.error('Error:', err);
  },
  complete: () => {
    console.log('Button click Observable completed.');
  },
});

// Exemple de désabonnement après un certain temps (optionnel).
// setTimeout(() => {
//   subscription.unsubscribe();
//   console.log("Unsubscribed from button clicks.");
// }, 60000); // Désabonne après 60 secondes.
