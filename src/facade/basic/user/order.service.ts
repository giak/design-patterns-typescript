import { OrderDetailsInterface } from './order.interface';

export class OrderService {
  createOrder(userId: string, orderDetails: OrderDetailsInterface) {
    // Simuler la création d'une commande
    return { orderId: 'order123', userId, orderDetails };
  }
}
