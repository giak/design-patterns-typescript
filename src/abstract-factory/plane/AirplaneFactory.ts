import { Airplane } from './Airplane';
export abstract class AirplaneFactory {
  public abstract create(
    prefix: string,
    manufacturer: string,
    aircraft: string,
    payload: number,
    passengerCapacity: number,
  ): Airplane;
}
