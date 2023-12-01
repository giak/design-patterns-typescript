interface ThenFinallyBuilderInterface<T> {
  value: T;
  then(next: (val: T) => T): ThenFinallyBuilderInterface<T>;
  finally(): T;
}

class StringBuilder implements ThenFinallyBuilderInterface<string> {
  constructor(public value: string) {}

  then(nextThen: (val: string) => string): StringBuilder {
    return new StringBuilder(nextThen(this.value));
  }

  finally(): string {
    return this.value;
  }
}

const capitalizeWords = (str: string): string => {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const myName = 'vernon, earl of shipbrook  ';

const newString = new StringBuilder(myName)
  .then((str) => str.trim()) // Anonymous function
  .then(capitalizeWords) // Use a function
  .finally(); // Get the new value

console.log(`newString`, newString);
