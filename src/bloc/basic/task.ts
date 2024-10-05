import type { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Bloc } from "./bloc";

/**
 * Represents a single todo item.
 */
interface Todo {
  /** Unique identifier for the todo. */
  id: number;
  /** Title of the todo. */
  title: string;
  /** Indicates whether the todo is completed. */
  completed: boolean;
}

/**
 * Represents the state of the todo list.
 */
interface TodoState {
  /** Array of todos. */
  todos: Todo[];
  /** Current filter applied to the todos. */
  filter: "all" | "active" | "completed";
}

/**
 * Defines the possible actions that can be performed on the todo list.
 */
type TodoAction =
  | { type: "ADD_TODO"; title: string }
  | { type: "TOGGLE_TODO"; id: number }
  | { type: "REMOVE_TODO"; id: number }
  | { type: "SET_FILTER"; filter: TodoState["filter"] };

/**
 * TodoBloc class that extends Bloc to manage todo list state and actions.
 */
class TodoBloc extends Bloc<TodoState> {
  /** Counter for generating unique todo IDs. */
  private nextId = 1;

  /**
   * Initializes a new instance of TodoBloc.
   */
  constructor() {
    super({ todos: [], filter: "all" });
  }

  /**
   * Dispatches actions to modify the todo list state.
   * @param action - The action to be dispatched.
   * @returns A promise that resolves when the action has been processed.
   */
  dispatch = (action: TodoAction) =>
    this.next((_, next) => {
      switch (action.type) {
        case "ADD_TODO":
          next({
            ...this.value,
            todos: [...this.value.todos, { id: this.nextId++, title: action.title, completed: false }],
          });
          break;
        case "TOGGLE_TODO":
          next({
            ...this.value,
            todos: this.value.todos.map((todo) =>
              todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
            ),
          });
          break;
        case "REMOVE_TODO":
          next({
            ...this.value,
            todos: this.value.todos.filter((todo) => todo.id !== action.id),
          });
          break;
        case "SET_FILTER":
          next({ ...this.value, filter: action.filter });
          break;
      }
    });

  /**
   * Transforms the state Observable to sort todos by ID.
   * @param input$ - The input Observable of TodoState.
   * @returns An Observable of sorted TodoState.
   */
  protected override transformState(input$: Observable<TodoState>): Observable<TodoState> {
    return input$.pipe(
      map((state) => ({
        ...state,
        todos: state.todos.slice().sort((a, b) => a.id - b.id),
      }))
    );
  }

  /**
   * Gets an Observable of filtered todos based on the current filter.
   */
  get filteredTodos$(): Observable<Todo[]> {
    return this.pipe(
      map((state) => {
        switch (state.filter) {
          case "active":
            return state.todos.filter((todo) => !todo.completed);
          case "completed":
            return state.todos.filter((todo) => todo.completed);
          default:
            return state.todos;
        }
      })
    );
  }

  /**
   * Gets an Observable of the count of active todos.
   */
  get activeCount$(): Observable<number> {
    return this.pipe(map((state) => state.todos.filter((todo) => !todo.completed).length));
  }
}

// Utilisation du TodoBloc
const todoBloc = new TodoBloc();

/**
 * Subscription to the TodoBloc state changes.
 * Logs the current state, errors, and completion.
 */
const subscription = todoBloc.subscribe({
  next: (state) => console.log("État actuel:", state),
  error: (error) => console.error("Erreur:", error),
  complete: () => console.log("Terminé"),
});

/**
 * Subscription to filtered todos.
 * Logs the filtered todos whenever they change.
 */
const filteredSubscription = todoBloc.filteredTodos$.subscribe((todos) => console.log("Todos filtrés:", todos));

/**
 * Subscription to the count of active todos.
 * Logs the count of active todos whenever it changes.
 */
const activeCountSubscription = todoBloc.activeCount$.subscribe((count) =>
  console.log("Nombre de todos actifs:", count)
);

/**
 * Asynchronous function to demonstrate the usage of TodoBloc.
 * Performs a series of todo operations and then cleans up.
 */
async function runAdvancedExample() {
  await todoBloc.dispatch({ type: "ADD_TODO", title: "Apprendre Bloc Pattern" });
  await todoBloc.dispatch({ type: "ADD_TODO", title: "Créer une application" });
  await todoBloc.dispatch({ type: "TOGGLE_TODO", id: 1 });
  await todoBloc.dispatch({ type: "SET_FILTER", filter: "active" });
  await todoBloc.dispatch({ type: "ADD_TODO", title: "Maîtriser TypeScript" });
  await todoBloc.dispatch({ type: "REMOVE_TODO", id: 2 });

  // Nettoyage
  subscription.unsubscribe();
  filteredSubscription.unsubscribe();
  activeCountSubscription.unsubscribe();
  todoBloc.complete();
}

// Run the advanced example
runAdvancedExample();
