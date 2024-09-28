interface DatabaseRecordInterface {
  id: number;
  data: string;
}

class DatabaseResultSet implements Iterable<DatabaseRecordInterface> {
  private records: DatabaseRecordInterface[] = [];

  constructor(query: string) {
    // Simulation de requête DB
    this.records = [
      { id: 1, data: 'Record 1' },
      { id: 2, data: 'Record 2' },
      { id: 3, data: 'Record 3' },
    ];
  }

  *[Symbol.iterator](): Iterator<DatabaseRecordInterface> {
    yield* this.records;
  }
}

// Utilisation
const resultSet = new DatabaseResultSet('SELECT * FROM users');
for (const record of resultSet) {
  console.log(`ID: ${record.id}, Data: ${record.data}`);
}
