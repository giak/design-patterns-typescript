export interface CacheInterface {
  get(key: string): string;
  set(key: string, value: string): void;
  exists(key: string): boolean;
}
