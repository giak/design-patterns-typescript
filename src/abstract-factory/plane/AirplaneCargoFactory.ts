import { AirplaneFactory } from './AirplaneFactory';
import { AirplaneCargo } from './AirplaneCargo';

export class AirplaneCargoFactory extends AirplaneFactory {
  public create(prefix: string, manufacturer: string, aircraft: string, payload: number): AirplaneCargo {
    return new AirplaneCargo(prefix, manufacturer, aircraft, payload);
  }
}
