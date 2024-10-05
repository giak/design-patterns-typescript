import type { Subscription } from "rxjs";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import * as RxOp from "rxjs/operators";
import deepEqual from "fast-deep-equal";

/**
 * Interface representing a wrapped Bloc action.
 * @template S The state type.
 */
export interface BlocActionWrap<S> {
  /** The action to be performed on the Bloc. */
  action: BlocAction<S>;
  /** Function to be called when the action is resolved. */
  resolve: () => void;
}

/**
 * Type definition for a Bloc action.
 * @template S The state type.
 * @param b The Bloc instance.
 * @param next Function to update the state.
 * @returns void or a Promise<void>.
 */
export type BlocAction<S> = (
  b: Bloc<S>,
  next: (s: S) => void
) => void | Promise<void>;

/**
 * Interface representing the next state with a resolve function.
 * @template S The state type.
 */
interface NextStateWithResolve<S> {
  /** The next state. */
  next: S;
  /** Function to be called when the state update is resolved. */
  resolve: () => void;
}

/**
 * Creates an Observable from a Bloc action.
 * @template S The state type.
 * @param b The Bloc instance.
 * @returns A function that takes a BlocActionWrap and returns an Observable.
 */
const observableFromAction = <S>(b: Bloc<S>) => ({
  action,
  resolve,
}: BlocActionWrap<S>) =>
  new Observable<NextStateWithResolve<S>>((subscriber) => {
    Promise.resolve(action(b, (next: S) => subscriber.next({ next, resolve })))
      .catch((err) => subscriber.error(err))
      .finally(() => {
        subscriber.complete();
      });
  });

/**
 * Abstract class representing a Bloc.
 * @template S The state type.
 * @extends Observable<S>
 */
export abstract class Bloc<S> extends Observable<S> {
  /**
   * Creates an instance of Bloc.
   * @param initialState The initial state of the Bloc.
   * @param isEqual Function to compare two states for equality. Defaults to deep equality check.
   */
  constructor(initialState: S, isEqual = (a: S, b: S) => deepEqual(a, b)) {
    super((subscriber) => {
      return this.transformState(this._state$).subscribe(subscriber);
    });

    this._state$ = new BehaviorSubject(initialState);

    this.transformActions(this._actions$)
      .pipe(RxOp.concatMap(observableFromAction(this)))
      .subscribe({
        next: ({ next, resolve }) => {
          if (isEqual(this.value, next)) {
            return resolve();
          }
          this._state$.next(next);
          resolve();
        },
        error: (err) => this._state$.error(err),
      });
  }

  /** Subject for actions. */
  protected _actions$ = new Subject<BlocActionWrap<S>>();

  /** BehaviorSubject for state. */
  protected _state$: BehaviorSubject<S>;

  /** Array of cleanup handlers. */
  protected _cleanupHandlers: (() => void)[] = [];

  /**
   * Gets the current value of the state.
   * @returns The current state.
   */
  public get value() {
    return this._state$.value;
  }

  /**
   * Dispatches an action to the Bloc.
   * @param action The action to dispatch.
   * @returns A Promise that resolves when the action is complete.
   */
  public next = (action: BlocAction<S>): Promise<void> =>
    new Promise((resolve) =>
      this._actions$.next({
        action,
        resolve,
      })
    );

  /**
   * Transforms the actions Observable.
   * @param input$ The input Observable of actions.
   * @returns The transformed Observable of actions.
   */
  protected transformActions(input$: Observable<BlocActionWrap<S>>) {
    return input$;
  }

  /**
   * Transforms the state Observable.
   * @param input$ The input Observable of state.
   * @returns The transformed Observable of state.
   */
  protected transformState(input$: Observable<S>) {
    return input$;
  }

  /**
   * Utility method for consuming other Observables and cleaning them up.
   * @param s The Subscription to unsubscribe.
   * @param cleanup Optional cleanup function.
   */
  protected unsubscribeOnComplete(s: Subscription, cleanup?: () => void) {
    this._cleanupHandlers.push(() => {
      s.unsubscribe();
      if (cleanup) cleanup();
    });
  }

  /**
   * Completes the Bloc, running all cleanup handlers and completing the actions Subject.
   */
  public complete() {
    for (const fn of this._cleanupHandlers) {
      fn();
    }
    this._actions$.complete();
  }
}
