import { Subject } from 'rxjs';

const messageBus = new Subject();

// Module 1
messageBus.subscribe((message) => {
  console.log('Module 1 received:', message);
});

// Module 2
messageBus.subscribe((message) => {
  console.log('Module 2 received:', message);
});

// Envoi d'un message
messageBus.next({ type: 'USER_UPDATED', data: { id: 1, name: 'John Doe' } });
