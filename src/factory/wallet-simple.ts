/* Simple Factory Design Pattern */

export enum WalletTypes {
  HARDWARE = 'Hardware',
  WEB = 'Web',
  MOBILE = 'Mobile',
  PC = 'PC',
}

export class Wallet {
  name: WalletTypes;
  balance: number;

  constructor(name: WalletTypes, balance: number) {
    this.name = name;
    this.balance = balance;
  }

  getBalance(): number {
    return this.balance;
  }
}

export class WalletHardware extends Wallet {
  constructor(balance: number) {
    super(WalletTypes.HARDWARE, balance);
  }
}

export class WalletWeb extends Wallet {
  constructor(balance: number) {
    super(WalletTypes.WEB, balance);
  }
}

export class WalletMobile extends Wallet {
  constructor(balance: number) {
    super(WalletTypes.MOBILE, balance);
  }
}

export class WalletPC extends Wallet {
  constructor(balance: number) {
    super(WalletTypes.PC, balance);
  }
}

class WalletTypeError extends Error {
  constructor(type: string) {
    super(`Invalid type ${type}. Valid types are ${Object.values(WalletTypes).join(', ')}`);
    this.name = 'WalletTypeError';
  }
}

export class WalletFactory {
  static create(type: WalletTypes, balance: number = 0) {
    switch (type) {
      case WalletTypes.HARDWARE:
        return new WalletHardware(balance);
      case WalletTypes.WEB:
        return new WalletWeb(balance);
      case WalletTypes.MOBILE:
        return new WalletMobile(balance);
      case WalletTypes.PC:
        return new WalletPC(balance);
      default:
        throw new WalletTypeError(type);
    }
  }
}

const wallet = WalletFactory.create(WalletTypes.HARDWARE, 10);
console.log(wallet.name);
console.log(wallet.getBalance());
