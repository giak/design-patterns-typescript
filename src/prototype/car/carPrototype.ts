class Car {
  constructor(public model: string, public year: number, public miles: number) {}
}

Car.prototype.toString = function () {
  return `${this.model} has done ${this.miles} miles`;
};

const car = new Car('Renault', 1975, 120000);
const carInfo = car.toString();

console.log(carInfo);

// avoid error `duplicate identifier` by isolate scope
export {};
