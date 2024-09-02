const fs = require('node:fs');
const readline = require('node:readline');
import type { FileReaderInterface } from './interfaces';

export class FileReader implements FileReaderInterface {
  async *read(filePath: string): AsyncGenerator<string, void, undefined> {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Number.POSITIVE_INFINITY,
    });

    for await (const line of rl) {
      yield line;
    }
  }
}
