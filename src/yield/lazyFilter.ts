interface User {
  id: number;
  name: string;
  age: number;
}

type UserPredicate = (user: User) => boolean;

function* lazyFilter(array: User[], predicate: UserPredicate) {
  for (const item of array) {
    if (predicate(item)) {
      yield item;
    }
  }
}

const users = [
  { id: 1, name: "Alice", age: 30 },
  { id: 2, name: "Bob", age: 25 },
  { id: 3, name: "Charlie", age: 35 },
  { id: 4, name: "David", age: 28 },
];

const adultUsers = lazyFilter(users, (user) => user.age >= 30);

for (const user of adultUsers) {
  console.log(user.name); // Affiche : Alice, Charlie
}

export type {};
