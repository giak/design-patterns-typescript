import { ServicesFacade } from './services.facade';
import { UserService } from './user.service';
import { OrderService } from './order.service';
import { PaymentService } from './payment.service';

async function main(facade: ServicesFacade) {
  try {
    const result = await facade.placeOrder('user1', { item: 'Book', quantity: 1 });
    console.log(result);
  } catch (error) {
    console.error('Error placing order:', error);
  }
}

const userService = new UserService();
const orderService = new OrderService();
const paymentService = new PaymentService();
const facade = new ServicesFacade(userService, orderService, paymentService);

main(facade);
