
export default function SingletonDecorator<T extends new (...args: any[]) => any>(ctr: T): T {
  let instance: T;

  return class {
    constructor(...args: any[]) {
      if (instance) {
        console.error('You cannot instantiate a singleton twice!');
        return instance;
      }

      instance = new ctr(...args);
      return instance;
    }
  } as T;
}
