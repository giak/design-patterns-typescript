/**
 * This file implements a Coffee Machine simulation using the State design pattern in TypeScript.
 *
 * The Coffee Machine has two states:
 * - IdleState: The initial state where the machine is waiting for money to be inserted.
 * - ReadyState: The state where the machine is ready to brew coffee after sufficient money has been inserted.
 *
 * The Coffee Machine transitions between these states based on user actions such as inserting money, ejecting money, and brewing coffee.
 *
 * The following classes are defined:
 * - CoffeeStateInterface: An interface defining the actions that can be performed on the coffee machine.
 * - InsufficientBalanceError: A custom error class for handling insufficient balance errors.
 * - InvalidAmountError: A custom error class for handling invalid amount errors.
 * - BalanceManager: A class responsible for managing the balance of the coffee machine.
 * - CoffeeMachine: The main class representing the coffee machine, which maintains its state and balance.
 * - IdleState: A class representing the idle state of the coffee machine.
 * - ReadyState: A class representing the ready state of the coffee machine.
 *
 * The main function demonstrates how to use the CoffeeMachine class by simulating actions such as inserting money, brewing coffee, and ejecting money.
 */

const INITIAL_BALANCE = 0;
const COFFEE_PRICE = 5;
const ERROR_INSUFFICIENT_BALANCE = "Veuillez insérer de l'argent avant de préparer le café.";
const ERROR_MACHINE_READY_INSERT = "La machine est prête. Vous ne pouvez pas insérer plus d'argent.";
const ERROR_MACHINE_READY_EJECT = "Vous ne pouvez pas éjecter de l'argent lorsque la machine est prête.";
const ERROR_NEGATIVE_AMOUNT = 'Le montant ne peut pas être négatif.';

interface CoffeeStateInterface {
  /**
   * Inserts money into the coffee machine.
   * @param {number} amount - The amount of money to insert.
   */
  insertMoney(amount: number): void;

  /**
   * Ejects the money from the coffee machine.
   */
  ejectMoney(): void;

  /**
   * Brews the coffee.
   */
  brew(): void;
}

class InsufficientBalanceError extends Error {
  /**
   * Creates an instance of InsufficientBalanceError.
   * @param {string} message - The error message.
   */
  constructor(message: string) {
    super(message);
    this.name = 'InsufficientBalanceError';
  }
}

class InvalidAmountError extends Error {
  /**
   * Creates an instance of InvalidAmountError.
   * @param {string} message - The error message.
   */
  constructor(message: string) {
    super(message);
    this.name = 'InvalidAmountError';
  }
}

class BalanceManager {
  private balance: number;
  private readonly initialBalance: number;

  /**
   * Creates an instance of BalanceManager.
   * @param {number} initialBalance - The initial balance of the coffee machine.
   */
  constructor(initialBalance: number) {
    this.initialBalance = initialBalance;
    this.balance = initialBalance;
  }

  /**
   * Gets the current balance of the coffee machine.
   * @returns {number} The current balance.
   */
  getBalance(): number {
    return this.balance;
  }

  /**
   * Updates the balance of the coffee machine.
   * @param {number} amount - The new balance amount.
   * @throws {InvalidAmountError} If the amount is negative.
   */
  updateBalance(amount: number): void {
    if (amount < 0) {
      throw new InvalidAmountError(ERROR_NEGATIVE_AMOUNT);
    }
    this.balance = amount;
  }

  /**
   * Resets the balance to the initial balance.
   */
  reset(): void {
    this.balance = this.initialBalance;
  }
}

class CoffeeMachine {
  private state: CoffeeStateInterface;
  private readonly balanceManager: BalanceManager;

  /**
   * Creates an instance of CoffeeMachine.
   * @param {number} [initialBalance = INITIAL_BALANCE] - The initial balance of the coffee machine.
   */
  constructor(initialBalance = INITIAL_BALANCE) {
    this.balanceManager = new BalanceManager(initialBalance);
    this.state = new IdleState(this);
  }

  /**
   * Sets the state of the coffee machine.
   * @param {CoffeeStateInterface} state - The new state.
   */
  setState(state: CoffeeStateInterface): void {
    this.state = state;
  }

  /**
   * Transitions the coffee machine to a new state.
   * @param {CoffeeStateInterface} state - The new state.
   */
  transitionToState(state: CoffeeStateInterface): void {
    this.setState(state);
  }

  /**
   * Handles errors by logging them to the console.
   * @param {unknown} error - The error to handle.
   */
  private handleError(error: unknown): void {
    if (error instanceof Error) {
      console.error(`Erreur: ${error.message}`);
    } else {
      console.error('Une erreur inconnue est survenue');
    }
  }

  /**
   * Inserts money into the coffee machine.
   * @param {number} amount - The amount of money to insert.
   */
  insertMoney(amount: number): void {
    if (amount <= INITIAL_BALANCE) {
      this.handleError(new InvalidAmountError('Le montant inséré doit être positif.'));
      return;
    }
    try {
      this.state.insertMoney(amount);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Ejects the money from the coffee machine.
   */
  ejectMoney(): void {
    try {
      this.state.ejectMoney();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Brews the coffee.
   */
  brew(): void {
    try {
      this.state.brew();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Gets the current balance of the coffee machine.
   * @returns {number} The current balance.
   */
  getBalance(): number {
    return this.balanceManager.getBalance();
  }

  /**
   * Updates the balance of the coffee machine.
   * @param {number} amount - The new balance amount.
   */
  updateBalance(amount: number): void {
    this.balanceManager.updateBalance(amount);
  }

  /**
   * Resets the balance to the initial balance.
   */
  resetBalance(): void {
    this.balanceManager.reset();
  }
}

class IdleState implements CoffeeStateInterface {
  private readonly machine: CoffeeMachine;

  /**
   * Creates an instance of IdleState.
   * @param {CoffeeMachine} machine - The coffee machine instance.
   */
  constructor(machine: CoffeeMachine) {
    this.machine = machine;
  }

  /**
   * Inserts money into the coffee machine.
   * @param {number} amount - The amount of money to insert.
   */
  insertMoney(amount: number): void {
    this.machine.updateBalance(this.machine.getBalance() + amount);
    if (this.machine.getBalance() >= COFFEE_PRICE) {
      this.machine.transitionToState(new ReadyState(this.machine));
    }
  }

  /**
   * Ejects the money from the coffee machine and resets the balance.
   */
  ejectMoney(): void {
    this.machine.resetBalance();
  }

  /**
   * Throws an error indicating that the balance is insufficient to brew coffee.
   * @throws {InsufficientBalanceError} If there is not enough money to brew coffee.
   */
  brew(): void {
    throw new InsufficientBalanceError(ERROR_INSUFFICIENT_BALANCE);
  }
}

class ReadyState implements CoffeeStateInterface {
  private readonly machine: CoffeeMachine;

  /**
   * Creates an instance of ReadyState.
   * @param {CoffeeMachine} machine - The coffee machine instance.
   */
  constructor(machine: CoffeeMachine) {
    this.machine = machine;
  }

  /**
   * Throws an error indicating that the machine is ready and no more money can be inserted.
   * @param {number} amount - The amount of money attempted to be inserted.
   * @throws {InvalidAmountError} If money is inserted when the machine is ready.
   */
  insertMoney(amount: number): void {
    throw new InvalidAmountError(ERROR_MACHINE_READY_INSERT);
  }

  /**
   * Throws an error indicating that money cannot be ejected when the machine is ready.
   * @throws {InvalidAmountError} If an attempt is made to eject money when the machine is ready.
   */
  ejectMoney(): void {
    throw new InvalidAmountError(ERROR_MACHINE_READY_EJECT);
  }

  /**
   * Brews the coffee, deducts the balance, and transitions the machine to the idle state.
   */
  brew(): void {
    const newBalance = this.machine.getBalance() - COFFEE_PRICE;
    this.machine.updateBalance(newBalance);
    this.machine.transitionToState(new IdleState(this.machine));
  }
}

/**
 * Main function to demonstrate the coffee machine operations.
 * npm run watch-and-run ./src/state/advanced/coffeeMachine/index.ts 
 */
function main() {
  const coffeeMachine = new CoffeeMachine(0);

  try {
    console.log('Initial balance:', coffeeMachine.getBalance());

    console.log('Inserting $3...');
    coffeeMachine.insertMoney(3);
    console.log('Balance after inserting $3:', coffeeMachine.getBalance());

    console.log('Inserting $2...');
    coffeeMachine.insertMoney(2);
    console.log('Balance after inserting $2:', coffeeMachine.getBalance());

    console.log('Brewing coffee...');
    coffeeMachine.brew();
    console.log('Balance after brewing coffee:', coffeeMachine.getBalance());

    console.log('Ejecting money...');
    coffeeMachine.ejectMoney();
    console.log('Balance after ejecting money:', coffeeMachine.getBalance());
  } catch (error) {
    if (error instanceof InvalidAmountError || error instanceof InsufficientBalanceError) {
      console.error(error.message);
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
}

main();

export type {};
