import { BehaviorSubject } from 'rxjs';
import { FinanceBloc } from '../bloc/FinanceBloc';
import type { AccountInterface } from '../models/Account.interface';
import { FinanceService } from '../services/FinanceService';
import { AccountView } from '../views/AccountView';

// Mock FinanceBloc
class MockFinanceBloc extends FinanceBloc {
  constructor() {
    super(new FinanceService());
    this.accounts$ = new BehaviorSubject<AccountInterface[]>([]);
    this.error$ = new BehaviorSubject<string | null>(null);
  }

  setAccounts(accounts: AccountInterface[]) {
    (this.accounts$ as BehaviorSubject<AccountInterface[]>).next(accounts);
  }

  setError(error: string | null) {
    (this.error$ as BehaviorSubject<string | null>).next(error);
  }
}

describe('AccountView', () => {
  let mockFinanceBloc: MockFinanceBloc;
  let accountView: AccountView;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockFinanceBloc = new MockFinanceBloc();
    accountView = new AccountView(mockFinanceBloc);
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  test('should render accounts when accounts are updated', () => {
    const accounts: AccountInterface[] = [
      { id: 1, name: 'Compte Courant', balance: 1000 },
      { id: 2, name: 'Livret A', balance: 5000 },
    ];

    mockFinanceBloc.setAccounts(accounts);

    expect(consoleLogSpy).toHaveBeenCalledWith('--- Comptes ---');
    expect(consoleLogSpy).toHaveBeenCalledWith('Compte Courant: 1000€');
    expect(consoleLogSpy).toHaveBeenCalledWith('Livret A: 5000€');
  });

  test('should render error when error occurs', () => {
    const errorMessage = 'Une erreur est survenue';

    mockFinanceBloc.setError(errorMessage);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Erreur dans AccountView:', errorMessage);
  });
});
