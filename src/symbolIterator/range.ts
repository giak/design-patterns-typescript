// 1. Itération sur un tableau
const arr = [1, 2, 3];
for (const item of arr) {
  console.log(item); // Affiche 1, 2, 3
}

// 2. Objet personnalisé itérable
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    return {
      current: this.from,
      last: this.to,
      next() {
        if (this.current <= this.last) {
          return { done: false, value: this.current++ };
        } else {
          return { done: true };
        }
      },
    };
  },
};

for (const num of range) {
  console.log(num); // Affiche 1, 2, 3, 4, 5
}

// 3. Itération sur un Set
const mySet = new Set([1, 2, 3]);
for (const item of mySet) {
  console.log(item); // Affiche 1, 2, 3
}
