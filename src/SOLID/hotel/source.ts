export interface RoomInterface {
  id: number;
  type: string;
  pricePerNight: number;
  available: boolean;
}

export interface CustomerInterface {
  id: number;
  name: string;
  email: string;
}

export interface BookingInterface {
  customerId: number;
  roomId: number;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: number;
}

export class EmailService {
  sendEmail(to: string, subject: string, body: string): void {
    console.log(`Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n\n${body}`);
    console.log('==============================================\n\n');
  }
}

export class HotelBookingService {
  private rooms: RoomInterface[] = [
    { id: 1, type: 'Single', pricePerNight: 100, available: true },
    { id: 2, type: 'Double', pricePerNight: 150, available: true },
    { id: 3, type: 'Suite', pricePerNight: 300, available: false },
  ];

  private bookings: BookingInterface[] = [];
  private emailService: EmailService;

  constructor(emailService?: EmailService) {
    this.emailService = emailService || new EmailService();
  }

  public bookRoom(
    customer: CustomerInterface,
    roomId: number,
    checkInDate: Date,
    checkOutDate: Date,
    discountCode?: string,
  ): string {
    // Validate dates first
    if (checkInDate >= checkOutDate) {
      return 'Invalid check-in or check-out date.';
    }

    let room: RoomInterface | undefined;
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].id === roomId && this.rooms[i].available) {
        room = this.rooms[i];
        break;
      }
    }

    if (!room) {
      return 'Room is not available.';
    }

    const nights = Math.ceil(Math.abs(checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

    let totalPrice = nights * room.pricePerNight;
    if (discountCode) {
      const discounts: { [key: string]: number } = { SUMMER10: 0.1, WINTER15: 0.15 };
      const discount = discounts[discountCode.toUpperCase()] || 0;
      totalPrice = totalPrice * (1 - discount);
    }

    this.bookings.push({
      customerId: customer.id,
      roomId: room.id,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    room.available = false;

    // Send confirmation email
    const subject = 'Booking Confirmation';
    const body = `Dear ${customer.name},\n\nYour booking for a ${room.type} room from [${checkInDate.toDateString()}] to [${checkOutDate.toDateString()}] has been confirmed.\nTotal Price: $${totalPrice}\n\nThank you for choosing our hotel!`;
    this.emailService.sendEmail(customer.email, subject, body);

    return `Booking confirmed for ${customer.name}. Total price: $${totalPrice}`;
  }
}

const hotelBookingService = new HotelBookingService();
const customer: CustomerInterface = { id: 1, name: 'John Doe', email: 'john@example.com' };
const confirmation = hotelBookingService.bookRoom(
  customer,
  2,
  new Date('2025-01-15'),
  new Date('2025-01-18'),
  'SUMMER10',
);
console.log(confirmation);
