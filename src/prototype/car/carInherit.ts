const vehicle = {
  getModel() {
    // @ts-ignore
    console.log(`The model of this vehicle is... ${this.model}`);
  },
};

const carInstance = Object.create(vehicle, {
  id: {
    value: Math.random().toString(36).substr(2, 9),
    enumerable: true,
  },
  model: {
    value: 'Renault 4L',
    enumerable: true,
  },
});

carInstance.getModel();
console.log(carInstance);
