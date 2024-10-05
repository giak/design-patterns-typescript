import { createInterface } from 'node:readline';
import { FinanceBloc } from './bloc/FinanceBloc';
import type { TransactionInterface } from './models/Transaction.interface';
import { FinanceService } from './services/FinanceService';
import { AccountView } from './views/AccountView';
import { TransactionView } from './views/TransactionView';

/**
 * Main function to run the finance application
 * It sets up the FinanceBloc, views, and handles user input
 */
async function main() {
  // Initialize services and bloc
  const financeService = new FinanceService();
  const financeBloc = new FinanceBloc(financeService);

  // Initialize views
  const accountView = new AccountView(financeBloc);
  const transactionView = new TransactionView(financeBloc, 1);

  // Wait for initial data to load
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Simulate adding a new transaction after 3 seconds
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const newTransaction: TransactionInterface = {
    id: 2,
    accountId: 1,
    amount: -200,
    date: new Date(),
    description: 'Paiement Loyer',
    type: 'debit',
  };
  await financeBloc.addTransaction(newTransaction);

  // Wait for updates to complete
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Create a readline interface for user input
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  /**
   * Recursive function to handle user input
   * It prompts the user for input and processes it
   */
  const handleUserInput = () => {
    rl.question("Choisissez une option de filtrage (1, 2, 3) ou 'q' pour quitter : ", (answer) => {
      if (answer.toLowerCase() === 'q') {
        rl.close();
        return;
      }

      transactionView.handleUserInput(answer);
      handleUserInput(); // Recursive call to continue prompting for input
    });
  };

  handleUserInput();
}

// Run the main function and catch any errors
main().catch((error) => console.error("Une erreur s'est produite:", error));
