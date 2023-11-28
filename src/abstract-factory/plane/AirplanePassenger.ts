import { AirplaneInterface, Airplane } from './Airplane';

interface AirplanePassengerInterface extends AirplaneInterface {
  passengerCapacity: number;
  buyTicket(): void;
}

export class AirplanePassenger extends Airplane implements AirplanePassengerInterface {
  constructor(prefix: string, manufacturer: string, aircraft: string, private _passengerCapacity: number) {
    super(prefix, manufacturer, aircraft);
  }

  get prefix(): string {
    return super.prefix;
  }

  get manufacturer(): string {
    return super.manufacturer;
  }

  get aircraft(): string {
    return super.aircraft;
  }

  get passengerCapacity(): number {
    return this._passengerCapacity;
  }

  public buyTicket(): string {
    return `New ticket emitted to ${this.manufacturer} ${this.aircraft} - Prefix: ${this.prefix}`;
  }
}
