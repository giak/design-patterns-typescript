type User = {
  id: number;
  name: string;
  email: string;
};

type DataSource<T> = {
  fetchData: () => Promise<T[]>;
};

type DataTransformer<T, U> = (data: T) => U;

// Générateur générique pour le traitement des données
async function* transformData<U>(
  source: DataSource<User>,
  transformer: (item: User) => U
): AsyncGenerator<U> {
  const data = await source.fetchData();
  for (const item of data) {
    yield transformer(item);
  }
}

// Exemple d'utilisation
const userDataSource: DataSource<User> = {
  fetchData: async () => [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
    { id: 3, name: "Charlie", email: "charlie@example.com" },
  ],
};

const userNameExtractor: DataTransformer<User, string> = (user) => user.name;

async function displayUserNames() {
  const userNameGenerator = transformData(userDataSource, userNameExtractor);

  for await (const name of userNameGenerator) {
    console.log(name);
  }
}

displayUserNames();

export type {};
