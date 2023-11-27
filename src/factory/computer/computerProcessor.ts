import { ComputerChipInterface } from './computerFactory.interface';
import ProcessorFactoryInterface from './processorFactory.interface';
import StorageFactoryInterface from './storageFactory.interface';

export default class ComputerProcessor implements ProcessorFactoryInterface {
  storage: string | undefined;
  constructor(private data: ComputerChipInterface) {
    console.log(this.data.brand + ' brand and ' + this.data.name + 'is used');
  }

  ComputerProcessor() {
    console.log(`Computer is built using ${this.data} brand`);
  }

  attachStorage(storageAttached: StorageFactoryInterface) {
    this.storage = storageAttached.getStorageType();
    console.log('storageAttached', storageAttached.getStorageType());
    return this.storage + ' Attached to Computer';
  }
  showSpecs(): string {
    return this.toString();
  }

  toString(): string {
    return `ComputerProcessor is created using ${this.data.brand} ${this.data.name} and ${this.storage}`;
  }
}
