// Observer Interface
interface ObserverInterface {
  update(weather: string): void;
}

// Subject Interface
interface SubjectInterface {
  addObserver(observer: ObserverInterface): void;
  removeObserver(observer: ObserverInterface): void;
  notifyObservers(): void;
}

// ConcreteSubject Class
class WeatherStation implements SubjectInterface {
  private observers: ObserverInterface[] = [];
  private weather = '';

  addObserver(observer: ObserverInterface): void {
    this.observers.push(observer);
  }

  removeObserver(observer: ObserverInterface): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notifyObservers(): void {
    for (const observer of this.observers) {
      observer.update(this.weather);
    }
  }

  setWeather(newWeather: string): void {
    this.weather = newWeather;
    this.notifyObservers();
  }
}

// ConcreteObserver Class
class PhoneDisplay implements ObserverInterface {
  private weather = '';

  update(weather: string): void {
    this.weather = weather;
    this.display();
  }

  private display(): void {
    console.log(`Phone Display: Weather updated - ${this.weather}`);
  }
}

// ConcreteObserver Class
class TVDisplay implements ObserverInterface {
  private weather = '';

  update(weather: string): void {
    this.weather = weather;
    this.display();
  }

  private display(): void {
    console.log(`TV Display: Weather updated - ${this.weather}`);
  }
}

// Usage
const weatherStation = new WeatherStation();

const phoneDisplay = new PhoneDisplay();
const tvDisplay = new TVDisplay();

weatherStation.addObserver(phoneDisplay);
weatherStation.addObserver(tvDisplay);

// Simulating weather change
weatherStation.setWeather('Sunny');

// Output:
// Phone Display: Weather updated - Sunny
// TV Display: Weather updated - Sunny
