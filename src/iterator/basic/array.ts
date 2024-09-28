interface IteratorInterface<T> {
  next(): { value: T; done: boolean };
  hasNext(): boolean;
}

class ArrayIterator<T> implements IteratorInterface<T> {
  private index = 0;

  constructor(private collection: T[]) {}

  next(): { value: T; done: boolean } {
    if (!this.hasNext()) {
      return { value: undefined as T, done: true };
    }
    return { value: this.collection[this.index++], done: false };
  }

  hasNext(): boolean {
    return this.index < this.collection.length;
  }
}

// Utilisation
const numbers = [1, 2, 3, 4, 5];
const iterator = new ArrayIterator(numbers);

while (iterator.hasNext()) {
  console.log(iterator.next().value);
}

export type {};
