import { type Observable, fromEvent, merge, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, tap, delay } from 'rxjs/operators';

/**
 * Représente une planète avec ses propriétés.
 */
interface Planet {
  name: string;
  type: "Rocky" | "Gas Giant" | "Ice Giant" | "Dwarf";
  discoveryYear: number;
}

/**
 * Service pour la recherche de planètes.
 */
class PlanetSearchService {
  private planets: Planet[] = [
    { name: "Zorgon", type: "Rocky", discoveryYear: 2130 },
    { name: "Nebulos", type: "Gas Giant", discoveryYear: 2145 },
    { name: "Frostia", type: "Ice Giant", discoveryYear: 2160 },
    { name: "Galaxon", type: "Dwarf", discoveryYear: 2175 },
  ];

  /**
   * Recherche des planètes en fonction d'un terme donné.
   * @param term - Le terme de recherche.
   * @returns Un Observable de tableaux de Planètes.
   */
  searchPlanets(term: string): Observable<Planet[]> {
    return of(this.planets.filter((planet) => planet.name.toLowerCase().includes(term.toLowerCase()))).pipe(
      delay(Math.random() * 1000), // Délai aléatoire pour simuler la latence réseau
    );
  }
}

// Configuration de l'autocomplétion
const searchInput = document.getElementById("search-input");
const resultsList = document.getElementById("results-list");

if (!(searchInput instanceof HTMLInputElement) || !(resultsList instanceof HTMLUListElement)) {
  throw new Error("Éléments DOM requis non trouvés");
}

const planetService = new PlanetSearchService();

// Observable pour les événements de frappe
const keyup$ = fromEvent<KeyboardEvent>(searchInput, "keyup").pipe(
  map((event) => {
    if (!(event.target instanceof HTMLInputElement)) {
      throw new Error("La cible de l'événement n'est pas un HTMLInputElement");
    }
    return event.target.value;
  }),
  filter((term: string) => term.length > 1),
  debounceTime(300),
  distinctUntilChanged(),
);

// Observable pour les suggestions rapides basées sur le cache local
const quickSuggestions$ = keyup$.pipe(
  map((term) => {
    const cachedResults = localStorage.getItem(`planet_cache_${term}`);
    return cachedResults ? JSON.parse(cachedResults) as Planet[] : [];
  }),
);

// Observable pour les résultats complets de la recherche
const searchResults$ = keyup$.pipe(
  switchMap((term) =>
    planetService.searchPlanets(term).pipe(
      tap((results) => localStorage.setItem(`planet_cache_${term}`, JSON.stringify(results))),
      catchError(() => of([])),
    ),
  ),
);

// Fusion des suggestions rapides et des résultats de recherche
merge(quickSuggestions$, searchResults$).subscribe((planets: Planet[]) => {
  resultsList.innerHTML = "";
  for (const planet of planets) {
    const li = document.createElement("li");
    li.textContent = `${planet.name} (${planet.type}, découverte en ${planet.discoveryYear})`;
    li.addEventListener("click", () => {
      searchInput.value = planet.name;
      resultsList.innerHTML = "";
    });
    resultsList.appendChild(li);
  }
});

// Bonus : Ajouter un effet visuel lorsqu'une nouvelle planète est découverte
fromEvent(document, "newPlanetDiscovered")
  .pipe(
    tap(() => {
      const flash = document.createElement("div");
      flash.className = "discovery-flash";
      document.body.appendChild(flash);
      setTimeout(() => {
        if (document.body.contains(flash)) {
          document.body.removeChild(flash);
        }
      }, 1000);
    }),
  )
  .subscribe();
