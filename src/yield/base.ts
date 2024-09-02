function* numberGenerator() {
  console.log('Début de la génération');
  yield 1; // Pause et retourne 1
  console.log('Reprise après le premier yield');
  yield 2; // Pause et retourne 2
  console.log('Reprise après le deuxième yield');
  yield 3; // Pause et retourne 3
  console.log('Fin de la génération');
}

const generator = numberGenerator();

console.log(generator.next().value); // "Début de la génération", puis 1
console.log(generator.next().value); // "Reprise après le premier yield", puis 2
console.log(generator.next().value); // "Reprise après le deuxième yield", puis 3
console.log(generator.next().value); // "Fin de la génération", puis undefined

console.info('\n************\n');

function* interactiveTaskQueue(): Generator<string, void, string> {
  const userInput = yield "Task 1: Attendre l'entrée utilisateur";
  console.log(`Données utilisateur reçu: ${userInput}`);

  yield "Task 2: Effectuer une action basée sur l'entrée";
  console.log("Action basée sur l'entrée effectuée");

  yield 'Task 3: Terminer le processus';
  console.log('Processus terminé');
}

// Utilisation du générateur interactif
const interactiveTasks = interactiveTaskQueue();

console.log(interactiveTasks.next().value); // Démarre la première tâche
console.log(interactiveTasks.next('ma phrase de passe').value); // Fournit une valeur externe
console.log(interactiveTasks.next().value); // Démarre la deuxième tâche

export type {};
