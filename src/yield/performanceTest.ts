// Définition d'un type pour représenter un élément de données
type DataItem = {
  id: number;
  value: string;
};

// Fonction génératrice pour simuler la récupération de données volumineuses
function* largeDatasetGenerator(size: number): Generator<DataItem, void, unknown> {
  for (let i = 0; i < size; i++) {
    yield { id: i, value: `Item ${i}` };
  }
}

// Fonction pour traiter les données avec yield
function processDataWithYield(size: number): void {
  console.log('Traitement avec yield:');
  const startTime = performance.now();

  let count = 0;
  for (const item of largeDatasetGenerator(size)) {
    // Simulons un traitement sur chaque élément
    const processedValue = item.value.toUpperCase();
    count++;

    if (count % 1000000 === 0) {
      console.log(`Traité ${count} éléments...`);
    }
  }

  const endTime = performance.now();
  console.log(`Traitement terminé. ${count} éléments traités.`);
  console.log(`Temps d'exécution: ${(endTime - startTime).toFixed(2)} ms`);
}

// Fonction pour traiter les données sans yield (pour comparaison)
function processDataWithoutYield(size: number): void {
  console.log('Traitement sans yield:');
  const startTime = performance.now();

  const dataset: DataItem[] = [];
  for (let i = 0; i < size; i++) {
    dataset.push({ id: i, value: `Item ${i}` });
  }

  let count = 0;
  for (const item of dataset) {
    // Simulons un traitement sur chaque élément
    const processedValue = item.value.toUpperCase();
    count++;

    if (count % 1000000 === 0) {
      console.log(`Traité ${count} éléments...`);
    }
  }

  const endTime = performance.now();
  console.log(`Traitement terminé. ${count} éléments traités.`);
  console.log(`Temps d'exécution: ${(endTime - startTime).toFixed(2)} ms`);
}

// Fonction principale pour exécuter les tests
function runPerformanceTest(): void {
  const dataSize = 10000000; // 10 millions d'éléments

  console.log(`Test de performance pour ${dataSize} éléments:`);
  console.log('----------------------------------------');

  processDataWithYield(dataSize);
  console.log('----------------------------------------');
  processDataWithoutYield(dataSize);
}

// Exécution du test de performance
runPerformanceTest();
