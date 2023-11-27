import { Computer } from './computer';
import ComputerFactoryInterface from './computerFactory.interface';
import ProcessorFactoryInterface from './processorFactory.interface';

export const buildComputer = (computerFactory: ComputerFactoryInterface): ProcessorFactoryInterface => {
  const processor = computerFactory.createProcessor();

  const storage = computerFactory.createStorage();

  processor.attachStorage(storage);

  return processor;
};

const computerData = { storage: { size: 1000 }, chip: { brand: 'AMD', name: 'Ryzen 9' } };

const computer = buildComputer(new Computer(computerData));

console.log(`computer`, computer.showSpecs());
