class Node<T> {
  constructor(
    public data: T,
    public next: Node<T> | null = null,
  ) {}
}

interface LinkedListInterface<T> {
  add(data: T): void;
  remove(data: T): boolean;
  find(data: T): Node<T> | null;
  insertAfter(targetData: T, newData: T): boolean;
}

export class LinkedList<T> implements Iterable<T>, LinkedListInterface<T> {
  private head: Node<T> | null = null;
  private tail: Node<T> | null = null;

  // Add a new node to the end of the list
  add(data: T): void {
    const newNode = new Node(data);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      if (this.tail) {      
        this.tail.next = newNode;
        this.tail = newNode;
      }
    }
  }

  // Remove a node with the specified data
  remove(data: T): boolean {
    if (!this.head) return false;

    if (this.head.data === data) {
      this.head = this.head.next;
      if (!this.head) {
        this.tail = null;
      }
      return true;
    }

    let current = this.head;
    while (current.next && current.next.data !== data) {
      current = current.next;
    }

    if (current.next) {
      current.next = current.next.next;
      if (!current.next) {
        this.tail = current;
      }
      return true;
    }

    return false;
  }

  // Find a node with the specified data
  find(data: T): Node<T> | null {
    let current = this.head;
    while (current) {
      if (current.data === data) {
        return current;
      }
      current = current.next;
    }
    return null;
  }

  // Insert a new node after a node with the specified target data
  insertAfter(targetData: T, newData: T): boolean {
    const targetNode = this.find(targetData);
    if (!targetNode) return false;

    const newNode = new Node(newData, targetNode.next);
    targetNode.next = newNode;

    if (targetNode === this.tail) {
      this.tail = newNode;
    }

    return true;
  }

  // Implement the iterable interface
  *[Symbol.iterator](): Iterator<T> {
    let current = this.head;
    while (current) {
      yield current.data;
      current = current.next;
    }
  }
}

/* Utilisation de la classe LinkedList */

const list = new LinkedList<number>();

// Ajout d'éléments
list.add(1);
list.add(2);
list.add(3);
list.add(4);
console.log('Liste après ajout de 1, 2, 3, 4:');
for (const item of list) {
  console.log(item); // Affiche 1, 2, 3, 4
}

// Recherche d'un élément
const foundNode = list.find(3);
console.log("Recherche de l'élément 3:");
console.log(foundNode ? foundNode.data : 'Non trouvé'); // Affiche 3

// Insertion après un élément
list.insertAfter(2, 2.5);
console.log('Liste après insertion de 2.5 après 2:');
for (const item of list) {
  console.log(item); // Affiche 1, 2, 2.5, 3, 4
}

// Suppression d'un élément
list.remove(2.5);
console.log('Liste après suppression de 2.5:');
for (const item of list) {
  console.log(item); // Affiche 1, 2, 3, 4
}

// Suppression de la tête
list.remove(1);
console.log('Liste après suppression de 1 (la tête):');
for (const item of list) {
  console.log(item); // Affiche 2, 3, 4

  // Suppression d'un élément inexistant
  const removed = list.remove(10);
  console.log('Suppression de 10 (non existant):');
  console.log(removed ? 'Suppression réussie' : 'Élément non trouvé'); // Affiche "Élément non trouvé"

  // Itération sur la liste après modifications
  console.log('Itération finale sur la liste:');
  for (const item of list) {
    console.log(item); // Affiche 2, 3, 4
  }
}

export type {};
