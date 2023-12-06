export class UserStore {
  private _data: any[];

  constructor() {
    this._data = [];
  }

  add(item: any) {
    this._data.push(item);
  }

  get(id: number) {
    return this._data.find((d) => d.id === id);
  }
}
