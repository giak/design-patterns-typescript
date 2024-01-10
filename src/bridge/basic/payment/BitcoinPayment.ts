import { PaymentMethodInterface } from './paymentInterface';

export class BitcoinPayment implements PaymentMethodInterface {
  processPayment(amount: number): void {
    console.log(`Processing Bitcoin payment for the amount: ${amount}`);
    // Logique de paiement Bitcoin...
  }
}
