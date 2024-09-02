/*  Création d'un Générateur pour la File d'Attente */

function* taskQueue() {
  console.log("Démarrage de la file d'attente...");

  yield 'Task 1: Initialiser le système'; // Première tâche
  console.log('Task 1 terminée');

  yield 'Task 2: Charger les données'; // Deuxième tâche
  console.log('Task 2 terminée');

  yield 'Task 3: Traiter les données'; // Troisième tâche
  console.log('Task 3 terminée');

  yield 'Task 4: Sauvegarder les résultats'; // Quatrième tâche
  console.log('Task 4 terminée');

  console.log('Toutes les tâches sont terminées !');
}

const tasks = taskQueue(); // Création d'une instance du générateur

// Exécution de chaque tâche une par une
console.log(tasks.next().value); // Démarre la première tâche
// Effectuez ici des opérations intermédiaires si nécessaire...

console.log(tasks.next().value); // Démarre la deuxième tâche
// Effectuez ici des opérations intermédiaires si nécessaire...

console.log(tasks.next().value); // Démarre la troisième tâche
// Effectuez ici des opérations intermédiaires si nécessaire...

console.log(tasks.next().value); // Démarre la quatrième tâche
// Effectuez ici des opérations intermédiaires si nécessaire...

/* Interaction avec les Valeurs Externes */

function* interactiveTaskQueue(): Generator<string, void, string> {
  const userInput = yield "Task 1: Attendre l'entrée utilisateur";
  console.log(`Input utilisateur reçu: ${userInput}`);

  yield "Task 2: Effectuer une action basée sur l'entrée";
  console.log("Action basée sur l'entrée effectuée");

  yield 'Task 3: Terminer le processus';
  console.log('Processus terminé');
}

// Utilisation du générateur interactif
const interactiveTasks = interactiveTaskQueue();

console.log(interactiveTasks.next().value); // Démarre la première tâche
console.log(interactiveTasks.next('Données utilisateur').value); // Fournit une valeur externe
console.log(interactiveTasks.next().value); // Démarre la deuxième tâche

/* Gestion de Tâches Asynchrones avec yield */

function* asyncTaskQueue() {
  yield new Promise((resolve) =>
    setTimeout(() => {
      console.log('Task 1: Fetching data...');
      resolve('Données récupérées');
    }, 1000),
  );

  yield new Promise((resolve) =>
    setTimeout(() => {
      console.log('Task 2: Processing data...');
      resolve('Données traitées');
    }, 1000),
  );

  yield new Promise((resolve) =>
    setTimeout(() => {
      console.log('Task 3: Saving data...');
      resolve('Données sauvegardées');
    }, 1000),
  );
}

const asyncTasks = asyncTaskQueue();

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
async function runAsyncTasks(generator: Generator<Promise<any>, void, undefined>) {
  for (const task of generator) {
    const result = await task;
    console.log(result); // Affiche les résultats après chaque tâche
  }
}

runAsyncTasks(asyncTasks);
