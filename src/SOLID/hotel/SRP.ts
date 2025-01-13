// Interfaces with strict typing
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
type DiscountCode = 'SUMMER10' | 'WINTER15';
type DiscountMap = Record<DiscountCode, number>;
type BookingResult = { success: true; message: string } | { success: false; error: string };

// Repository classes with strict return types
class RoomRepository {
  private readonly rooms: ReadonlyArray<Readonly<RoomInterface>> = [
    { id: 1, type: 'Single', pricePerNight: 100, available: true },
    { id: 2, type: 'Double', pricePerNight: 150, available: true },
    { id: 3, type: 'Suite', pricePerNight: 300, available: false },
  ];

  findAvailableRoom(roomId: number): Readonly<RoomInterface> | null {
    return this.rooms.find((room) => room.id === roomId && room.available) ?? null;
  }

  updateRoomAvailability(roomId: number, available: boolean): void {
    const room = this.rooms.find((room) => room.id === roomId) as RoomInterface;
    if (room) {
      room.available = available;
    }
  }
}

class BookingRepository {
  private bookings: ReadonlyArray<Readonly<BookingInterface>> = [];

  save(booking: Readonly<BookingInterface>): void {
    this.bookings = [...this.bookings, booking];
  }
}

// Service classes with strict parameter types
class NotificationService {
  sendBookingConfirmation(
    customer: Readonly<CustomerInterface>,
    room: Readonly<RoomInterface>,
    booking: Readonly<BookingInterface>,
  ): void {
    const subject = 'Booking Confirmation';
    const body = `Dear ${customer.name},\n\nYour booking for a ${room.type} room from [${booking.checkInDate.toDateString()}] to [${booking.checkOutDate.toDateString()}] has been confirmed.\nTotal Price: $${booking.totalPrice}\n\nThank you for choosing our hotel!`;

    this.sendEmail(customer.email, subject, body);
  }

  private sendEmail(to: string, subject: string, body: string): void {
    console.log(`Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n\n${body}`);
    console.log('==============================================\n\n');
  }
}

class PriceCalculator {
  private readonly discounts: DiscountMap = {
    SUMMER10: 0.1,
    WINTER15: 0.15,
  };

  calculateTotalPrice(pricePerNight: number, nights: number, discountCode?: DiscountCode): number {
    let totalPrice = pricePerNight * nights;

    if (discountCode && discountCode in this.discounts) {
      totalPrice *= 1 - this.discounts[discountCode];
    }

    return totalPrice;
  }
}

class BookingValidator {
  validateDates(checkInDate: Date, checkOutDate: Date): boolean {
    return checkOutDate.getTime() > checkInDate.getTime();
  }
}

// Main service with strict typing and error handling
class HotelBookingManager {
  private readonly roomRepository: RoomRepository;
  private readonly bookingRepository: BookingRepository;
  private readonly notificationService: NotificationService;
  private readonly priceCalculator: PriceCalculator;
  private readonly bookingValidator: BookingValidator;

  constructor() {
    this.roomRepository = new RoomRepository();
    this.bookingRepository = new BookingRepository();
    this.notificationService = new NotificationService();
    this.priceCalculator = new PriceCalculator();
    this.bookingValidator = new BookingValidator();
  }

  public bookRoom(
    customer: Readonly<CustomerInterface>,
    roomId: number,
    checkInDate: Date,
    checkOutDate: Date,
    discountCode?: DiscountCode,
  ): BookingResult {
    // Validate dates
    if (!this.bookingValidator.validateDates(checkInDate, checkOutDate)) {
      return { success: false, error: 'Invalid check-in or check-out date.' };
    }

    // Find available room
    const room = this.roomRepository.findAvailableRoom(roomId);
    if (!room) {
      return { success: false, error: 'Room is not available.' };
    }

    // Calculate nights and total price
    const nights = Math.ceil(Math.abs(checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = this.priceCalculator.calculateTotalPrice(room.pricePerNight, nights, discountCode);

    // Create booking
    const booking: BookingInterface = {
      customerId: customer.id,
      roomId: room.id,
      checkInDate,
      checkOutDate,
      totalPrice,
    };

    // Save booking and update room availability
    this.bookingRepository.save(booking);
    this.roomRepository.updateRoomAvailability(room.id, false);

    // Send confirmation email
    this.notificationService.sendBookingConfirmation(customer, room, booking);

    return {
      success: true,
      message: `Booking confirmed for ${customer.name}. Total price: $${totalPrice}`,
    };
  }
}

// Example usage with strict types
const bookingManager = new HotelBookingManager();
const newCustomer: Readonly<CustomerInterface> = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
};

const bookingResult = bookingManager.bookRoom(
  newCustomer,
  2,
  new Date('2025-01-15'),
  new Date('2025-01-18'),
  'SUMMER10',
);

if (bookingResult.success) {
  console.log(bookingResult.message);
} else {
  console.error(bookingResult.error);
}

export {
  BookingRepository,
  BookingValidator,
  HotelBookingManager,
  NotificationService,
  PriceCalculator,
  RoomRepository,
  type BookingInterface,
  type BookingResult,
  type CustomerInterface,
  type DiscountCode,
  type RoomInterface,
};
