function* numberGenerator(): Generator<number> {
  for (const num of [1, 2, 3, 4, 5]) {
    yield num;
  }
}

function* doubleNumbers(numbers: Generator<number>): Generator<number> {
  for (const num of numbers) {
    yield num * 2;
  }
}

function* addOne(numbers: Generator<number>): Generator<number> {
  for (const num of numbers) {
    yield num + 1;
  }
}

const pipeline = addOne(doubleNumbers(numberGenerator()));

for (const result of pipeline) {
  console.log(result); // Affiche : 3, 5, 7, 9, 11
}
