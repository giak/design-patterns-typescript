/**
 * Type of whatever we want to store in the singleton
 * In this case, it is an empty object
 */
export type SingletonValue = object;

/**
 * The only instance of our Singleton
 */
let instance: ReturnType<typeof makeSingleton<SingletonValue>>;

/**
 * Singleton supplies accessors using Revealing Module
 * pattern and we use generics, since we could reuse
 * this across multiple singletons
 *
 * Note: Object.freeze() not required due to type narrowing!
 */
const makeSingleton = <T>(initial?: T) => {
  /** Closure of the singleton's value to keep it private */
  let _value: T | undefined = initial;
  /** Only the accessors are returned */
  return {
    getValue: (): T | undefined => _value,
    setValue: (value: T) => (_value = value),
  };
};

/**
 * Retrieves the only instance of the Singleton
 * and allows a once-only initialisation
 * (additional changes require the setValue accessor)
 */
const getInstance = (initial?: SingletonValue) => {
  if (!instance) {
    instance = makeSingleton<SingletonValue>(initial);
    return instance;
  }
  if (initial) {
    throw Error('Singleton already initialized');
  }
  return instance;
};

export default getInstance;
