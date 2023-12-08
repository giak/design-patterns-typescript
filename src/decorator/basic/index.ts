interface ComponentInterface {
  method(): string;
}

class Component implements ComponentInterface {
  method(): string {
    return 'Component Method';
  }
}

class Decorator implements ComponentInterface {
  constructor(private object: ComponentInterface) {}

  method(): string {
    return `Decorator Method(${this.object.method()})`;
  }
}

// Classic usage : an instance of the Object component
const component = new Component();
console.log(component.method());

// The decorated Object component
const Decorated = new Decorator(component);
console.log(Decorated.method());

// The decorated component can be decorated again
const Decorated2 = new Decorator(Decorated);
console.log(Decorated2.method());
