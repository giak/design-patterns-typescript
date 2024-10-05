import type { FinanceBloc, TransactionType } from '../bloc/FinanceBloc';
import { renderTransactionList } from '../components/TransactionListComponent';
import type { TransactionInterface } from '../models/Transaction.interface';

/**
 * TransactionView class responsible for rendering and managing transaction-related UI
 */
export class TransactionView {
  private financeBloc: FinanceBloc;
  private accountId: number;

  /**
   * Creates an instance of TransactionView
   * @param {FinanceBloc} financeBloc - The FinanceBloc instance to interact with
   * @param {number} accountId - The ID of the account to display transactions for
   */
  constructor(financeBloc: FinanceBloc, accountId: number) {
    this.financeBloc = financeBloc;
    this.accountId = accountId;
    this.initialize();
  }

  /**
   * Initializes the view by subscribing to relevant observables
   * @private
   */
  private initialize(): void {
    this.financeBloc.transactions$.subscribe(this.render.bind(this));
    this.financeBloc.error$.subscribe(this.renderError.bind(this));
    this.loadTransactions('all');
  }

  /**
   * Renders the transactions list
   * @param {TransactionInterface[]} transactions - The transactions to render
   * @private
   */
  private render(transactions: TransactionInterface[]): void {
    console.log(`--- Transactions du compte ${this.accountId} ---`);
    console.log(renderTransactionList(transactions));
    this.renderFilterButtons();
  }

  /**
   * Renders any errors that occur
   * @param {string | null} error - The error message to render
   * @private
   */
  private renderError(error: string | null): void {
    if (error) {
      console.error('Erreur dans TransactionView:', error);
    }
  }

  /**
   * Loads transactions of a specific type
   * @param {TransactionType} type - The type of transactions to load
   * @public
   */
  public loadTransactions(type: TransactionType): void {
    this.financeBloc.loadTransactions(this.accountId, type);
  }

  /**
   * Renders the filter buttons for transaction types
   * @private
   */
  private renderFilterButtons(): void {
    console.log('\nFiltrer par :');
    console.log('1. Toutes les transactions');
    console.log('2. Crédits');
    console.log('3. Débits');
  }

  /**
   * Handles user input for filtering transactions
   * @param {string} input - The user's input
   * @public
   */
  public handleUserInput(input: string): void {
    switch (input) {
      case '1':
        this.loadTransactions('all');
        break;
      case '2':
        this.loadTransactions('credit');
        break;
      case '3':
        this.loadTransactions('debit');
        break;
      default:
        console.log('Option non valide. Veuillez choisir 1, 2 ou 3.');
    }
  }
}
