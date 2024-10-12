import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

const input = document.getElementById('search-input');
const input$ = fromEvent(input, 'input').pipe(
  debounceTime(300),
  map((event) => (event.target as HTMLInputElement).value),
);

input$.subscribe((value) => {
  console.log('Searching for:', value);
  // Effectuer la recherche
});
