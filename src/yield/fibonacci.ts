function* fibonacci(): Generator<number, void, unknown> {
  let [prev, curr] = [0, 1];

  while (true) {
    yield prev;
    [prev, curr] = [curr, prev + curr]; // Mise à jour des deux derniers nombres
  }
}

// Utilisation du générateur de Fibonacci
const fibGen = fibonacci();

// Affiche les 10 premiers nombres de la suite de Fibonacci
for (let i = 0; i < 100; i++) {
  console.log(fibGen.next().value);
}
