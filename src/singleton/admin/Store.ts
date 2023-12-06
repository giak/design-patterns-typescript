import { SingletonAdvancedDecorator } from './SingletonAdvancedDecorator';

/*
Add this to tsconfig.json to enable decorators in TS:
 "experimentalDecorators": true,
 "emitDecoratorMetadata": true,
*/
@SingletonAdvancedDecorator
class Store {
  private data: { id: number }[] = [];

  public add(item: { id: number }) {
    this.data.push(item);
  }

  public get(id: number) {
    return this.data.find((d) => d.id === id);
  }
}

const myStore = new Store();
myStore.add({ id: 1 });
myStore.add({ id: 2 });
myStore.add({ id: 3 });

// cant't reset the store
const anotherStore = new Store();
// This will return the first instance `myStore` of the store
anotherStore.get(2);

console.log(anotherStore.get(2));
