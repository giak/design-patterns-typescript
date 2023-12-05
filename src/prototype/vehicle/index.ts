import { EngineInterface, DieselEngine, PetrolEngine } from './engine';

interface VehicleInterface {
  clone(): VehicleInterface;
  count(): void;
  getEngine(): void;
}

const randomNumber = () => Math.floor(Math.random() * 10000);

class Renault implements VehicleInterface {
  constructor(public model: string, public engine: EngineInterface) {}

  clone() {
    return new Renault(this.model, this.engine);
  }

  count() {
    console.log(`count ${this.model} : ${randomNumber()}`);
  }

  getEngine() {
    console.log(this.engine);
  }
}

class Citroen implements VehicleInterface {
  constructor(public model: string, public engine: EngineInterface) {}

  clone() {
    return new Citroen(this.model, this.engine);
  }

  count() {
    console.log(`count ${this.model} : ${randomNumber()}`);
  }

  getEngine() {
    console.log(this.engine);
  }
}

class Dacia implements VehicleInterface {
  constructor(public model: string, public engine: EngineInterface) {}

  clone() {
    return new Dacia(this.model, this.engine);
  }

  count() {
    console.log(`count ${this.model} : ${randomNumber()}`);
  }

  getEngine() {
    console.log(this.engine);
  }
}

const vehicles = [
  { name: 'renault', vehicle: new Renault('Renault 4L', new PetrolEngine(2000)) },
  { name: 'citroen', vehicle: new Citroen('Citroën 2 CV', new PetrolEngine(1999)) },
  { name: 'dacia', vehicle: new Dacia('Dacia Logan', new DieselEngine(1500)) },
];

abstract class VehicleFactory {
  abstract create(model: string): VehicleInterface;
}

function initializeModels(vehicles: { name: string; vehicle: VehicleInterface }[]): Map<string, VehicleInterface> {
  const model = new Map<string, VehicleInterface>();
  vehicles.forEach(({ name, vehicle }) => {
    model.set(name, vehicle);
  });
  return model;
}

class RussianVehicleFactory extends VehicleFactory {
  private model: Map<string, VehicleInterface>;

  constructor() {
    super();
    this.model = new Map();
    this.model = initializeModels(vehicles);
  }

  create(model: string): VehicleInterface {
    const vehicle = this.model.get(model);
    if (!vehicle) {
      throw new Error(`Model ${model} does not exist`);
    }
    return vehicle.clone();
  }
}

// Usage
const factory = new RussianVehicleFactory();
['renault', 'citroen', 'dacia']
  .map((brand) => factory.create(brand))
  .forEach((vehicle) => {
    vehicle.count();
    vehicle.getEngine();
  });
