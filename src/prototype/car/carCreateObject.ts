const carPrototype = {
  drive() {
    console.log('drive');
  },
  panic() {
    console.log('panic');
  },
};

const createCar = (name: string) => {
  const car = Object.create(carPrototype);
  car.name = name;
  return car;
};

const myCar = createCar('Citroën 2 CV');
console.log(myCar.name);
myCar.drive();
myCar.panic();

const myCar2 = createCar('Renault 4L');
console.log(myCar2.name);
