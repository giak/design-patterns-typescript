import { PaymentMethodInterface } from './paymentInterface';

export class PayPalPayment implements PaymentMethodInterface {
  processPayment(amount: number): void {
    console.log(`Processing PayPal payment for the amount: ${amount}`);
    // Logique de paiement PayPal...
  }
}
