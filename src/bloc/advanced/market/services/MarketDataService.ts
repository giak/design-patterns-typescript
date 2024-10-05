import { StockQuoteModel } from '../models/StockQuoteModel';

/**
 * Custom error class for MarketDataService errors
 */
export class MarketDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MarketDataError';
  }
}

export class MarketDataService {
  private symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];

  /**
   * Fetches the latest quotes for all symbols
   * @returns Promise<StockQuote[]>
   * @throws {MarketDataError} If there's an error fetching the data
   */
  async getLatestQuotes(): Promise<StockQuoteModel[]> {
    try {
      // Simulation d'une erreur aléatoire
      if (Math.random() < 0.1) {
        throw new Error('Simulated network error');
      }

      return this.symbols.map((symbol) =>
        StockQuoteModel.fromPlainObject({
          symbol,
          price: this.generateRandomPrice(),
          change: this.generateRandomChange(),
          volume: this.generateRandomVolume(),
          timestamp: new Date(),
        }),
      );
    } catch (error) {
      throw new MarketDataError(
        `Failed to fetch latest quotes: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Fetches paginated historical data for a given symbol
   * @param symbol The stock symbol to fetch data for
   * @param page The page number (starting from 1)
   * @param pageSize The number of items per page
   * @returns Promise<{ data: StockQuoteModel[], totalPages: number }>
   * @throws {MarketDataError} If there's an error fetching the data or if the symbol is invalid
   */
  async getHistoricalData(
    symbol: string,
    page = 1,
    pageSize = 30,
  ): Promise<{ data: StockQuoteModel[]; totalPages: number }> {
    try {
      if (!this.symbols.includes(symbol)) {
        throw new MarketDataError(`Invalid symbol: ${symbol}`);
      }

      if (page < 1 || pageSize < 1) {
        throw new MarketDataError('Invalid pagination parameters');
      }

      // Simulation d'une erreur aléatoire
      if (Math.random() < 0.1) {
        throw new Error('Simulated network error');
      }

      const totalDays = 90;
      const totalPages = Math.ceil(totalDays / pageSize);

      if (page > totalPages) {
        throw new MarketDataError(`Page ${page} exceeds total pages ${totalPages}`);
      }

      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, totalDays);

      const now = Date.now();
      const data = Array.from({ length: endIndex - startIndex }, (_, i) =>
        StockQuoteModel.fromPlainObject({
          symbol,
          price: this.generateRandomPrice(),
          change: this.generateRandomChange(),
          volume: this.generateRandomVolume(),
          timestamp: new Date(now - (startIndex + i) * 24 * 60 * 60 * 1000),
        }),
      );

      return { data, totalPages };
    } catch (error) {
      if (error instanceof MarketDataError) {
        throw error;
      }
      throw new MarketDataError(
        `Failed to fetch historical data for ${symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  private generateRandomPrice(): number {
    return Number.parseFloat((Math.random() * 1000 + 100).toFixed(2));
  }

  private generateRandomChange(): number {
    return Number.parseFloat(((Math.random() - 0.5) * 10).toFixed(2));
  }

  private generateRandomVolume(): number {
    return Math.floor(Math.random() * 1000000);
  }
}
