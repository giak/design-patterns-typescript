import { BehaviorSubject } from 'rxjs';
import { FinanceBloc } from '../bloc/FinanceBloc';
import type { TransactionInterface } from '../models/Transaction.interface';
import { FinanceService } from '../services/FinanceService';
import { TransactionView } from '../views/TransactionView';

// Mock FinanceBloc
class MockFinanceBloc extends FinanceBloc {
  constructor() {
    super(new FinanceService());
    this.transactions$ = new BehaviorSubject<TransactionInterface[]>([]);
    this.error$ = new BehaviorSubject<string | null>(null);
  }

  setTransactions(transactions: TransactionInterface[]) {
    (this.transactions$ as BehaviorSubject<TransactionInterface[]>).next(transactions);
  }

  setError(error: string | null) {
    (this.error$ as BehaviorSubject<string | null>).next(error);
  }

  loadTransactions = jest.fn();
}

describe('TransactionView', () => {
  let mockFinanceBloc: MockFinanceBloc;
  let transactionView: TransactionView;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockFinanceBloc = new MockFinanceBloc();
    transactionView = new TransactionView(mockFinanceBloc, 1);
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  test('should render transactions when transactions are updated', () => {
    const transactions: TransactionInterface[] = [
      { id: 1, accountId: 1, amount: -50, date: new Date('2023-01-01'), description: 'Achat', type: 'debit' },
      { id: 2, accountId: 1, amount: 100, date: new Date('2023-02-01'), description: 'Dépôt', type: 'credit' },
    ];

    mockFinanceBloc.setTransactions(transactions);

    expect(consoleLogSpy).toHaveBeenCalledWith('--- Transactions du compte 1 ---');
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Achat | -50€'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Dépôt | 100€'));
    expect(consoleLogSpy).toHaveBeenCalledWith('\nFiltrer par :');
    expect(consoleLogSpy).toHaveBeenCalledWith('1. Toutes les transactions');
    expect(consoleLogSpy).toHaveBeenCalledWith('2. Crédits');
    expect(consoleLogSpy).toHaveBeenCalledWith('3. Débits');
  });

  test('should render error when error occurs', () => {
    const errorMessage = 'Une erreur est survenue';

    mockFinanceBloc.setError(errorMessage);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Erreur dans TransactionView:', errorMessage);
  });

  test('should call loadTransactions with correct type when handleUserInput is called', () => {
    transactionView.handleUserInput('1');
    expect(mockFinanceBloc.loadTransactions).toHaveBeenCalledWith(1, 'all');

    transactionView.handleUserInput('2');
    expect(mockFinanceBloc.loadTransactions).toHaveBeenCalledWith(1, 'credit');

    transactionView.handleUserInput('3');
    expect(mockFinanceBloc.loadTransactions).toHaveBeenCalledWith(1, 'debit');
  });

  test('should log error message for invalid input', () => {
    transactionView.handleUserInput('4');
    expect(consoleLogSpy).toHaveBeenCalledWith('Option non valide. Veuillez choisir 1, 2 ou 3.');
  });
});
