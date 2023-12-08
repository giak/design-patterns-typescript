import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import { CacheDecorator } from "./CacheDecorator";
import { CacheInterface } from "./CacheInterface";

export class SecuredCache extends CacheDecorator {
  constructor(private readonly _location: string, inner: CacheInterface) {
    super(inner);
    if (!fs.existsSync(_location)) {
      fs.mkdirSync(_location, { recursive: true });
    }
  }

  set(key: string, value: string): void {
    this._inner.set(key, value);
    const hash = this.calculateHash(value);
    this.storeHash(key, hash);
  }

  get(key: string): string {
    const entry = this._inner.get(key);
    const hash = this.calculateHash(entry);
    this.ensureHashIsValid(key, hash);
    return entry;
  }

  private calculateHash(entry: string): Buffer {
    const hash = crypto.createHash("md5");
    hash.update(entry);
    return hash.digest();
  }

  private storeHash(key: string, data: Buffer): void {
    fs.writeFileSync(path.join(this._location, key), data);
  }

  private ensureHashIsValid(key: string, hash: Buffer): void {
    const oldHash = fs.readFileSync(path.join(this._location, key));
    if (!this.compareByteArrays(oldHash, hash)) {
      throw new Error(`Hashes are not equal! Key ${key} is not valid`);
    }
  }

  private compareByteArrays(oldHash: Buffer, newHash: Buffer): boolean {
    if (newHash.length === oldHash.length) {
      for (let i = 0; i < newHash.length; i++) {
        if (newHash[i] !== oldHash[i]) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
}
