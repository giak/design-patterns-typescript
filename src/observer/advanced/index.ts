// Subject Interface
interface SubjectInterface {
  attach(observer: ObserverInterface): void;
  detach(observer: ObserverInterface): void;
  notify(): void;
}

// Observer Interface
interface ObserverInterface {
  update(subject: SubjectInterface): void;
}

// ConcreteSubject
class StockMarket implements SubjectInterface {
  private observers: ObserverInterface[] = [];
  private stockPrices: Map<string, number> = new Map();

  attach(observer: ObserverInterface): void {
    this.observers.push(observer);
  }

  detach(observer: ObserverInterface): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(): void {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }

  // Méthode pour mettre à jour les prix des actions
  setStockPrice(stock: string, price: number): void {
    this.stockPrices.set(stock, price);
    this.notify(); // Notification des observateurs à chaque changement
  }

  getStockPrice(stock: string): number | undefined {
    return this.stockPrices.get(stock);
  }
}

// ConcreteObserver
class StockDisplay implements ObserverInterface {
  constructor(private name: string, private market: StockMarket) {
    this.market.attach(this);
  }

  update(subject: SubjectInterface): void {
    if (subject instanceof StockMarket) {
      console.log(`Mise à jour de ${this.name}:`);
      // Affichage des prix des actions
      subject.getStockPrice('AAPL') && console.log(`AAPL: ${subject.getStockPrice('AAPL')}`);
      // ... autres actions
    }
  }
}

// Utilisation
const market = new StockMarket();
const display1 = new StockDisplay('Display 1', market);
const display2 = new StockDisplay('Display 2', market);

// Simulation de changement de prix
market.setStockPrice('AAPL', 150);
market.setStockPrice('MSFT', 250);

export {};
