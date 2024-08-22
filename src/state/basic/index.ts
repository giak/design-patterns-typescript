interface CoffeeStateInterface {
  insertMoney(amount: number): void;
  ejectMoney(): void;
  brew(): void;
}

class CoffeeMachine {
  private state: CoffeeStateInterface;
  private readonly initialBalance = 0;
  private balance = this.initialBalance;

  constructor() {
    this.state = new IdleState(this);
  }

  setState(state: CoffeeStateInterface) {
    this.state = state;
  }

  insertMoney(amount: number) {
    this.state.insertMoney(amount);
  }

  ejectMoney() {
    this.state.ejectMoney();
  }

  brew() {
    this.state.brew();
  }

  getBalance(): number {
    return this.balance;
  }

  setBalance(amount: number): void {
    this.balance = amount;
  }

  getInitialBalance(): number {
    return this.initialBalance;
  }
}

class IdleState implements CoffeeStateInterface {
  constructor(private machine: CoffeeMachine) {}

  insertMoney(amount: number) {
    this.machine.setBalance(this.machine.getBalance() + amount);
    console.log(`${amount} inserted. Total: ${this.machine.getBalance()}`);
    if (this.machine.getBalance() >= 5) {
      this.machine.setState(new ReadyState(this.machine));
    }
  }

  ejectMoney() {
    console.log(`${this.machine.getBalance()} ejected.`);
    this.machine.setBalance(this.machine.getInitialBalance());
  }

  brew() {
    console.log('Please insert money first.');
  }
}

class ReadyState implements CoffeeStateInterface {
  constructor(private machine: CoffeeMachine) {}

  insertMoney(amount: number) {
    this.machine.setBalance(this.machine.getBalance() + amount);
    console.log(`${amount} inserted. Total: ${this.machine.getBalance()}`);
  }

  ejectMoney() {
    console.log(`${this.machine.getBalance()} ejected.`);
    this.machine.setBalance(this.machine.getInitialBalance());
    this.machine.setState(new IdleState(this.machine));
  }

  brew() {
    if (this.machine.getBalance() >= 5) {
      console.log('Brewing coffee...');
      this.machine.setBalance(this.machine.getBalance() - 5);
      this.machine.setState(new IdleState(this.machine));
    } else {
      console.log('Not enough money.');
    }
  }
}

// Usage
const coffeeMachine = new CoffeeMachine();
coffeeMachine.insertMoney(3);
coffeeMachine.insertMoney(3);
coffeeMachine.brew();
coffeeMachine.ejectMoney();

export {};
