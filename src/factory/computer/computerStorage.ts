import { ComputerStorageInterface } from './computerFactory.interface';
import StorageFactoryInterface from './storageFactory.interface';

export default class ComputerStorage implements StorageFactoryInterface {
  constructor(private storage: ComputerStorageInterface) {
    console.log(this.storage.size + ' GB SSD is used');
  }

  getStorageType() {
    return this.storage.size + 'GB SSD';
  }
}
