import { CacheDecorator } from "./CacheDecorator";
import { CacheInterface } from "./CacheInterface";

export class BufferedCache extends CacheDecorator {
  private values: { [key: string]: string };

  constructor(inner: CacheInterface) {
    super(inner);
    this.values = {};
  }

  get(key: string): string {
    if (this.values[key]) {
      return this.values[key];
    }
    const entry = this._inner.get(key);
    this.values[key] = entry;
    return entry;
  }

  set(key: string, value: string): void {
    if (this.values[key]) {
      delete this.values[key];
    }
    this._inner.set(key, value);
    this.values[key] = value;
  }
}
