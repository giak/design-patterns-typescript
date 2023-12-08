import { CacheInterface } from "./CacheInterface";

export abstract class CacheDecorator implements CacheInterface {
  constructor(protected _inner: CacheInterface) {}

  get(key: string): string {
    return this._inner.get(key);
  }

  set(key: string, value: string): void {
    this._inner.set(key, value);
  }

  exists(key: string): boolean {
    return this._inner.exists(key);
  }
}
