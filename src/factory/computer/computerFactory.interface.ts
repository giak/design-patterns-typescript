import ProcessorFactoryInterface from './processorFactory.interface';
import StorageFactoryInterface from './storageFactory.interface';

export default interface ComputerFactoryInterface {
  createProcessor(): ProcessorFactoryInterface;

  createStorage(): StorageFactoryInterface;
}

export interface ComputerConstructorInterface {
  storage: ComputerStorageInterface;
  chip: ComputerChipInterface;
}

export interface ComputerStorageInterface {
  size: number;
}

export interface ComputerChipInterface {
  brand: string;
  name: string;
}
