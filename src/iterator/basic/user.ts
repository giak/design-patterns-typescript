class User {
  constructor(
    public name: string,
    public age: number,
  ) {}
}

class UserCollection {
  private users: User[] = [];

  addUser(user: User) {
    this.users.push(user);
  }

  createIterator() {
    return this.users[Symbol.iterator]();
  }
}

const users = new UserCollection();
users.addUser(new User('Alice', 30));
users.addUser(new User('Bob', 25));

const iterator = users.createIterator();
for (const user of iterator) {
  console.log(user.name);
}

export type {};
