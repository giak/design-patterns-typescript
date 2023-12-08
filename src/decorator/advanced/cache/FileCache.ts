import * as fs from "fs";
import * as path from "path";
import { CacheInterface } from "./CacheInterface";

export class FileCache implements CacheInterface {
  constructor(private readonly _location: string) {
    if (!fs.existsSync(_location)) {
      fs.mkdirSync(_location, { recursive: true });
    }
  }

  getFilePath(key: string): string {
    return path.join(this._location, key);
  }

  exists(key: string): boolean {
    return fs.existsSync(this.getFilePath(key));
  }

  get(key: string): string {
    if (!this.exists(key)) {
      throw new Error(`Key not found: ${key}`);
    }

    return fs.readFileSync(this.getFilePath(key), "utf8");
  }

  set(key: string, value: string): void {
    if (this.exists(key)) {
      fs.unlinkSync(this.getFilePath(key));
    }

    fs.writeFileSync(this.getFilePath(key), value);
  }
}
