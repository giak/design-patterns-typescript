type JSONValueType = string | number | boolean | null | JSONObjectInterface | JSONArrayInterface;

interface JSONObjectInterface {
  [key: string]: JSONValueType;
}

interface JSONArrayInterface extends Array<JSONValueType> {}

class JSONIterator implements IterableIterator<[string, JSONValueType]> {
  private stack: Array<[string, JSONValueType]>;

  constructor(private json: JSONObjectInterface) {
    this.stack = Object.entries(json).reverse();
  }

  [Symbol.iterator](): IterableIterator<[string, JSONValueType]> {
    return this;
  }

  next(): IteratorResult<[string, JSONValueType]> {
    const entry = this.stack.pop();
    if (entry === undefined) {
      return { done: true, value: undefined };
    }

    const [key, value] = entry;

    if (typeof value === 'object' && value !== null) {
      this.stack.push(
        ...Object.entries(value)
          .reverse()
          .map(([k, v]): [string, JSONValueType] => [`${key}.${k}`, v]),
      );
    }

    return { done: false, value: [key, value] };
  }
}

class JSONFlattener implements Iterable<[string, JSONValueType]> {
  constructor(private json: JSONObjectInterface) {}

  [Symbol.iterator](): IterableIterator<[string, JSONValueType]> {
    return new JSONIterator(this.json);
  }
}

// Utilisation
const jsonData = {
  user: {
    name: 'John Doe',
    age: 30,
    address: {
      street: '123 Main St',
      city: 'Anytown',
    },
  },
  orders: [
    { id: 1, total: 50 },
    { id: 2, total: 75 },
  ],
};

const flattener = new JSONFlattener(jsonData);

for (const [key, value] of flattener) {
  if (typeof value !== 'object') {
    console.log(`${key}: ${value}`);
  }
}
