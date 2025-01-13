// Domain Types and Interfaces
interface RoomInterface {
  id: number;
  type: string;
  pricePerNight: number;
  available: boolean;
}

interface CustomerInterface {
  id: number;
  name: string;
  email: string;
}

interface BookingInterface {
  customerId: number;
  roomId: number;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: number;
}

// Type definitions for better type safety
type DiscountCodeType = 'SUMMER10' | 'WINTER15';
type DiscountMapType = Record<DiscountCodeType, number>;
type BookingResultType = { success: true; message: string } | { success: false; error: string };

// Abstract Repository Pattern
interface RepositoryInterface<T> {
  findById(id: number): Promise<Readonly<T> | null>;
  save(entity: Readonly<T>): Promise<void>;
}

interface RoomRepositoryInterface extends RepositoryInterface<RoomInterface> {
  findAvailableRoom(roomId: number): Promise<Readonly<RoomInterface> | null>;
  updateRoomAvailability(roomId: number, available: boolean): Promise<void>;
}

interface BookingRepositoryInterface extends RepositoryInterface<BookingInterface> {
  findByCustomerId(customerId: number): Promise<ReadonlyArray<Readonly<BookingInterface>>>;
}

// Abstract Strategy Interfaces
interface NotificationStrategyInterface {
  sendBookingConfirmation(
    customer: Readonly<CustomerInterface>,
    room: Readonly<RoomInterface>,
    booking: Readonly<BookingInterface>,
  ): Promise<void>;
}

interface PriceCalculatorInterface {
  calculateTotalPrice(pricePerNight: number, nights: number, discountCode?: DiscountCodeType): Promise<number>;
}

interface BookingValidatorInterface {
  validateDates(checkInDate: Date, checkOutDate: Date): Promise<boolean>;
  validateCustomer?(customer: Readonly<CustomerInterface>): Promise<boolean>;
  validateRoom?(room: Readonly<RoomInterface>): Promise<boolean>;
}

// Concrete Implementations
class InMemoryRoomRepository implements RoomRepositoryInterface {
  private readonly rooms: ReadonlyArray<Readonly<RoomInterface>> = [
    { id: 1, type: 'Single', pricePerNight: 100, available: true },
    { id: 2, type: 'Double', pricePerNight: 150, available: true },
    { id: 3, type: 'Suite', pricePerNight: 300, available: false },
  ];

  async findById(id: number): Promise<Readonly<RoomInterface> | null> {
    return this.rooms.find((room) => room.id === id) ?? null;
  }

  async findAvailableRoom(roomId: number): Promise<Readonly<RoomInterface> | null> {
    return this.rooms.find((room) => room.id === roomId && room.available) ?? null;
  }

  async save(room: Readonly<RoomInterface>): Promise<void> {
    // Implementation for saving room
  }

  async updateRoomAvailability(roomId: number, available: boolean): Promise<void> {
    const room = this.rooms.find((room) => room.id === roomId) as RoomInterface;
    if (room) {
      room.available = available;
    }
  }
}

class InMemoryBookingRepository implements BookingRepositoryInterface {
  private bookings: ReadonlyArray<Readonly<BookingInterface>> = [];

  async findById(id: number): Promise<Readonly<BookingInterface> | null> {
    return this.bookings.find((booking) => booking.customerId === id) ?? null;
  }

  async findByCustomerId(customerId: number): Promise<ReadonlyArray<Readonly<BookingInterface>>> {
    return this.bookings.filter((booking) => booking.customerId === customerId);
  }

  async save(booking: Readonly<BookingInterface>): Promise<void> {
    this.bookings = [...this.bookings, booking];
  }
}

class EmailNotificationStrategy implements NotificationStrategyInterface {
  async sendBookingConfirmation(
    customer: Readonly<CustomerInterface>,
    room: Readonly<RoomInterface>,
    booking: Readonly<BookingInterface>,
  ): Promise<void> {
    const subject = 'Booking Confirmation';
    const body = `Dear ${customer.name},\n\nYour booking for a ${room.type} room from [${booking.checkInDate.toDateString()}] to [${booking.checkOutDate.toDateString()}] has been confirmed.\nTotal Price: $${booking.totalPrice}\n\nThank you for choosing our hotel!`;

    await this.sendEmail(customer.email, subject, body);
  }

  private async sendEmail(to: string, subject: string, body: string): Promise<void> {
    console.log(`Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n\n${body}`);
    console.log('==============================================\n\n');
  }
}

class SMSNotificationStrategy implements NotificationStrategyInterface {
  async sendBookingConfirmation(
    customer: Readonly<CustomerInterface>,
    room: Readonly<RoomInterface>,
    booking: Readonly<BookingInterface>,
  ): Promise<void> {
    const message = `Booking confirmed: ${room.type} room, ${booking.checkInDate.toDateString()} - ${booking.checkOutDate.toDateString()}. Total: $${booking.totalPrice}`;
    await this.sendSMS(customer.name, message);
  }

  private async sendSMS(to: string, message: string): Promise<void> {
    console.log(`Sending SMS to: ${to}`);
    console.log(`Message: ${message}`);
    console.log('==============================================\n\n');
  }
}

class StandardPriceCalculator implements PriceCalculatorInterface {
  private readonly discounts: DiscountMapType = {
    SUMMER10: 0.1,
    WINTER15: 0.15,
  };

  async calculateTotalPrice(pricePerNight: number, nights: number, discountCode?: DiscountCodeType): Promise<number> {
    let totalPrice = pricePerNight * nights;

    if (discountCode && discountCode in this.discounts) {
      totalPrice *= 1 - this.discounts[discountCode];
    }

    return totalPrice;
  }
}

class PremiumPriceCalculator implements PriceCalculatorInterface {
  private readonly discounts: DiscountMapType = {
    SUMMER10: 0.15, // Premium customers get better discounts
    WINTER15: 0.2,
  };

  async calculateTotalPrice(pricePerNight: number, nights: number, discountCode?: DiscountCodeType): Promise<number> {
    const totalPrice = pricePerNight * nights;

    // Premium customers always get at least 5% off
    let discount = 0.05;

    if (discountCode && discountCode in this.discounts) {
      discount = this.discounts[discountCode];
    }

    return totalPrice * (1 - discount);
  }
}

class StandardBookingValidator implements BookingValidatorInterface {
  async validateDates(checkInDate: Date, checkOutDate: Date): Promise<boolean> {
    return checkOutDate.getTime() > checkInDate.getTime();
  }
}

class StrictBookingValidator implements BookingValidatorInterface {
  async validateDates(checkInDate: Date, checkOutDate: Date): Promise<boolean> {
    const isValidOrder = checkOutDate.getTime() > checkInDate.getTime();
    const isWeekend = checkInDate.getDay() === 0 || checkInDate.getDay() === 6;
    return isValidOrder && !isWeekend; // No check-ins on weekends
  }

  async validateCustomer(customer: Readonly<CustomerInterface>): Promise<boolean> {
    return customer.email.includes('@') && customer.name.length >= 2;
  }

  async validateRoom(room: Readonly<RoomInterface>): Promise<boolean> {
    return room.available && room.pricePerNight > 0;
  }
}

// Main service with dependency injection
class HotelBookingManager {
  constructor(
    private readonly roomRepository: RoomRepositoryInterface,
    private readonly bookingRepository: BookingRepositoryInterface,
    private readonly notificationStrategy: NotificationStrategyInterface,
    private readonly priceCalculator: PriceCalculatorInterface,
    private readonly bookingValidator: BookingValidatorInterface,
  ) {}

  public async bookRoom(
    customer: Readonly<CustomerInterface>,
    roomId: number,
    checkInDate: Date,
    checkOutDate: Date,
    discountCode?: DiscountCodeType,
  ): Promise<BookingResultType> {
    try {
      // Validate dates
      if (!(await this.bookingValidator.validateDates(checkInDate, checkOutDate))) {
        return { success: false, error: 'Invalid check-in or check-out date.' };
      }

      // Additional validations if available
      if (this.bookingValidator.validateCustomer && !(await this.bookingValidator.validateCustomer(customer))) {
        return { success: false, error: 'Invalid customer information.' };
      }

      // Find available room
      const room = await this.roomRepository.findAvailableRoom(roomId);
      if (!room) {
        return { success: false, error: 'Room is not available.' };
      }

      // Additional room validation if available
      if (this.bookingValidator.validateRoom && !(await this.bookingValidator.validateRoom(room))) {
        return { success: false, error: 'Room validation failed.' };
      }

      // Calculate nights and total price
      const nights = Math.ceil(Math.abs(checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = await this.priceCalculator.calculateTotalPrice(room.pricePerNight, nights, discountCode);

      // Create booking
      const booking: BookingInterface = {
        customerId: customer.id,
        roomId: room.id,
        checkInDate,
        checkOutDate,
        totalPrice,
      };

      // Save booking and update room availability
      await this.bookingRepository.save(booking);
      await this.roomRepository.updateRoomAvailability(room.id, false);

      // Send confirmation notification
      await this.notificationStrategy.sendBookingConfirmation(customer, room, booking);

      return {
        success: true,
        message: `Booking confirmed for ${customer.name}. Total price: $${totalPrice}`,
      };
    } catch (error) {
      return {
        success: false,
        error: `Booking failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
}

// Example usage with dependency injection
const standardBookingManager = new HotelBookingManager(
  new InMemoryRoomRepository(),
  new InMemoryBookingRepository(),
  new EmailNotificationStrategy(),
  new StandardPriceCalculator(),
  new StandardBookingValidator(),
);

const premiumBookingManager = new HotelBookingManager(
  new InMemoryRoomRepository(),
  new InMemoryBookingRepository(),
  new SMSNotificationStrategy(),
  new PremiumPriceCalculator(),
  new StrictBookingValidator(),
);

// Example bookings
const customer: Readonly<CustomerInterface> = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
};

async function bookExamples() {
  // Standard booking
  const standardBooking = await standardBookingManager.bookRoom(
    customer,
    2,
    new Date('2025-01-15'),
    new Date('2025-01-18'),
    'SUMMER10',
  );

  if (standardBooking.success) {
    console.log('Standard: ', standardBooking.message);
  } else {
    console.error('Standard Error: ', standardBooking.error);
  }

  // Premium booking
  const premiumBooking = await premiumBookingManager.bookRoom(
    customer,
    1,
    new Date('2025-02-15'),
    new Date('2025-02-18'),
    'WINTER15',
  );

  if (premiumBooking.success) {
    console.log('Premium: ', premiumBooking.message);
  } else {
    console.error('Premium Error: ', premiumBooking.error);
  }
}

bookExamples();

export {
  EmailNotificationStrategy,
  HotelBookingManager,
  InMemoryBookingRepository,
  InMemoryRoomRepository,
  PremiumPriceCalculator,
  SMSNotificationStrategy,
  StandardBookingValidator,
  StandardPriceCalculator,
  StrictBookingValidator,
  type BookingInterface,
  type BookingRepositoryInterface,
  type BookingResultType,
  type BookingValidatorInterface,
  type CustomerInterface,
  type DiscountCodeType,
  type DiscountMapType,
  type NotificationStrategyInterface,
  type PriceCalculatorInterface,
  type RoomInterface,
  type RoomRepositoryInterface,
};
