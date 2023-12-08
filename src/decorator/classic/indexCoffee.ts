interface CoffeeInterface {
  cost(): number;
  description(): string;
}

class SimpleCoffee implements CoffeeInterface {
  cost(): number {
    return 1;
  }

  description(): string {
    return 'Simple coffee';
  }
}

abstract class CoffeeDecorator implements CoffeeInterface {
  constructor(protected coffee: CoffeeInterface) {}

  abstract cost(): number;
  abstract description(): string;
}

class MilkDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 0.5;
  }

  description(): string {
    return `${this.coffee.description()}, milk`;
  }
}

class SugarDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 0.2;
  }

  description(): string {
    return `${this.coffee.description()}, sugar`;
  }
}

class WhippedCreamDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 0.7;
  }

  description(): string {
    return `${this.coffee.description()}, whipped cream`;
  }
}

class CaramelDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 0.6;
  }

  description(): string {
    return `${this.coffee.description()}, caramel`;
  }
}

let coffee: CoffeeInterface = new SimpleCoffee();
coffee = new MilkDecorator(coffee);
coffee = new SugarDecorator(coffee);
coffee = new WhippedCreamDecorator(coffee);
coffee = new CaramelDecorator(coffee);

console.log(`Cost: ${coffee.cost()} €`);
console.log(`Description: ${coffee.description()}`);
