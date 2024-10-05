import { BehaviorSubject, type Subscription, combineLatest, interval } from 'rxjs';
import type { StockQuoteModel } from '../models/StockQuoteModel';
import { MarketDataError, MarketDataService } from '../services/MarketDataService';

export class MarketBloc {
  private marketDataService = new MarketDataService();

  private quotesSubject = new BehaviorSubject<StockQuoteModel[]>([]);
  private selectedSymbolSubject = new BehaviorSubject<string>('ALL');
  private historicalDataSubject = new BehaviorSubject<StockQuoteModel[]>([]);
  private totalPagesSubject = new BehaviorSubject<number>(1);
  private currentPageSubject = new BehaviorSubject<number>(1);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  quotes$ = this.quotesSubject.asObservable();
  selectedSymbol$ = this.selectedSymbolSubject.asObservable();
  historicalData$ = this.historicalDataSubject.asObservable();
  totalPages$ = this.totalPagesSubject.asObservable();
  currentPage$ = this.currentPageSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  private refreshSubscription?: Subscription;

  constructor() {
    this.startLiveUpdates();
    this.setupDataSync();
  }

  private startLiveUpdates(intervalMs = 5000): void {
    this.refreshSubscription = interval(intervalMs).subscribe(() => {
      this.fetchLatestQuotes();
    });
  }

  private async fetchLatestQuotes(): Promise<void> {
    try {
      this.loadingSubject.next(true);
      const quotes = await this.marketDataService.getLatestQuotes();
      this.quotesSubject.next(quotes);
      this.errorSubject.next(null);
    } catch (error) {
      this.handleError('Erreur lors de la récupération des cotations', error);
    } finally {
      this.loadingSubject.next(false);
    }
  }

  setSelectedSymbol(symbol: string): void {
    this.selectedSymbolSubject.next(symbol);
    this.currentPageSubject.next(1);
    this.fetchHistoricalData(symbol);
  }

  private async fetchHistoricalData(symbol: string, page = 1): Promise<void> {
    try {
      this.loadingSubject.next(true);
      const { data, totalPages } = await this.marketDataService.getHistoricalData(symbol, page);
      this.historicalDataSubject.next(data);
      this.totalPagesSubject.next(totalPages);
      this.currentPageSubject.next(page);
      this.errorSubject.next(null);
    } catch (error) {
      this.handleError('Erreur lors de la récupération des données historiques', error);
    } finally {
      this.loadingSubject.next(false);
    }
  }

  nextPage(): void {
    const currentPage = this.currentPageSubject.value;
    const totalPages = this.totalPagesSubject.value;
    if (currentPage < totalPages) {
      this.fetchHistoricalData(this.selectedSymbolSubject.value, currentPage + 1);
    }
  }

  previousPage(): void {
    const currentPage = this.currentPageSubject.value;
    if (currentPage > 1) {
      this.fetchHistoricalData(this.selectedSymbolSubject.value, currentPage - 1);
    }
  }

  private setupDataSync(): void {
    combineLatest([this.quotes$, this.selectedSymbol$]).subscribe(([quotes, symbol]) => {
      if (symbol === 'ALL') {
        this.quotesSubject.next(quotes);
      } else {
        const filteredQuotes = quotes.filter((quote) => quote.symbol === symbol);
        this.quotesSubject.next(filteredQuotes);
      }
    });
  }

  private handleError(message: string, error: unknown): void {
    console.error(message, error);
    if (error instanceof MarketDataError) {
      this.errorSubject.next(`${message}: ${error.message}`);
    } else {
      this.errorSubject.next(message);
    }
  }

  dispose(): void {
    this.refreshSubscription?.unsubscribe();
    this.quotesSubject.complete();
    this.selectedSymbolSubject.complete();
    this.historicalDataSubject.complete();
    this.totalPagesSubject.complete();
    this.currentPageSubject.complete();
    this.loadingSubject.complete();
    this.errorSubject.complete();
  }
}
