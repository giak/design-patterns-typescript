import { type Observable, fromEvent } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

/**
 * Interface pour les résultats de recherche GitHub
 */
interface GitHubSearchResult {
  items: Array<{ name: string }>;
}

/**
 * Élément de recherche dans le DOM
 */
const searchBox = document.getElementById('search-box') as HTMLInputElement;
if (!searchBox) {
  throw new Error("L'élément search-box n'a pas été trouvé dans le DOM");
}

/**
 * Élément d'affichage des résultats dans le DOM
 */
const results = document.getElementById('results');
if (!results) {
  throw new Error("L'élément results n'a pas été trouvé dans le DOM");
}

/**
 * Observable pour la recherche en temps réel
 */
const typeahead$: Observable<GitHubSearchResult> = fromEvent<Event>(searchBox, 'input').pipe(
  // Récupère la valeur de l'input
  map((e: Event) => (e.target as HTMLInputElement).value),
  // Attend 300ms après la dernière frappe
  debounceTime(300),
  // Évite de relancer une recherche si le terme n'a pas changé
  distinctUntilChanged(),
  // Annule la recherche précédente et lance une nouvelle recherche avec le terme actuel
  switchMap((searchTerm: string) =>
    ajax.getJSON<GitHubSearchResult>(`https://api.github.com/search/repositories?q=${encodeURIComponent(searchTerm)}`),
  ),
);

/**
 * Abonnement à l'observable de recherche
 */
typeahead$.subscribe({
  // Affiche les résultats de la recherche
  next: (data: GitHubSearchResult) => {
    results.innerHTML = data.items.map((item) => `<div>${item.name}</div>`).join('');
  },
  // Gère les erreurs de la recherche
  error: (error: Error) => {
    console.error('Une erreur est survenue lors de la recherche:', error);
    results.innerHTML = '<div>Une erreur est survenue lors de la recherche.</div>';
  },
});
