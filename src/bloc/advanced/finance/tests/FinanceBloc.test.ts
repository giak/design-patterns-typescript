import { FinanceBloc, type TransactionType } from '../bloc/FinanceBloc';
import type { AccountInterface } from '../models/Account.interface';
import type { TransactionInterface } from '../models/Transaction.interface';
import { FinanceService } from '../services/FinanceService';

// Mock FinanceService
class MockFinanceService extends FinanceService {
  mockAccounts: AccountInterface[] = [{ id: 1, name: 'Test Account', balance: 1000 }];

  mockTransactions: TransactionInterface[] = [
    { id: 1, accountId: 1, amount: -50, date: new Date(), description: 'Test Transaction', type: 'debit' },
  ];

  async getAccounts(): Promise<AccountInterface[]> {
    return this.mockAccounts;
  }

  async getTransactions(accountId: number): Promise<TransactionInterface[]> {
    return this.mockTransactions.filter((tx) => tx.accountId === accountId);
  }

  async addTransaction(transaction: TransactionInterface): Promise<void> {
    this.mockTransactions.push(transaction);
    const account = this.mockAccounts.find((acc) => acc.id === transaction.accountId);
    if (account) {
      account.balance += transaction.amount;
    }
  }
}

describe('FinanceBloc', () => {
  let financeBloc: FinanceBloc;
  let mockFinanceService: MockFinanceService;

  beforeEach(() => {
    mockFinanceService = new MockFinanceService();
    financeBloc = new FinanceBloc(mockFinanceService);
  });

  test('loadAccounts should update accounts subject', async () => {
    await (financeBloc as any).loadAccounts();
    expect((financeBloc as any).accountsSubject.getValue()).toEqual(mockFinanceService.mockAccounts);
  });

  test('loadTransactions should update transactions subject', async () => {
    await financeBloc.loadTransactions(1);
    expect((financeBloc as any).transactionsSubject.getValue()).toEqual(mockFinanceService.mockTransactions);
  });

  test('addTransaction should update accounts and transactions', async () => {
    const newTransaction: TransactionInterface = {
      id: 2,
      accountId: 1,
      amount: 100,
      date: new Date(),
      description: 'New Transaction',
      type: 'credit',
    };

    await financeBloc.addTransaction(newTransaction);

    expect(mockFinanceService.mockTransactions).toContain(newTransaction);
    expect(mockFinanceService.mockAccounts[0].balance).toBe(1100);
  });

  test('filterTransactions should return correct transactions', () => {
    const allTransactions: TransactionInterface[] = [
      { id: 1, accountId: 1, amount: -50, date: new Date(), description: 'Debit', type: 'debit' },
      { id: 2, accountId: 1, amount: 100, date: new Date(), description: 'Credit', type: 'credit' },
    ];

    const filterTransactions = (transactions: TransactionInterface[], type: TransactionType) =>
      (financeBloc as any).filterTransactions(transactions, type);

    expect(filterTransactions(allTransactions, 'all')).toEqual(allTransactions);
    expect(filterTransactions(allTransactions, 'debit')).toEqual([allTransactions[0]]);
    expect(filterTransactions(allTransactions, 'credit')).toEqual([allTransactions[1]]);
  });
});
