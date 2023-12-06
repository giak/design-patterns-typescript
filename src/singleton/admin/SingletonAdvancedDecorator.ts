// https://www.typescriptlang.org/docs/handbook/decorators.html

// SINGLETON_KEY is a unique symbol that is used as a key for the singleton instance
export const SINGLETON_KEY = Symbol();

// SingletonDecoratorType is a type that extends the type T with a new property
export type SingletonDecoratorType<T extends new (...args: any[]) => any> = T & {
  [SINGLETON_KEY]: T extends new (...args: any[]) => infer I ? I : never;
};

export const SingletonAdvancedDecorator = <T extends new (...args: any[]) => any>(type: T) =>
  // The Proxy object enables you to create a proxy for another object, which can intercept and redefine fundamental operations for that object.
  new Proxy(type, {
    // Override the construct method to create a singleton instance
    construct(target: SingletonDecoratorType<T>, argsList, newTarget) {
      // If the constructor is called with a different target, construct the instance with the new target
      if (target.prototype !== newTarget.prototype) {
        return Reflect.construct(target, argsList, newTarget);
      }
      // Create instance if it doesn't exist
      if (!target[SINGLETON_KEY]) {
        target[SINGLETON_KEY] = Reflect.construct(target, argsList, newTarget);
      }
      // Return the instance
      return target[SINGLETON_KEY];
    },
  });
