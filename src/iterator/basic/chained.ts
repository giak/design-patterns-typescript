class Node<T> {
  constructor(
    public data: T,
    public next: Node<T> | null = null,
  ) {}
}

class LinkedList<T> implements Iterable<T> {
  private head: Node<T> | null = null;

  add(data: T): void {
    const newNode = new Node(data);
    if (!this.head) {
      this.head = newNode;
      return;
    }
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = newNode;
  }

  [Symbol.iterator](): Iterator<T> {
    let current = this.head;
    return {
      next(): IteratorResult<T> {
        if (current) {
          const value = current.data;
          current = current.next;
          return { value, done: false };
        }
        return { value: null, done: true };
      },
    };
  }
}

// Utilisation
const list = new LinkedList();
list.add(1);
list.add(2);
list.add(3);

for (const item of list) {
  console.log(item); // Affiche 1, 2, 3
}

export type {};
