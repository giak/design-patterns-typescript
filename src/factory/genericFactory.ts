class WalletTypeError extends Error {
  constructor(type: string) {
    super(`Invalid type ${type}.`);
    this.name = 'TypeError';
  }
}

export interface FactoryInterface<T, Args extends any[]> {
  create(type: string, ...args: Args): T;
}

export class GenericFactory<T, Args extends any[]> implements FactoryInterface<T, Args> {
  private constructorFunc: Record<string, new (...args: Args) => T>;

  constructor(constructorFunc: Record<string, new (...args: Args) => T>) {
    this.constructorFunc = constructorFunc;
  }

  create(type: string, ...args: Args): T {
    const constructorFunc = this.constructorFunc[type];
    if (!constructorFunc) {
      throw new WalletTypeError(type);
    }
    return new constructorFunc(...args);
  }
}
