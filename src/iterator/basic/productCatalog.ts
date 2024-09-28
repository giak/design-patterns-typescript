interface ProductInterface {
  id: string;
  name: string;
  price: number;
}

class ProductCatalog implements Iterable<ProductInterface> {
  private products: ProductInterface[] = [];

  addProduct(product: ProductInterface): void {
    this.products.push(product);
  }

  *[Symbol.iterator](): Iterator<ProductInterface> {
    yield* this.products;
  }

  *getPriceSortedIterator(): Iterator<ProductInterface> {
    yield* this.products.sort((a, b) => a.price - b.price);
  }
}

// Utilisation
const catalog = new ProductCatalog();
catalog.addProduct({ id: '1', name: 'Laptop', price: 999 });
catalog.addProduct({ id: '2', name: 'Mouse', price: 29 });

for (const product of catalog) {
  console.log(`${product.name}: $${product.price}`);
}

console.log('Sorted by price:');
const iterator = catalog.getPriceSortedIterator();
let result = iterator.next();
while (!result.done) {
  const product = result.value;
  console.log(`${product.name}: $${product.price}`);
  result = iterator.next();
}

export type {};
