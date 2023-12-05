class CarPrototype {
  constructor(public model: string) {}

  getModel() {
    console.log(`The model of this vehicle is... ${this.model}`);
  }

  clone() {}
}

class Car extends CarPrototype {
  constructor(public model: string) {
    super(model);
  }

  clone() {
    return new Car(this.model);
  }
}

const carObject = new Car('Citroën 2 CV');
console.log(`carObject`, carObject);
carObject.getModel();

const carClone = carObject.clone();
console.log(`carClone`, carClone);
carClone.getModel();
