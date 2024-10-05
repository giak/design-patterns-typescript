import { BehaviorSubject, type Observable } from 'rxjs';
import type { AccountInterface } from '../models/Account.interface';
import type { TransactionInterface } from '../models/Transaction.interface';
import { FinanceError, type FinanceService } from '../services/FinanceService';

export type TransactionType = 'all' | 'credit' | 'debit';

/**
 * FinanceBloc class responsible for managing the financial data flow
 * This class acts as a mediator between the data layer (FinanceService) and the presentation layer
 * It manages the state of accounts and transactions, and provides methods to interact with this state
 */
export class FinanceBloc {
  private financeService: FinanceService;

  private accountsSubject: BehaviorSubject<AccountInterface[]>;
  /** Observable stream of accounts */
  public accounts$: Observable<AccountInterface[]>;

  private transactionsSubject: BehaviorSubject<TransactionInterface[]>;
  /** Observable stream of transactions */
  public transactions$: Observable<TransactionInterface[]>;

  private errorSubject: BehaviorSubject<string | null>;
  /** Observable stream of errors */
  public error$: Observable<string | null>;

  private accountsCache: AccountInterface[] = [];
  private transactionsCache: Map<number, TransactionInterface[]> = new Map();

  private currentTransactionType: TransactionType = 'all';

  /**
   * Creates an instance of FinanceBloc
   * @param {FinanceService} financeService - The service to interact with financial data
   */
  constructor(financeService: FinanceService) {
    this.financeService = financeService;
    this.accountsSubject = new BehaviorSubject<AccountInterface[]>([]);
    this.accounts$ = this.accountsSubject.asObservable();
    this.transactionsSubject = new BehaviorSubject<TransactionInterface[]>([]);
    this.transactions$ = this.transactionsSubject.asObservable();
    this.errorSubject = new BehaviorSubject<string | null>(null);
    this.error$ = this.errorSubject.asObservable();

    this.loadAccounts();
  }

  /**
   * Loads all accounts from the service and updates the accounts subject
   * Uses caching to avoid unnecessary service calls
   * @private
   */
  private async loadAccounts(): Promise<void> {
    try {
      if (this.accountsCache.length === 0) {
        const accounts = await this.financeService.getAccounts();
        this.accountsCache = accounts;
      }
      this.accountsSubject.next(this.accountsCache);
      this.errorSubject.next(null);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Loads transactions for a specific account and filters them by type
   * Uses caching to avoid unnecessary service calls
   * @param {number} accountId - The ID of the account
   * @param {TransactionType} type - The type of transactions to filter
   * @public
   */
  public async loadTransactions(accountId: number, type: TransactionType = 'all'): Promise<void> {
    try {
      if (!this.transactionsCache.has(accountId)) {
        const transactions = await this.financeService.getTransactions(accountId);
        this.transactionsCache.set(accountId, transactions);
      }
      const cachedTransactions = this.transactionsCache.get(accountId) || [];
      this.currentTransactionType = type;
      const filteredTransactions = this.filterTransactions(cachedTransactions, type);
      this.transactionsSubject.next(filteredTransactions);
      this.errorSubject.next(null);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Filters transactions by type
   * @param {TransactionInterface[]} transactions - The transactions to filter
   * @param {TransactionType} type - The type of transactions to filter
   * @returns {TransactionInterface[]} The filtered transactions
   * @private
   */
  private filterTransactions(transactions: TransactionInterface[], type: TransactionType): TransactionInterface[] {
    if (type === 'all') {
      return transactions;
    }
    return transactions.filter((tx) => tx.type === type);
  }

  /**
   * Adds a new transaction after validating its data
   * Updates the accounts and transactions cache after adding
   * @param {TransactionInterface} transaction - The transaction to add
   * @public
   */
  public async addTransaction(transaction: TransactionInterface): Promise<void> {
    try {
      this.validateTransaction(transaction);
      await this.financeService.addTransaction(transaction);

      // Update caches
      this.accountsCache = [];
      this.transactionsCache.delete(transaction.accountId);

      await this.loadAccounts();
      await this.loadTransactions(transaction.accountId);
      this.errorSubject.next(null);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Validates transaction data
   * @param {TransactionInterface} transaction - The transaction to validate
   * @throws {FinanceError} If the transaction data is invalid
   * @private
   */
  private validateTransaction(transaction: TransactionInterface): void {
    if (!transaction.accountId || typeof transaction.accountId !== 'number') {
      throw new FinanceError('Invalid account ID');
    }
    if (!transaction.amount || typeof transaction.amount !== 'number') {
      throw new FinanceError('Invalid transaction amount');
    }
    if (!transaction.date || !(transaction.date instanceof Date)) {
      throw new FinanceError('Invalid transaction date');
    }
    if (!transaction.description || typeof transaction.description !== 'string') {
      throw new FinanceError('Invalid transaction description');
    }
    if (transaction.type !== 'credit' && transaction.type !== 'debit') {
      throw new FinanceError('Invalid transaction type');
    }
  }

  /**
   * Handles errors by updating the error subject
   * @param {unknown} error - The error to handle
   * @private
   */
  private handleError(error: unknown): void {
    if (error instanceof FinanceError) {
      this.errorSubject.next(error.message);
    } else if (error instanceof Error) {
      this.errorSubject.next(error.message);
    } else {
      this.errorSubject.next('An unknown error occurred');
    }
  }
}
