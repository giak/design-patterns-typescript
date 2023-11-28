import { AirplaneFactory } from './AirplaneFactory';
import { AirplanePassenger } from './AirplanePassenger';

export class AirplanePassengerFactory extends AirplaneFactory {
  public create(prefix: string, manufacturer: string, aircraft: string, passengerCapacity: number): AirplanePassenger {
    return new AirplanePassenger(prefix, manufacturer, aircraft, passengerCapacity);
  }
}
