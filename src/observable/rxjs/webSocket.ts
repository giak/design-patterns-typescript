import { webSocket } from 'rxjs/webSocket';

const socket$ = webSocket('wss://api.example.com/realtime');

socket$.subscribe({
  next: (data) => console.log('Received:', data),
  error: (err) => console.error(err)
});

// Envoi de données
socket$.next({ message: 'Hello, server!' });
