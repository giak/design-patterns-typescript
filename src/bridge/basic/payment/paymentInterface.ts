export interface PaymentMethodInterface {
  processPayment(amount: number): void;
}
