import type { TransactionInterface } from '../models/Transaction.interface';

/**
 * Renders a list of transactions as a formatted string
 *
 * This function takes an array of transactions and converts it into a human-readable
 * string representation. Each transaction is formatted on a separate line with
 * the date, description, and amount.
 *
 * @param {TransactionInterface[]} transactions - The array of transactions to render
 * @returns {string} A formatted string representing the list of transactions
 *
 * @example
 * const transactions = [
 *   { id: 1, accountId: 1, amount: -50, date: new Date('2023-01-01'), description: 'Achat', type: 'debit' },
 *   { id: 2, accountId: 1, amount: 100, date: new Date('2023-02-01'), description: 'Dépôt', type: 'credit' }
 * ];
 * const renderedList = renderTransactionList(transactions);
 * console.log(renderedList);
 * // Output:
 * // 1/1/2023 | Achat | -50€
 * // 1/2/2023 | Dépôt | 100€
 */
export const renderTransactionList = (transactions: TransactionInterface[]): string => {
  if (transactions.length === 0) {
    return 'Aucune transaction à afficher.';
  }

  const transactionStrings = transactions.map(
    (tx) => `${tx.date.toLocaleDateString()} | ${tx.description} | ${tx.amount}€`,
  );

  return transactionStrings.join('\n');
};
