import { Airplane } from '../Airplane';
import { AirplaneCargo } from '../AirplaneCargo';
import { AirplanePassenger } from '../AirplanePassenger';

import { AirplaneFactory } from '../AirplaneFactory';
import { AirplaneCargoFactory } from '../AirplaneCargoFactory';
import { AirplanePassengerFactory } from '../AirplanePassengerFactory';

describe('Passenger airplane factory', () => {
  let registration = '800';
  let manufacturer = 'Airbus';
  let model = 'A380';
  let seats = 853;

  let airplanePassengerFactory: AirplanePassengerFactory;
  beforeEach(() => {
    airplanePassengerFactory = new AirplanePassengerFactory();
  });

  it('is a instance of Airplane factory', () => {
    expect(airplanePassengerFactory).toBeInstanceOf(AirplaneFactory);
  });
  it('is a instance of Passenger airplane factory', () => {
    expect(airplanePassengerFactory).toBeInstanceOf(AirplanePassengerFactory);
  });
  it('creates a airplane and passenger airplane product', () => {
    const A380 = airplanePassengerFactory.create(registration, manufacturer, model, seats);
    expect(A380).toBeInstanceOf(Airplane);
    expect(A380).toBeInstanceOf(AirplanePassenger);
  });
  it('does not create a cargo airplane product', () => {
    const A380 = airplanePassengerFactory.create(registration, manufacturer, model, seats);
    expect(A380).not.toBeInstanceOf(AirplaneCargo);
  });

  it('creates a passenger airplane with correct properties', () => {
    const A380 = airplanePassengerFactory.create(registration, manufacturer, model, seats);
    expect(A380.prefix).toBe(registration);
    expect(A380.manufacturer).toBe(manufacturer);
    expect(A380.aircraft).toBe(model);
    expect(A380.passengerCapacity).toBe(seats);
  });

  it('should buy tickets correctly', () => {
    const A380 = airplanePassengerFactory.create(registration, manufacturer, model, seats);
    expect(A380.buyTicket()).toBe(`New ticket emitted to ${manufacturer} ${model} - Prefix: ${registration}`);
  });
});

describe('Cargo airplane factory', () => {
  let registration = 'NEO';
  let manufacturer = 'Airbus';
  let model = 'A320';
  let seats = 180;

  let airplaneCargoFactory: AirplaneCargoFactory;
  beforeEach(() => {
    airplaneCargoFactory = new AirplaneCargoFactory();
  });

  it('is a instance of Airplane factory', () => {
    expect(airplaneCargoFactory).toBeInstanceOf(AirplaneFactory);
  });

  it('is a instance of Cargo airplane factory', () => {
    expect(airplaneCargoFactory).toBeInstanceOf(AirplaneCargoFactory);
  });

  it('creates a airplane and cargo airplane product', () => {
    const A320 = airplaneCargoFactory.create(registration, manufacturer, model, seats);
    expect(A320).toBeInstanceOf(Airplane);
    expect(A320).toBeInstanceOf(AirplaneCargo);
  });

  it('does not create a passenger airplane product', () => {
    const A320 = airplaneCargoFactory.create(registration, manufacturer, model, seats);
    expect(A320).not.toBeInstanceOf(AirplanePassenger);
  });

  it('creates a cargo airplane with correct properties', () => {
    const A320 = airplaneCargoFactory.create(registration, manufacturer, model, seats);
    expect(A320.prefix).toBe(registration);
    expect(A320.manufacturer).toBe(manufacturer);
    expect(A320.aircraft).toBe(model);
    expect(A320.payload).toBe(seats);
  });

  it('should load cargo correctly', () => {
    const A320 = airplaneCargoFactory.create(registration, manufacturer, model, seats);
    expect(A320.loadCargo(seats - 1)).toBe(`${seats - 1} loaded to ${manufacturer} ${model} - Prefix: ${registration}`);
  });
});
