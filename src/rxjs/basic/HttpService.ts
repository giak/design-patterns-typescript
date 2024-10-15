import { type Observable, Subject, throwError, timer } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, retry, shareReplay, switchMap } from 'rxjs/operators';

// Interface pour les données de l'API
interface ApiResponseInterface {
  id: number;
  name: string;
}

// Simuler un service HTTP
class HttpService {
  private cache = new Map<string, Observable<ApiResponseInterface>>();

  getData(id: number): Observable<ApiResponseInterface> {
    const url = `https://api.example.com/data/${id}`;

    // Vérifier si la réponse est déjà en cache
    const cachedResponse = this.cache.get(url);
    if (cachedResponse) {
      console.log('Returning cached response');
      return cachedResponse;
    }

    // Créer une nouvelle requête Observable
    const request$ = ajax.getJSON<ApiResponseInterface>(url).pipe(
      retry({
        count: 4,
        delay: (error, retryCount) => {
          console.log(`Retrying due to error (attempt ${retryCount}):`, error);
          return timer(1000); // 1 second delay before retry
        },
      }),
      // Mettre en cache le résultat
      shareReplay(1),
      catchError((error) => {
        console.error('Error fetching data:', error);
        return throwError(() => new Error('Failed to fetch data'));
      }),
    );

    // Stocker la requête dans le cache
    this.cache.set(url, request$);

    return request$;
  }
}

// Créer une instance du service
const httpService = new HttpService();

// Créer un Subject pour les entrées de l'utilisateur
const userInput$ = new Subject<number>();

// Gérer les requêtes concurrentes
const result$ = userInput$.pipe(
  switchMap((id) => {
    console.log(`Fetching data for id: ${id}`);
    return httpService.getData(id);
  }),
);

// S'abonner aux résultats
result$.subscribe({
  next: (data) => console.log('Received data:', data),
  error: (err) => console.error('Error:', err),
});

// Simuler des entrées utilisateur
setTimeout(() => userInput$.next(1), 0);
setTimeout(() => userInput$.next(2), 500);
setTimeout(() => userInput$.next(1), 1000); // Ceci utilisera la réponse mise en cache
setTimeout(() => userInput$.next(3), 1500);

// Nettoyage (dans un vrai scénario, vous feriez cela quand le composant est détruit)
setTimeout(() => userInput$.complete(), 3000);
