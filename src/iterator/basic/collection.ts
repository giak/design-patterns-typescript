interface IteratorInterface<T> {
  next(): T | null;
  hasNext(): boolean;
}

class ConcreteIterator<T> implements IteratorInterface<T> {
  private collection: T[];
  private position = 0;

  constructor(collection: T[]) {
    this.collection = collection;
  }

  public next(): T | null {
    if (this.hasNext()) {
      return this.collection[this.position++];
    }
    return null;
  }

  public hasNext(): boolean {
    return this.position < this.collection.length;
  }
}

class IterableCollection<T> {
  private items: T[] = [];

  public addItem(item: T): void {
    this.items.push(item);
  }

  public createIterator(): IteratorInterface<T> {
    return new ConcreteIterator(this.items);
  }
}

// Exemple d'utilisation
const collection = new IterableCollection<string>();
collection.addItem('TypeScript');
collection.addItem('Iterator');
collection.addItem('Pattern');

const iterator = collection.createIterator();

while (iterator.hasNext()) {
  console.log(iterator.next());
}

export type {};
