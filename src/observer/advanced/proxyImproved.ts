// Subject Interface
interface SubjectInterface<T> {
  attach(observer: ObserverInterface<T>): void;
  detach(observer: ObserverInterface<T>): void;
  notify(): void;
}

// Observer Interface
interface ObserverInterface<T> {
  update(subject: SubjectInterface<T>): void;
}

// StockPrice type
interface StockPriceInterface {
  stock: string;
  price: number;
}

// Define a type for the proxy
interface ProxyDataInterface<T> {
  data: { key: string; value: T };
}

// Generic Subject (ConcreteSubject)
class Subject<T> implements SubjectInterface<T> {
  private observers: ObserverInterface<T>[] = [];
  private data: Map<string, T> = new Map();

  attach(observer: ObserverInterface<T>): void {
    this.observers = [...this.observers, observer];
  }

  detach(observer: ObserverInterface<T>): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(): void {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }

  getData(key: string): T | undefined {
    return this.data.get(key);
  }

  private setData(key: string, value: T): void {
    this.data.set(key, value);
    this.notify();
  }

  public get proxy(): ProxyDataInterface<T> {
    return new Proxy(this, {
      set: (target, prop: string, value: { key: string; value: T }) => {
        if (prop === 'data') {
          target.setData(value.key, value.value);
          return true;
        }
        return false;
      },
    }) as unknown as ProxyDataInterface<T>;
  }
}

// StockDisplay (ConcreteObserver) avec Générique
class Display<T> implements ObserverInterface<T> {
  constructor(private name: string, private market: Subject<T>) {
    this.market.attach(this);
  }

  update(subject: SubjectInterface<T>): void {
    if (subject instanceof Subject) {
      console.log(`Mise à jour de ${this.name}:`);
      subject.getData('AAPL') && console.log(subject.getData('AAPL'));
      subject.getData('MSFT') && console.log(subject.getData('MSFT'));

      // ... autres actions
    }
  }
}

// Utilisation
// Création d'un nouveau sujet
const subject = new Subject<StockPriceInterface>();

// Création de deux affichages qui observeront le sujet
const display1 = new Display<StockPriceInterface>('Display 1', subject);
const display2 = new Display<StockPriceInterface>('Display 2', subject);

// Obtention du proxy du sujet
const marketProxy = subject.proxy;

// Modification des prix des actions via le proxy
// Cela déclenchera une notification aux observateurs (Display1 et Display2)
marketProxy.data = { key: 'AAPL', value: { stock: 'AAPL', price: 151 } };
marketProxy.data = { key: 'MSFT', value: { stock: 'MSFT', price: 250 } };

export {};
