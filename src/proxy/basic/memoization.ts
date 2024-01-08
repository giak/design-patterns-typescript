// Use Case: Improved Memoization

// Interface describing a function with expensive computation
interface ExpensiveFunctionInterface {
  calculateResult(input: number): number;
}

// Implementation of the expensive function
class ExpensiveFunction implements ExpensiveFunctionInterface {
  calculateResult(input: number): number {
    // Simulating a computationally expensive operation
    console.log(`Calculating result for input ${input}`);
    return input * input;
  }
}

// Proxy for memoization
class MemoizationProxy implements ExpensiveFunctionInterface {
  private cache: Record<number, number> = {};
  private target: ExpensiveFunction = new ExpensiveFunction();

  calculateResult(input: number): number {
    if (!(input in this.cache)) {
      this.cache[input] = this.target.calculateResult(input);
    }
    return this.cache[input];
  }

  // Method to clear the memoization cache
  clearCache() {
    this.cache = {};
    console.log('Memoization cache cleared.');
  }
}

// Using the MemoizationProxy
const memoizationProxy = new MemoizationProxy();

// Calculating results with memoization
console.log(memoizationProxy.calculateResult(5)); // Output: "Calculating result for input 5" followed by 25
console.log(memoizationProxy.calculateResult(5)); // Output: 25 (from cache)

// Clearing the memoization cache
memoizationProxy.clearCache();
