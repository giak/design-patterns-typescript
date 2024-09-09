class MyIterable {
  [Symbol.iterator](): Iterator<number> {
    let i = 0;
    return {
      next(): IteratorResult<number> {
        if (i < 2) {
          return { value: i++ + 1, done: false };
        } else {
          return { value: undefined, done: true };
        }
      },
    };
  }
}

// ecrit une utilisation de la classe MyIterable
const myIterable = new MyIterable();
for (const num of myIterable) {
  console.log(num); // TypeScript sait que num est un number
}

interface IterableRange {
  from: number;
  to: number;
  [Symbol.iterator](): Iterator<number, any, undefined>;
}

const range: IterableRange = {
  from: 1,
  to: 5,
  *[Symbol.iterator]() {
    for (let i = this.from; i <= this.to; i++) {
      yield i;
    }
  },
};

for (const num of range) {
  console.log(num); // TypeScript sait que num est un number
}

export type {};
