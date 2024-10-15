import chalk from 'chalk';
import { JSDOM } from 'jsdom';
import { fromEvent, interval } from 'rxjs';
import { filter, map, mergeWith, throttleTime } from 'rxjs/operators';

/**
 * Simulation d'un environnement DOM avec JSDOM.
 * Cela permet d'utiliser des API du navigateur dans un environnement Node.js.
 */
const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window as unknown as Window & typeof globalThis;

/**
 * Crée un événement de clic valide compatible avec JSDOM.
 * 
 * @param {number} x - La coordonnée X du clic.
 * @param {number} y - La coordonnée Y du clic.
 * @returns {Event} Un objet Event représentant un clic de souris.
 */
function createClickEvent(x: number, y: number): Event {
  return new dom.window.MouseEvent("click", {
    view: dom.window as unknown as Window,
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
  });
}

/**
 * Observable qui émet des événements de clic filtrés et transformés.
 * 
 * Fonctionnement :
 * 1. Écoute les événements de clic sur le document.
 * 2. Transforme chaque clic en un objet contenant les coordonnées et un horodatage.
 * 3. Filtre pour ne garder que les clics dont la coordonnée X est supérieure à 200.
 * 4. Limite l'émission à un événement par seconde pour éviter le spam.
 * 5. Formate le message de sortie avec une couleur verte.
 */
const clicks$ = fromEvent<MouseEvent>(document, "click").pipe(
  map((event) => ({
    x: event.clientX,
    y: event.clientY,
    timestamp: new Date().toISOString(),
  })),
  filter((coord) => coord.x > 200),
  throttleTime(1000),
  map((coord) => ({
    type: "click",
    message: chalk.green(`🖱️  Click at (${coord.x}, ${coord.y}) - ${coord.timestamp}`),
  }))
);

/**
 * Observable qui émet un "tick" toutes les secondes.
 * 
 * Fonctionnement :
 * 1. Utilise l'opérateur interval pour émettre un nombre incrémental chaque seconde.
 * 2. Transforme chaque émission en un objet contenant un type et un message formaté.
 */
const timer$ = interval(1000).pipe(
  map((i) => ({
    type: "tick",
    message: chalk.blue(`🕒 Tick ${i} - ${new Date().toISOString()}`),
  }))
);

/**
 * Combine les Observables de clics et de timer.
 * 
 * Fonctionnement :
 * Utilise l'opérateur mergeWith pour fusionner les émissions des deux Observables
 * dans un seul flux, préservant l'ordre chronologique des événements.
 */
const combined$ = clicks$.pipe(mergeWith(timer$));

/**
 * S'abonne au flux combiné et affiche les données de manière visuelle dans la console.
 * 
 * Fonctionnement :
 * 1. Pour chaque émission, vérifie le type d'événement (clic ou tick).
 * 2. Affiche le message correspondant avec un formatage coloré.
 * 3. Pour les clics, ajoute une ligne de séparation jaune.
 */
combined$.subscribe((data) => {
  switch (data.type) {
    case "click":
      console.log(data.message);
      console.log(chalk.yellow("------------------------------"));
      break;
    case "tick":
      console.log(data.message);
      break;
    default:
      console.log(chalk.red("Unknown event type"));
  }
});

/**
 * Simule des clics aléatoires à intervalles réguliers.
 * 
 * Fonctionnement :
 * 1. Toutes les 1500 ms, génère des coordonnées X et Y aléatoires.
 * 2. Crée un événement de clic avec ces coordonnées.
 * 3. Dispatch l'événement sur le document, déclenchant ainsi l'Observable de clics.
 */
setInterval(() => {
  const x = Math.floor(Math.random() * 400);
  const y = Math.floor(Math.random() * 400);
  const event = createClickEvent(x, y);
  document.dispatchEvent(event);
}, 1500);

// Message de démarrage
console.log(chalk.magenta("🚀 Observable demo started. Press Ctrl+C to stop."));
