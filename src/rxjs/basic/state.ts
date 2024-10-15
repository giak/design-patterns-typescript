import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Représente un utilisateur dans l'application.
 */
interface UserInterface {
  id: number;
  name: string;
}

/**
 * Représente une notification dans l'application.
 */
interface NotificationInterface {
  id: number;
  message: string;
}

/**
 * Représente l'état global de l'application.
 */
interface AppStateInterface {
  user: UserInterface | null;
  theme: 'light' | 'dark';
  notifications: NotificationInterface[];
}

const initialState: AppStateInterface = {
  user: null,
  theme: 'light',
  notifications: [],
};

const state$ = new BehaviorSubject<AppStateInterface>(initialState);

// Sélecteurs
const user$ = state$.pipe(map((state) => state.user));
const theme$ = state$.pipe(map((state) => state.theme));
const notifications$ = state$.pipe(map((state) => state.notifications));

// Actions
/**
 * Met à jour l'utilisateur dans l'état de l'application.
 * @param user - Le nouvel objet utilisateur à définir.
 */
function updateUser(user: UserInterface): void {
  const currentState = state$.getValue();
  state$.next({ ...currentState, user });
}

/**
 * Bascule le thème entre clair et sombre.
 */
function toggleTheme(): void {
  const currentState = state$.getValue();
  const newTheme = currentState.theme === 'light' ? 'dark' : 'light';
  state$.next({ ...currentState, theme: newTheme });
}

/**
 * Ajoute une nouvelle notification à l'état de l'application.
 * @param notification - L'objet notification à ajouter.
 */
function addNotification(notification: NotificationInterface): void {
  const currentState = state$.getValue();
  state$.next({
    ...currentState,
    notifications: [...currentState.notifications, notification],
  });
}

// Utilisation
user$.subscribe((user) => console.log("Utilisateur changé :", user));
theme$.subscribe((theme) => {
  if (typeof document !== "undefined") {
    document.body.className = theme;
  }
});
notifications$.subscribe((notifications) => console.log("Nombre de notifications :", notifications.length));

// Exemple d'utilisation
updateUser({ id: 1, name: "John Doe" });
toggleTheme();
addNotification({ id: 1, message: "Bonjour RxJS !" });
