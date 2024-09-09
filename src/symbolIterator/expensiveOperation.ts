class ExpensiveOperation {
    private data: number[];
  
    constructor(private size: number) {
      this.data = [];
    }
  
    private performExpensiveCalculation(index: number): number {
      console.log(`Performing expensive calculation for index ${index}`);
      // Simuler une opération coûteuse
      return Math.pow(index, 2) * Math.random();
    }
  
    *[Symbol.iterator](): Iterator<number> {
      for (let i = 0; i < this.size; i++) {
        if (i >= this.data.length) {
          // Calculer la valeur seulement si elle n'existe pas déjà
          this.data[i] = this.performExpensiveCalculation(i);
        }
        yield this.data[i];
      }
    }
  }
  
  // Utilisation
  const lazyOperation = new ExpensiveOperation(5);
  
  console.log("Premier parcours :");
  for (const value of lazyOperation) {
    console.log(value);
  }
  
  console.log("\nDeuxième parcours :");
  for (const value of lazyOperation) {
    console.log(value);
  }
  
  // Accès individuel
  console.log("\nAccès individuel :");
  const iterator = lazyOperation[Symbol.iterator]();
  console.log(iterator.next().value);
  console.log(iterator.next().value);