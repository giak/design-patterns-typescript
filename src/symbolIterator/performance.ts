const largeArray = Array.from({ length: 1000000 }, (_, i) => i);

console.time('for loop');
const largeArrayLength = largeArray.length;
for (let i = 0; i < largeArrayLength; i++) {
  // Do something
}
console.timeEnd('for loop');

console.time('for...of');
for (const item of largeArray) {
  // Do something
}
console.timeEnd('for...of');

// Résultats typiques :
// for loop: ~1ms
// for...of: ~8ms