import * as path from 'path';
import { performance } from 'perf_hooks';
import { FILE_PATH } from './const';
import { CacheInterface } from './CacheInterface';
import { FileCache } from './FileCache';
import { BufferedCache } from './BufferedCache';
import { SecuredCache } from './SecuredCache';

class Client {
  constructor(private readonly _cache: CacheInterface) {}

  setData(): void {
    this._cache.set('user1', JSON.stringify({ id: 1, name: 'John Doe', email: 'john.doe@example.com' }));
    this._cache.set('user2', JSON.stringify({ id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' }));
    this._cache.set('post1', JSON.stringify({ id: 1, title: 'First Post', content: 'This is the first post.' }));
    this._cache.set('user1', JSON.stringify({ id: 1, name: 'John Doe', email: 'john.doe@newexample.com' }));

    const a = this._cache.get('user1');
    const b = this._cache.get('user2');
    const c = this._cache.get('post1');
    const d = this._cache.get('user1');
    console.log(`The entry with key a has value: ${a}`);
    console.log(`The entry with key b has value: ${b}`);
    console.log(`The entry with key c has value: ${c}`);
    console.log(`The entry with key c has value: ${d}`);
  }

  getData(key: string): void {
    const a = this._cache.get(key);
    console.log(`The entry with key a has value: ${a}`);
  }

  treatment(): void {
    const sw = performance.now();
    this._cache.set('post2', JSON.stringify({ id: 2, name: 'Second post', email: 'This is the second post.' }));
    let numTotalOfChars = 0;
    for (let i = 0; i < 1000; i++) {
      const value = this._cache.get('post2');
      numTotalOfChars += value.length;
    }
    console.log('numTotalOfChars', numTotalOfChars);
    const elapsed = performance.now() - sw;
    console.log(`The work is finished after ${elapsed} ms`);
  }
}

function cacheBufferedSecured(): void {
  const cache = new FileCache(path.join(`${FILE_PATH}cacheBufferedSecured`, 'cache'));
  const bufferedCache = new BufferedCache(cache);
  const securedAndBufferedCache = new SecuredCache(
    path.join(`${FILE_PATH}cacheBufferedSecured`, 'hashes'),
    bufferedCache,
  );

  const client = new Client(securedAndBufferedCache);
  client.setData();
  client.getData('user1');
  client.treatment();
}

cacheBufferedSecured();
