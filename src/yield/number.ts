function* evenNumbers(limit: number): Generator<number, void, unknown> {
  for (let i = 0; i <= limit; i += 2) {
    yield i;
  }
}

function* oddNumbers(limit: number): Generator<number, void, unknown> {
  for (let i = 1; i <= limit; i += 2) {
    yield i;
  }
}

function* numberMerger(limit: number): Generator<number, void, unknown> {
  const evenGen = evenNumbers(limit);
  const oddGen = oddNumbers(limit);

  while (true) {
    const evenResult = evenGen.next();
    const oddResult = oddGen.next();

    if (evenResult.done && oddResult.done) {
      break;
    }

    if (!evenResult.done) yield evenResult.value;
    if (!oddResult.done) yield oddResult.value;
  }
}

const mergedSequence = numberMerger(10);

for (const num of mergedSequence) {
  console.log(num); // Affiche la séquence fusionnée
}
