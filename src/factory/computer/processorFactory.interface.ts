import StorageInterface from './storageFactory.interface';

export default interface ProcessorFactoryInterface {
  attachStorage(storage: StorageInterface): string;

  showSpecs(): string;
}
