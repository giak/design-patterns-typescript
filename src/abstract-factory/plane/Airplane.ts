export interface AirplaneInterface {
  prefix: string;
  manufacturer: string;
  aircraft: string;
}

export abstract class Airplane implements AirplaneInterface {
  constructor(private _prefix: string, private _manufacturer: string, private _aircraft: string) {}

  get prefix(): string {
    return this._prefix;
  }

  get manufacturer(): string {
    return this._manufacturer;
  }

  get aircraft(): string {
    return this._aircraft;
  }
}
