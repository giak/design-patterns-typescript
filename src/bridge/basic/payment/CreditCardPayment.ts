import { PaymentMethodInterface } from './paymentInterface';

export class CreditCardPayment implements PaymentMethodInterface {
  processPayment(amount: number): void {
    console.log(`Processing credit card payment for the amount: ${amount}`);
    // Logique de paiement par carte de crédit...
  }
}
