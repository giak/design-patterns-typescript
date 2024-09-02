// mauvaise pratique de mettre plusieurs générateurs dans un seul fichier
// une approche plus simple et directe pourrait être préférable

function* fibonacciGenerator() {
    let [prev, curr] = [0, 1];
    while (true) {
      yield curr;
      [prev, curr] = [curr, prev + curr];
    }
  }
  
  function* primeGenerator() {
    function isPrime(num:number) {
      for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
        if (num % i === 0) return false;
      }
      return num > 1;
    }
  
    let num = 2;
    while (true) {
      if (isPrime(num)) yield num;
      num++;
    }
  }
  
  function* combinedGenerator() {
    const fib = fibonacciGenerator();
    const prime = primeGenerator();
    while (true) {
      const f = fib.next().value;
      const p = prime.next().value;
      yield* [f, p];
      if (typeof f === 'number' && typeof p === 'number') {
        yield* [f, p];
        if (f > 1000 && p > 1000) break;
      }
    }
  }
  
  // Utilisation
  const gen = combinedGenerator();
  for (let i = 0; i < 20; i++) {
    console.log(gen.next().value);
  }
  