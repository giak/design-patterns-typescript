export interface TransactionInterface {
  id: number;
  accountId: number;
  amount: number;
  date: Date;
  description: string;
  type: 'credit' | 'debit';
}
