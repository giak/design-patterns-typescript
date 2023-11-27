/* Simple Factory Design Pattern */

import { GenericFactory } from './genericFactory';

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

const walletClassMap: Record<WalletTypes, new (balance: number) => Wallet> = {
  [WalletTypes.HARDWARE]: WalletHardware,
  [WalletTypes.WEB]: WalletWeb,
  [WalletTypes.MOBILE]: WalletMobile,
  [WalletTypes.PC]: WalletPC,
};

export const WalletFactory = new GenericFactory<Wallet, [number]>(walletClassMap);

const wallet = WalletFactory.create(WalletTypes.HARDWARE, 10);
console.log(wallet.name);
console.log(wallet.getBalance());
