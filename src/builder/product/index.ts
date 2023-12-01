class Product {
  private parts: string[] = [];
  addPart(part: string): void {
    this.parts.push(part);
  }
  show(): string {
    return this.parts.join(', ');
  }
}

interface ProductBuilderInterface {
  buildPartA(): void;
  buildPartB(): void;
}

class ProductConcreteBuilder1 implements ProductBuilderInterface {
  private product = new Product();
  buildPartA(): void {
    this.product.addPart('PartA1');
  }
  buildPartB(): void {
    this.product.addPart('PartB1');
  }
  getResult(): Product {
    return this.product;
  }
}

class ProductConcreteBuilder2 implements ProductBuilderInterface {
  private product = new Product();
  buildPartA(): void {
    this.product.addPart('PartA2');
  }
  buildPartB(): void {
    this.product.addPart('PartB2');
  }
  getResult(): Product {
    return this.product;
  }
}

class ProductDirector {
  construct(builder: ProductBuilderInterface): void {
    builder.buildPartA();
    builder.buildPartB();
  }
}

const director = new ProductDirector();
const builder1 = new ProductConcreteBuilder1();
director.construct(builder1);
console.log('Product 1: ' + builder1.getResult().show());
const builder2 = new ProductConcreteBuilder2();
director.construct(builder2);
console.log('Product 2: ' + builder2.getResult().show());
