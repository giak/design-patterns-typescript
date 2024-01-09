import { UserService } from './user.service';
import { OrderService } from './order.service';
import { PaymentService } from './payment.service';
import { OrderDetailsInterface } from './order.interface';

type UserDataType = {
  userId: string;
  name: string;
};

type OrderDataType = {
  orderId: string;
  userId: string;
  orderDetails: {
    item: string;
    quantity: number;
  };
};

type PaymentDataType = {
  paymentId: string;
  orderId: string;
  status: string;
};

type SimplifiedDataType = {
  userId: string;
  userName: string;
  orderId: string;
  orderItem: string;
  orderQuantity: number;
  paymentId: string;
  paymentStatus: string;
};

export class ServicesFacade {
  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private paymentService: PaymentService,
  ) {}

  async placeOrder(userId: string, orderDetails: OrderDetailsInterface): Promise<SimplifiedDataType> {
    try {
      const user = await this.userService.getUser(userId);
      const order = await this.orderService.createOrder(userId, orderDetails);
      const payment = await this.paymentService.processPayment(order.orderId);

      return this.simplifyJsonData({ user, order, payment });
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  }

  private simplifyUser(user: UserDataType): Partial<SimplifiedDataType> {
    return {
      userId: user.userId,
      userName: user.name,
    };
  }

  private simplifyOrder(order: OrderDataType): Partial<SimplifiedDataType> {
    return {
      orderId: order.orderId,
      orderItem: order.orderDetails.item,
      orderQuantity: order.orderDetails.quantity,
    };
  }

  private simplifyPayment(payment: PaymentDataType): Partial<SimplifiedDataType> {
    return {
      paymentId: payment.paymentId,
      paymentStatus: payment.status,
    };
  }

  simplifyJsonData(data: { user: UserDataType; order: OrderDataType; payment: PaymentDataType }): SimplifiedDataType {
    return {
      ...this.simplifyUser(data.user),
      ...this.simplifyOrder(data.order),
      ...this.simplifyPayment(data.payment),
    } as SimplifiedDataType;
  }
}
