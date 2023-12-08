/*
Play with TypeScript 5 decorators
*/

function log(target: any, key: string, descriptor: PropertyDescriptor) {
  console.log(`Called ${key}()`);
}

function validate(target: any, key: string, descriptor: PropertyDescriptor) {
  // Method to decorate
  const originalMethod = descriptor.value;

  // Redefine the method
  descriptor.value = function (...args: any[]) {
    if (args.length < 2) {
      throw new Error('Expected at least two arguments');
    }
    originalMethod.apply(this, args);
  };

  return descriptor;
}

function memoize() {
  const cache: Map<string, any> = new Map();
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const cacheKey = `${key}:${args.join(',')}`;
      console.log('cacheKey', cacheKey);
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
      }
      const result = originalMethod.apply(this, args);
      cache.set(cacheKey, result);
      return result;
    };
    return descriptor;
  };
}

function logWithPrefix(prefix: string) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      console.log(`[${prefix}] Before ${key}()`);
      const result = originalMethod.apply(this, args);
      console.log(`[${prefix}] After ${key}()`);
      return result;
    };
    return descriptor;
  };
}

const checkIfUserIsAuthenticated = () => {
  return true;
};
function auth(target: any, key: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    const isAuthenticated = checkIfUserIsAuthenticated();
    if (!isAuthenticated) {
      console.log('User is not authenticated');
      return;
    }
    console.log('User is authenticated');

    originalMethod.apply(this, args);
  };

  return descriptor;
}

class Example {
  @log
  @validate
  @logWithPrefix('MyClass')
  foo(a: number, b: number) {
    console.log(a + b);
  }

  @memoize()
  fib(n: number): number {
    if (n < 2) {
      return n;
    }
    return this.fib(n - 1) + this.fib(n - 2);
  }

  @auth
  getProfile(): object {
    return {
      name: 'John',
      age: 30,
    };
  }

  @auth
  updateProfile(profileData: { name: string; age: number }) {}
}

const example = new Example();

example.foo(2, 5);

const fib = example.fib(10);
console.log(fib);

const userProfile = example.getProfile();
console.log(userProfile);
