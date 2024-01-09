export class PaymentService {
  processPayment(orderId: string) {
    // Simuler le traitement du paiement
    return { paymentId: 'payment123', orderId, status: 'Success' };
  }
}
