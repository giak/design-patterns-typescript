import type { FinanceBloc } from '../bloc/FinanceBloc';
import type { AccountInterface } from '../models/Account.interface';

/**
 * AccountView class responsible for rendering and managing account-related UI
 */
export class AccountView {
  private financeBloc: FinanceBloc;

  /**
   * Creates an instance of AccountView
   * @param {FinanceBloc} financeBloc - The FinanceBloc instance to interact with
   */
  constructor(financeBloc: FinanceBloc) {
    this.financeBloc = financeBloc;
    this.initialize();
  }

  /**
   * Initializes the view by subscribing to relevant observables
   * @private
   */
  private initialize(): void {
    this.financeBloc.accounts$.subscribe(this.render.bind(this));
    this.financeBloc.error$.subscribe(this.renderError.bind(this));
  }

  /**
   * Renders the accounts list
   * @param {AccountInterface[]} accounts - The accounts to render
   * @private
   */
  private render(accounts: AccountInterface[]): void {
    console.log('--- Comptes ---');
    for (const account of accounts) {
      console.log(`${account.name}: ${account.balance}€`);
    }
  }

  /**
   * Renders any errors that occur
   * @param {string | null} error - The error message to render
   * @private
   */
  private renderError(error: string | null): void {
    if (error) {
      console.error('Erreur dans AccountView:', error);
    }
  }
}
