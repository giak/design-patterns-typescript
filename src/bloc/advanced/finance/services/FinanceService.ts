import type { AccountInterface } from '../models/Account.interface';
import type { TransactionInterface } from '../models/Transaction.interface';

/**
 * Custom error class for finance-related errors
 */
export class FinanceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FinanceError';
  }
}

/**
 * FinanceService class responsible for managing financial data
 * This class simulates a data layer that could be connected to a real database or API
 */
export class FinanceService {
  private accounts: AccountInterface[] = [
    { id: 1, name: 'Compte Courant', balance: 1000 },
    { id: 2, name: 'Livret A', balance: 5000 },
  ];

  private transactions: TransactionInterface[] = [
    {
      id: 1,
      accountId: 1,
      amount: -50,
      date: new Date('2023-01-15'),
      description: 'Achat Supermarché',
      type: 'debit',
    },
    {
      id: 2,
      accountId: 1,
      amount: -30,
      date: new Date('2023-01-20'),
      description: 'Restaurant',
      type: 'debit',
    },
    {
      id: 3,
      accountId: 1,
      amount: 1000,
      date: new Date('2023-02-01'),
      description: 'Salaire',
      type: 'credit',
    },
    {
      id: 4,
      accountId: 2,
      amount: 200,
      date: new Date('2023-02-05'),
      description: 'Épargne mensuelle',
      type: 'credit',
    },
    {
      id: 5,
      accountId: 1,
      amount: -150,
      date: new Date('2023-02-10'),
      description: 'Facture électricité',
      type: 'debit',
    },
    {
      id: 6,
      accountId: 1,
      amount: -80,
      date: new Date('2023-02-15'),
      description: 'Achat en ligne',
      type: 'debit',
    },
  ];

  /**
   * Retrieves all accounts
   * @returns {Promise<AccountInterface[]>} A promise that resolves to an array of accounts
   * @throws {FinanceError} If there's an error retrieving the accounts
   */
  async getAccounts(): Promise<AccountInterface[]> {
    try {
      // Simulating an asynchronous operation
      await new Promise((resolve) => setTimeout(resolve, 100));
      return this.accounts;
    } catch (error) {
      throw new FinanceError('Failed to retrieve accounts');
    }
  }

  /**
   * Retrieves transactions for a specific account
   * @param {number} accountId - The ID of the account
   * @returns {Promise<TransactionInterface[]>} A promise that resolves to an array of transactions
   * @throws {FinanceError} If there's an error retrieving the transactions or if the account doesn't exist
   */
  async getTransactions(accountId: number): Promise<TransactionInterface[]> {
    try {
      // Simulating an asynchronous operation
      await new Promise((resolve) => setTimeout(resolve, 100));

      const account = this.accounts.find((acc) => acc.id === accountId);
      if (!account) {
        throw new FinanceError(`Account with ID ${accountId} not found`);
      }

      const accountTransactions = this.transactions.filter((tx) => tx.accountId === accountId);
      return accountTransactions;
    } catch (error) {
      if (error instanceof FinanceError) {
        throw error;
      }
      throw new FinanceError(`Failed to retrieve transactions for account ${accountId}`);
    }
  }

  /**
   * Adds a new transaction and updates the corresponding account balance
   * @param {TransactionInterface} transaction - The transaction to add
   * @throws {FinanceError} If there's an error adding the transaction or if the account doesn't exist
   */
  async addTransaction(transaction: TransactionInterface): Promise<void> {
    try {
      // Simulating an asynchronous operation
      await new Promise((resolve) => setTimeout(resolve, 100));

      const account = this.accounts.find((acc) => acc.id === transaction.accountId);
      if (!account) {
        throw new FinanceError(`Account with ID ${transaction.accountId} not found`);
      }

      this.transactions.push(transaction);
      account.balance += transaction.amount;
    } catch (error) {
      if (error instanceof FinanceError) {
        throw error;
      }
      throw new FinanceError('Failed to add transaction');
    }
  }
}
