import * as readline from 'node:readline';
import { type Observable, from, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

/**
 * Interface représentant un résultat de recherche
 * @property {number} id - Identifiant unique du résultat
 * @property {string} name - Nom du résultat
 */
interface SearchResult {
  id: number;
  name: string;
}

/**
 * Simule une API de recherche avec un délai aléatoire
 * @param {string} term - Le terme de recherche
 * @returns {Promise<SearchResult[]>} Une Promise qui résout avec un tableau de résultats de recherche
 * 
 * @description
 * Cette fonction filtre un tableau prédéfini de résultats en fonction du terme de recherche.
 * Elle simule également un délai réseau aléatoire pour imiter le comportement d'une vraie API.
 */
function mockSearchApi(term: string): Promise<SearchResult[]> {
  const results: SearchResult[] = [
    { id: 1, name: "TypeScript" },
    { id: 2, name: "JavaScript" },
    { id: 3, name: "RxJS" },
    { id: 4, name: "Node.js" },
    { id: 5, name: "React" },
  ].filter((item) => item.name.toLowerCase().includes(term.toLowerCase()));

  return new Promise((resolve) => {
    const delay = Math.random() * 1000 + 500; // Délai aléatoire entre 500ms et 1500ms
    setTimeout(() => resolve(results), delay);
  });
}

/**
 * Configuration de l'interface de ligne de commande
 * @description
 * Utilise le module readline de Node.js pour créer une interface
 * permettant de lire les entrées de l'utilisateur depuis la console
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Création d'un Observable à partir des événements de ligne
 * @type {Observable<string>}
 * @description
 * Transforme chaque ligne entrée par l'utilisateur en un Observable,
 * permettant de traiter ces entrées de manière réactive avec RxJS
 */
const input$: Observable<string> = fromEvent(rl, "line") as Observable<string>;

/**
 * Configuration du flux de recherche
 * @type {Observable<SearchResult[]>}
 * @description
 * Crée un pipeline de traitement pour les entrées utilisateur :
 * 1. map : Nettoie l'entrée en supprimant les espaces inutiles
 * 2. debounceTime : Attend 300ms après la dernière frappe pour éviter les requêtes trop fréquentes
 * 3. distinctUntilChanged : Évite de relancer une recherche si le terme n'a pas changé
 * 4. switchMap : Annule la recherche précédente et lance une nouvelle recherche avec le terme actuel
 */
const search$ = input$.pipe(
  map((input: string) => input.trim()),
  debounceTime(300),
  distinctUntilChanged(),
  switchMap((term) => from(mockSearchApi(term))),
);

console.log("Entrez un terme de recherche (ou 'exit' pour quitter) :");

/**
 * Abonnement au flux de recherche
 * @description
 * Traite les résultats de recherche à chaque émission du flux search$ :
 * - Affiche les résultats ou un message si aucun résultat n'est trouvé
 * - Gère les erreurs potentielles
 */
const subscription = search$.subscribe({
  next: (results: SearchResult[]) => {
    console.log("\nRésultats de la recherche :");
    if (results.length === 0) {
      console.log("Aucun résultat trouvé.");
    } else {
      for (const result of results) {
        console.log(`- ${result.name}`);
      }
    }
    console.log("\nEntrez un nouveau terme de recherche :");
  },
  error: (err: Error) => console.error("Une erreur est survenue :", err),
});

/**
 * Gestion de la sortie du programme
 * @description
 * Écoute chaque ligne entrée par l'utilisateur pour détecter la commande de sortie.
 * Si 'exit' est entré, désabonne du flux de recherche et ferme l'interface readline.
 */
rl.on("line", (input: string) => {
  if (input.toLowerCase() === "exit") {
    subscription.unsubscribe();
    rl.close();
  }
});

/**
 * Nettoyage final et sortie du programme
 * @description
 * S'exécute lorsque l'interface readline est fermée.
 * Affiche un message d'au revoir et termine le processus Node.js.
 */
rl.on("close", () => {
  console.log("Au revoir !");
  process.exit(0);
});
