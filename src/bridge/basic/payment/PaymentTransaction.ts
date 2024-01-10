import { PaymentMethodInterface } from './paymentInterface';

export class PaymentTransaction {
  constructor(private paymentMethod: PaymentMethodInterface, private amount: number) {
    this.paymentMethod = paymentMethod;
    this.amount = amount;
  }

  processTransaction(): void {
    this.paymentMethod.processPayment(this.amount);
  }
}
