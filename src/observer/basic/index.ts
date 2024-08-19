interface SubjectInterface {
  addObserver(observer: ObserverInterface): void;
  removeObserver(observer: ObserverInterface): void;
  notifyObservers(): void;
}

interface ObserverInterface {
  update(subject: SubjectInterface): void;
}

class Customer implements ObserverInterface {
  constructor(private name: string) {}

  update(subject: SubjectInterface): void {
    console.log(`${this.getName()}, the product you want is back in stock.`);
  }

  getName(): string {
    return this.name;
  }
}

class Product implements SubjectInterface {
  private observers: ObserverInterface[] = [];
  constructor(private name: string) {}

  addObserver(observer: ObserverInterface): void {
    this.observers.push(observer);
  }

  removeObserver(observer: ObserverInterface): void {
    const removeIndex = this.observers.findIndex((obs) => observer === obs);
    if (removeIndex !== -1) {
      this.observers.splice(removeIndex, 1);
    }
  }

  notifyObservers(): void {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }

  restock(): void {
    this.notifyObservers();
  }

  getName(): string {
    return this.name;
  }
}

const product = new Product('Apple');

const john = new Customer('John');
const jane = new Customer('Jane');

product.addObserver(john);
product.addObserver(jane);

product.restock();

export {};
