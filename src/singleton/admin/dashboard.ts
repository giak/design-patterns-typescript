import SingletonDecorator from './SingletonDecorator';

/*
Add this to tsconfig.json to enable decorators in TS:
 "experimentalDecorators": true,
 "emitDecoratorMetadata": true,
*/

@SingletonDecorator
export class Dashboard {
  static instance: Dashboard;
  private table: { [id: number]: string } = {};
  constructor() {}

  public addUser(id: number, name: string): void {
    this.table[id] = name;
  }

  public consolePrint(): void {
    console.log('-----------Dashboard-----------');
    for (const key in this.table) {
      console.log(`|\t${key}\t|\t${this.table[key]}\t|`);
    }
    console.log();
  }
}

let dash01 = new Dashboard();
dash01.addUser(1, 'John');
dash01.addUser(2, 'Jane');

let dash02 = new Dashboard();
dash02.addUser(3, 'Bob');
dash02.addUser(1, '!= John');

dash01.consolePrint();
dash02.consolePrint();
