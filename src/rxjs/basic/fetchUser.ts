import axios from 'axios';
import { AsyncSubject, type Observable, from, lastValueFrom, of, throwError } from 'rxjs';
import { catchError, finalize, map, retry, switchMap, tap } from 'rxjs/operators';

/**
 * Interface représentant un utilisateur.
 */
interface UserInterface {
  id: string;
  name: {
    first: string;
    last: string;
  };
  email: string;
}

/**
 * Interface représentant la réponse de l'API Random User.
 */
interface RandomUserResponseInterface {
  results: UserInterface[];
  info: {
    seed: string;
    results: number;
    page: number;
    version: string;
  };
}

/**
 * Classe de service pour gérer les opérations liées aux utilisateurs.
 */
class UserService {
  /** URL de base de l'API Random User */
  private apiUrl = 'https://randomuser.me/api/';
  /** Cache pour stocker les utilisateurs déjà récupérés */
  private userCache = new Map<string, AsyncSubject<UserInterface>>();

  /**
   * Récupère les informations d'un utilisateur.
   * @param id - L'identifiant de l'utilisateur (utilisé comme graine pour des résultats cohérents).
   * @returns Un Observable émettant les données de l'utilisateur.
   */
  fetchUser(id: string): Observable<UserInterface> {
    // Vérifie si l'utilisateur est déjà dans le cache
    const cachedUser = this.userCache.get(id);
    if (cachedUser) {
      return cachedUser.asObservable();
    }

    // Crée un nouveau sujet pour cet utilisateur
    const subject = new AsyncSubject<UserInterface>();
    this.userCache.set(id, subject);

    // Effectue la requête HTTP et traite la réponse
    return from(axios.get<RandomUserResponseInterface>(`${this.apiUrl}?seed=${id}`)).pipe(
      retry(3), // Réessaie jusqu'à 3 fois en cas d'échec
      map((response) => {
        const user = response.data.results[0];
        user.id = id; // Assigne l'id (seed) à l'utilisateur
        return user;
      }),
      tap((user: UserInterface) => {
        console.log(`Utilisateur récupéré : ${user.name.first} ${user.name.last}`);
        subject.next(user);
        subject.complete();
      }),
      catchError((error) => {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        this.userCache.delete(id);
        return throwError(() => new Error("Impossible de récupérer l'utilisateur"));
      }),
      finalize(() => console.log("Opération terminée"))
    );
  }

  /**
   * Recherche des utilisateurs en fonction d'une requête.
   * @param query - La requête de recherche (utilisée comme graine).
   * @returns Un Observable émettant un tableau d'utilisateurs.
   */
  searchUsers(query: string): Observable<UserInterface[]> {
    return from(axios.get<RandomUserResponseInterface>(`${this.apiUrl}?results=5&seed=${query}`)).pipe(
      map((response) => response.data.results),
      catchError((error) => {
        console.error("Erreur lors de la recherche d'utilisateurs :", error);
        return of([]); // Retourne un tableau vide en cas d'erreur
      })
    );
  }
}

/**
 * Générateur asynchrone pour itérer sur une série d'utilisateurs.
 * @param service - L'instance du service utilisateur.
 * @param ids - Un tableau d'identifiants d'utilisateurs.
 * @yields Les utilisateurs récupérés un par un.
 */
async function* userGenerator(service: UserService, ids: string[]): AsyncIterableIterator<UserInterface> {
  for (const id of ids) {
    const user = await lastValueFrom(service.fetchUser(id));
    if (user) {
      yield user;
    } else {
      console.warn(`Utilisateur avec l'id ${id} non trouvé`);
    }
  }
}

// Utilisation du service
const userService = new UserService();

// Exemple d'utilisation : récupère un utilisateur puis recherche d'autres utilisateurs avec son nom
userService
  .fetchUser("user1")
  .pipe(switchMap((user) => userService.searchUsers(user.name.last)))
  .subscribe({
    next: (users) => console.log("Utilisateurs trouvés :", users),
    error: (err: Error) => console.error("Erreur :", err.message),
    complete: () => console.log("Recherche terminée")
  });

// Utilisation du générateur asynchrone
(async () => {
  console.log("Début de la génération d'utilisateurs");
  for await (const user of userGenerator(userService, ["user1", "user2", "user3"])) {
    console.log("Utilisateur généré :", user);
  }
  console.log("Fin de la génération d'utilisateurs");
})();
