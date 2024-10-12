import { EMPTY, Observable, interval } from 'rxjs';
import { catchError, map, retry, take, takeUntil } from 'rxjs/operators';

const source$ = interval(1000).pipe(
  map((val) => {
    if (val > 5 && Math.random() > 0.5) throw new Error('Random error');
    return val;
  }),
  retry(2),
  take(10),
  catchError((err) => {
    console.error('Error caught:', err);
    return EMPTY;
  }),
);

const stop$ = new Observable((observer) => {
  setTimeout(() => {
    observer.next();
    observer.complete();
  }, 5000);
});

source$.pipe(takeUntil(stop$)).subscribe({
  next: (val) => console.log('Received:', val),
  error: (err) => console.error('Error in subscription:', err),
  complete: () => console.log('Completed'),
});
