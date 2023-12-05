export interface EngineInterface {
  ccm: number;
  fuel: string;
  engine: EngineInterface | null;
}

export class PetrolEngine implements EngineInterface {
  public fuel = 'petrol';
  public ccm: number;
  public engine: EngineInterface;

  constructor(ccm: number) {
    this.ccm = ccm;
    this.engine = new DieselEngine(555);
  }
}

export class DieselEngine implements EngineInterface {
  public fuel = 'diesel';
  public ccm: number;
  public engine: null;

  constructor(ccm: number) {
    this.ccm = ccm;
    this.engine = null;
  }
}
