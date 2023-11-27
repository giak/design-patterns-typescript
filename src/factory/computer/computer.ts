import ComputerFactoryInterface, { ComputerConstructorInterface } from './computerFactory.interface';
import ComputerProcessor from './computerProcessor';
import ComputerStorage from './computerStorage';

export class Computer implements ComputerFactoryInterface {
  constructor(private data: ComputerConstructorInterface) {}

  createProcessor(): any {
    return new ComputerProcessor(this.data.chip);
  }

  createStorage(): any {
    return new ComputerStorage(this.data.storage);
  }
}
