import { BinarySearchTree } from "./search";

// Table de Hachage simplifiée
class HashTable<T> {
  private table: { [key: string]: T } = {};

  set(key: string, value: T): void {
    this.table[key] = value;
  }

  get(key: string): T | undefined {
    return this.table[key];
  }

  has(key: string): boolean {
    return key in this.table;
  }
}

// Comparaison
const bst = new BinarySearchTree();
const ht = new HashTable();

// Insertion
console.time("BST Insert");
for (let i = 0; i < 100000; i++) {
  bst.insert(Math.random() * 100000);
}
console.timeEnd("BST Insert");

console.time("HT Insert");
for (let i = 0; i < 100000; i++) {
  ht.set(i.toString(), Math.random() * 100000);
}
console.timeEnd("HT Insert");

// Recherche
console.time("BST Search");
for (let i = 0; i < 1000; i++) {
  bst.search(Math.random() * 100000);
}
console.timeEnd("BST Search");

console.time("HT Search");
for (let i = 0; i < 1000; i++) {
  ht.has(Math.floor(Math.random() * 100000).toString());
}
console.timeEnd("HT Search");

// BST Insert: 44.646ms
// HT Insert: 6.015ms
// BST Search: 1.671ms
// HT Search: 0.174ms
