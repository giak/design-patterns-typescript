/*
Bad example using TypeScript 5 decorators
*/

function addPrice(price: number) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function () {
      return originalMethod.call(this) + price;
    };
    return descriptor;
  };
}

function modifyDescription(description: string) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function () {
      return originalMethod.call(this) + description;
    };
    return descriptor;
  };
}

class SimpleCoffee {
  cost(): number {
    return 1;
  }

  description(): string {
    return 'Simple coffee';
  }
}

class MilkCoffee extends SimpleCoffee {
  @addPrice(0.5)
  cost() {
    return super.cost();
  }

  @modifyDescription(', milk')
  description() {
    return super.description();
  }
}

class SugarCoffee extends SimpleCoffee {
  @addPrice(0.1)
  cost() {
    return super.cost();
  }

  @modifyDescription(', sugar')
  description() {
    return super.description();
  }
}

class MilkAndSugarCoffee extends SimpleCoffee {
  @addPrice(0.5)
  @addPrice(0.1)
  cost() {
    return super.cost();
  }

  @modifyDescription(', milk')
  @modifyDescription(', sugar')
  description() {
    return super.description();
  }
}

let coffee = new SimpleCoffee();
console.log(`Price: ${coffee.cost()} €`);
console.log(`Description: ${coffee.description()}`);

coffee = new MilkCoffee();
console.log(`Price: ${coffee.cost()} €`);
console.log(`Description: ${coffee.description()}`);

coffee = new SugarCoffee();
console.log(`Price: ${coffee.cost()} €`);
console.log(`Description: ${coffee.description()}`);

coffee = new MilkAndSugarCoffee();
console.log(`Price: ${coffee.cost()} €`);
console.log(`Description: ${coffee.description()}`);

export {};
