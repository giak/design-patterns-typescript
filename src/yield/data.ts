// Simuler un fichier volumineux avec un tableau de données
const dataSet = Array.from({ length: 1000000 }, (_, i) => `Line ${i + 1}`);

function* lazyFileReader(dataSet: string[]): Generator<string, void, undefined> {
  for (let i = 0; i < dataSet.length; i++) {
    yield dataSet[i]; // Retourne la ligne actuelle
  }
}

const reader = lazyFileReader(dataSet); // Création du générateur

// Exemple de traitement : compter les lignes qui contiennent un certain mot
let count = 0;
for (const line of reader) {
  if (line.includes('Line 100')) {
    count++;
  }
}

console.log(`Nombre de lignes contenant "Line 100": ${count}`);
