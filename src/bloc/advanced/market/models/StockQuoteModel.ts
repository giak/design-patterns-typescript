/**
 * Represents a stock quote with validation
 */
export class StockQuoteModel {
  constructor(
    public readonly symbol: string,
    public readonly price: number,
    public readonly change: number,
    public readonly volume: number,
    public readonly timestamp: Date,
  ) {
    this.validate();
  }

  /**
   * Validates the stock quote data
   * @throws {Error} If any of the data is invalid
   */
  private validate(): void {
    if (typeof this.symbol !== 'string' || this.symbol.trim() === '') {
      throw new Error(`Invalid symbol: ${this.symbol}`);
    }
    if (typeof this.price !== 'number' || Number.isNaN(this.price) || this.price < 0) {
      throw new Error(`Invalid price for ${this.symbol}: ${this.price}`);
    }
    if (typeof this.change !== 'number' || Number.isNaN(this.change)) {
      throw new Error(`Invalid change for ${this.symbol}: ${this.change}`);
    }
    if (typeof this.volume !== 'number' || Number.isNaN(this.volume) || this.volume < 0) {
      throw new Error(`Invalid volume for ${this.symbol}: ${this.volume}`);
    }
    if (!(this.timestamp instanceof Date) || Number.isNaN(this.timestamp.getTime())) {
      throw new Error(`Invalid timestamp for ${this.symbol}: ${this.timestamp}`);
    }
  }

  /**
   * Creates a StockQuote instance from a plain object
   * @param data Plain object containing stock quote data
   * @returns StockQuote instance
   */
  static fromPlainObject(data: {
    symbol: string;
    price: number;
    change: number;
    volume: number;
    timestamp: Date;
  }): StockQuoteModel {
    return new StockQuoteModel(data.symbol, data.price, data.change, data.volume, data.timestamp);
  }
}
