import { AirplaneInterface, Airplane } from './Airplane';

interface AirplaneCargoInterface extends AirplaneInterface {
  payload: number;
  loadCargo(weight: number): void;
}

export class AirplaneCargo extends Airplane implements AirplaneCargoInterface {
  constructor(prefix: string, manufacturer: string, aircraft: string, private _payload: number) {
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

  get payload(): number {
    return this._payload;
  }

  public loadCargo(weight: number): string {
    return `${weight} loaded to ${this.manufacturer} ${this.aircraft} - Prefix: ${this.prefix}`;
  }
}
