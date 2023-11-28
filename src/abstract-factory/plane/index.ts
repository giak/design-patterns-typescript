import { AirplanePassengerFactory } from './AirplanePassengerFactory';
import { AirplaneCargoFactory } from './AirplaneCargoFactory';

const airplanePassengerFactory = new AirplanePassengerFactory();

const airplaneCargoFactory = new AirplaneCargoFactory();

const A380 = airplanePassengerFactory.create('800', 'Airbus', 'A380', 853);

const A320 = airplaneCargoFactory.create('NEO', 'Airbus', 'A320', 180);

A380.buyTicket();
A320.loadCargo(160);
