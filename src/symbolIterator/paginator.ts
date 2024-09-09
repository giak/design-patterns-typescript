class Pagination<T> implements Iterable<T[]> {
  private items: T[];
  private pageSize: number;

  constructor(items: T[], pageSize: number) {
    this.items = items;
    this.pageSize = pageSize;
  }

  *[Symbol.iterator](): Iterator<T[]> {
    for (let i = 0; i < this.items.length; i += this.pageSize) {
      yield this.items.slice(i, i + this.pageSize);
    }
  }

  public get totalPages(): number {
    return Math.ceil(this.items.length / this.pageSize);
  }
}

// Exemple d'utilisation
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const pagination = new Pagination(data, 3);

console.log(`Nombre total de pages : ${pagination.totalPages}`);

for (const page of pagination) {
  console.log("Page :", page);
}
