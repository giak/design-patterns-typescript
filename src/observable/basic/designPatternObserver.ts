interface ObserverInterface<T> {
  update(data: T): void;
}

class Observable<T> {
  private observers: ObserverInterface<T>[] = [];

  addObserver(observer: ObserverInterface<T>) {
    this.observers.push(observer);
  }

  removeObserver(observer: ObserverInterface<T>) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(data: T): void {
    for (const observer of this.observers) {
      observer.update(data);
    }
  }
}

class ConcreteObserver implements ObserverInterface<string> {
  update(data: string) {
    console.log('Received update:', data);
  }
}

const subject = new Observable<string>();
const observer = new ConcreteObserver();

subject.addObserver(observer);
subject.notify('Hello, Observer!');

export {};
