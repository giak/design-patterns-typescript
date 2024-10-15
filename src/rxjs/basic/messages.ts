import axios from 'axios';
import { type Observable, interval, merge } from 'rxjs';
import { catchError, map, scan, switchMap } from 'rxjs/operators';

/**
 * Interface représentant un utilisateur.
 * @property {number} id - Identifiant unique de l'utilisateur.
 * @property {string} name - Nom de l'utilisateur.
 * @property {string} email - Adresse e-mail de l'utilisateur.
 */
interface UserInterface {
  id: number;
  name: string;
  email: string;
}

/**
 * Interface représentant une entreprise.
 * @property {number} id - Identifiant unique de l'entreprise.
 * @property {string} name - Nom de l'entreprise.
 * @property {string} catchPhrase - Slogan ou phrase d'accroche de l'entreprise.
 */
interface CompanyInterface {
  id: number;
  name: string;
  catchPhrase: string;
}

/**
 * Type représentant une notification, qui peut être soit un utilisateur, soit une entreprise.
 */
type Notification = UserInterface | CompanyInterface;

/**
 * Type représentant les actions possibles sur les notifications.
 * - "new" indique l'ajout de nouvelles notifications.
 * - "read" indique le marquage de notifications comme lues.
 */
type Action = { type: 'new'; messages: Notification[] } | { type: 'read'; ids: number[] };

/**
 * URL de base de l'API Fake JSON utilisée pour récupérer les données.
 */
const API_BASE_URL = 'https://fake-json-api.mock.beeceptor.com';

/**
 * Observable qui récupère de nouvelles notifications depuis l'API Fake JSON.
 *
 * @description
 * Cet Observable émet toutes les 5 secondes. À chaque émission, il tente d'abord
 * de récupérer des utilisateurs. En cas d'échec, il essaie de récupérer des entreprises.
 * Les données récupérées sont ensuite transformées en une action de type "new".
 *
 * @returns {Observable<Action>} Un Observable qui émet des actions "new" contenant les nouvelles notifications.
 */
const newMessages$: Observable<Action> = interval(5000).pipe(
  switchMap(() =>
    axios
      .get<Notification[]>(`${API_BASE_URL}/users`)
      .then((response) => response.data)
      .catch(() => axios.get<Notification[]>(`${API_BASE_URL}/companies`).then((response) => response.data)),
  ),
  map((messages) => ({ type: 'new' as const, messages })),
  catchError((error) => {
    console.error('Erreur lors de la récupération des nouveaux messages:', error);
    return [];
  }),
);

/**
 * Observable qui simule le marquage des notifications comme lues.
 *
 * @description
 * Cet Observable émet toutes les 3 secondes. À chaque émission, il tente de récupérer
 * des utilisateurs, puis prend les deux premiers IDs pour simuler le marquage comme lu.
 * En cas d'échec, il retourne un tableau vide.
 *
 * @returns {Observable<Action>} Un Observable qui émet des actions "read" contenant les IDs des notifications lues.
 */
const readMessages$: Observable<Action> = interval(3000).pipe(
  switchMap(() =>
    axios
      .get<Notification[]>(`${API_BASE_URL}/users`)
      .then((response) => response.data.slice(0, 2).map((item) => item.id))
      .catch(() => []),
  ),
  map((ids) => ({ type: 'read' as const, ids })),
  catchError((error) => {
    console.error('Erreur lors de la récupération des messages lus:', error);
    return [];
  }),
);

/**
 * Observable qui combine les nouveaux messages et les messages lus pour maintenir
 * une liste à jour des notifications.
 *
 * @description
 * Cet Observable fusionne les flux de nouveaux messages et de messages lus.
 * Il utilise un accumulateur pour gérer l'état des notifications :
 * - Les nouvelles notifications sont ajoutées à la liste.
 * - Les notifications marquées comme lues sont retirées de la liste.
 *
 * @returns {Observable<Notification[]>} Un Observable qui émet la liste mise à jour des notifications.
 */
const notifications$: Observable<Notification[]> = merge(newMessages$, readMessages$).pipe(
  scan((acc: Notification[], curr: Action) => {
    if (curr.type === 'new') {
      // Ajoute les nouveaux messages à la liste existante
      return [...acc, ...curr.messages];
    }
    // Filtre les messages lus de la liste
    return acc.filter((msg) => !curr.ids.includes(msg.id));
  }, []),
);

/**
 * Souscription à l'Observable des notifications.
 *
 * @description
 * Cette souscription gère l'affichage des notifications actuelles et les erreurs potentielles.
 * Dans un cas réel, on pourrait mettre à jour l'interface utilisateur ici.
 */
notifications$.subscribe({
  next: (notifications) => {
    console.log('Notifications actuelles:', notifications);
    // Mettre à jour l'interface utilisateur ici
  },
  error: (error) => console.error('Erreur dans le flux de notifications:', error),
});
