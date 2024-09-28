interface TransactionInterface {
  id: string;
  amount: number;
}

class TransactionQueue implements Iterable<TransactionInterface> {
  private transactions: TransactionInterface[] = [];

  enqueue(transaction: TransactionInterface): void {
    this.transactions.push(transaction);
  }

  *[Symbol.iterator](): Iterator<TransactionInterface> {
    while (this.transactions.length > 0) {
      const transaction = this.transactions.shift();
      if (transaction !== undefined) {
        yield transaction;
      }
    }
  }
}

// Utilisation
const queue = new TransactionQueue();
queue.enqueue({ id: 'T1', amount: 100 });
queue.enqueue({ id: 'T2', amount: 200 });
queue.enqueue({ id: 'T3', amount: 150 });

for (const transaction of queue) {
  console.log(`Processing transaction ${transaction.id}: $${transaction.amount}`);
}
