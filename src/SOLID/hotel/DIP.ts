// Core Domain Types
type DiscountCodeType = 'SUMMER10' | 'WINTER15';
type DiscountMapType = Record<DiscountCodeType, number>;
type BookingResultType = {
  success: boolean;
  message?: string;
  error?: string;
};

// Core Domain Interfaces
interface RoomBasicInterface {
  id: number;
  type: string;
  pricePerNight: number;
}

interface RoomAvailabilityInterface {
  available: boolean;
  maxOccupants: number;
}

interface RoomInterface extends RoomBasicInterface, RoomAvailabilityInterface {}

interface CustomerContactInterface {
  email: string;
  phone?: string;
}

interface CustomerProfileInterface {
  id: number;
  name: string;
  vipStatus?: boolean;
}

interface CustomerInterface extends CustomerContactInterface, CustomerProfileInterface {}

// Application Layer Interfaces
interface RoomSearchCriteriaInterface {
  startDate: Date;
  endDate: Date;
  minOccupants?: number;
  maxOccupants?: number;
  priceRange?: {
    min: number;
    max: number;
  };
}

// Repository Abstractions (High-level)
interface ReadableRepositoryInterface<T> {
  findById(id: number): Promise<Readonly<T> | null>;
  exists(id: number): Promise<boolean>;
}

interface WritableRepositoryInterface<T> {
  save(entity: Readonly<T>): Promise<void>;
  delete(id: number): Promise<boolean>;
}

interface RepositoryInterface<T> extends ReadableRepositoryInterface<T>, WritableRepositoryInterface<T> {}

interface RoomSearchInterface {
  findAvailableRoom(criteria: RoomSearchCriteriaInterface): Promise<Readonly<RoomInterface> | null>;
}

interface RoomManagementInterface {
  updateRoomAvailability(roomId: number, available: boolean): Promise<boolean>;
}

interface RoomRepositoryInterface
  extends RepositoryInterface<RoomInterface>,
    RoomSearchInterface,
    RoomManagementInterface {}

// Notification Abstractions (High-level)
interface MessageValidatorInterface {
  validateRecipient(recipient: string): boolean;
  validateContent?(content: string): boolean;
}

interface MessageSenderInterface {
  sendMessage(recipient: string, content: string): Promise<boolean>;
}

interface NotificationInterface extends MessageValidatorInterface, MessageSenderInterface {
  sendNotification(recipient: string, subject: string, content: string): Promise<boolean>;
}

// Core Business Logic (High-level)
interface BookingServiceInterface {
  bookRoom(
    customer: Readonly<CustomerInterface>,
    criteria: RoomSearchCriteriaInterface,
    numberOfOccupants: number,
  ): Promise<BookingResultType>;
}

// Infrastructure Layer (Low-level) implementing High-level interfaces
class InMemoryRoomRepository implements RoomRepositoryInterface {
  private rooms: Map<number, RoomInterface> = new Map();

  async findById(id: number): Promise<Readonly<RoomInterface> | null> {
    return this.rooms.get(id) ?? null;
  }

  async exists(id: number): Promise<boolean> {
    return this.rooms.has(id);
  }

  async save(entity: Readonly<RoomInterface>): Promise<void> {
    this.rooms.set(entity.id, entity);
  }

  async delete(id: number): Promise<boolean> {
    return this.rooms.delete(id);
  }

  async findAvailableRoom(criteria: RoomSearchCriteriaInterface): Promise<Readonly<RoomInterface> | null> {
    for (const room of this.rooms.values()) {
      if (this.roomMatchesCriteria(room, criteria)) {
        return room;
      }
    }
    return null;
  }

  async updateRoomAvailability(roomId: number, available: boolean): Promise<boolean> {
    const room = await this.findById(roomId);
    if (!room) return false;

    await this.save({ ...room, available });
    return true;
  }

  private roomMatchesCriteria(room: RoomInterface, criteria: RoomSearchCriteriaInterface): boolean {
    if (!room.available) return false;
    if (criteria.minOccupants && room.maxOccupants < criteria.minOccupants) return false;
    if (criteria.maxOccupants && room.maxOccupants > criteria.maxOccupants) return false;
    if (criteria.priceRange) {
      const { min, max } = criteria.priceRange;
      if (room.pricePerNight < min || room.pricePerNight > max) return false;
    }
    return true;
  }
}

abstract class BaseNotificationService implements MessageValidatorInterface {
  validateRecipient(recipient: string): boolean {
    return recipient.length > 0;
  }

  validateContent(content: string): boolean {
    return content.length > 0;
  }
}

class EmailNotificationService extends BaseNotificationService implements NotificationInterface {
  validateRecipient(recipient: string): boolean {
    return super.validateRecipient(recipient) && recipient.includes('@');
  }

  async sendMessage(recipient: string, content: string): Promise<boolean> {
    if (!this.validateRecipient(recipient) || !this.validateContent(content)) {
      return false;
    }
    return true;
  }

  async sendNotification(recipient: string, subject: string, content: string): Promise<boolean> {
    if (!this.validateRecipient(recipient)) return false;

    console.log(`Sending email to: ${recipient}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n\n${content}`);
    console.log('==============================================\n\n');
    return true;
  }
}

// Core Business Logic Implementation (depends on abstractions)
class HotelBookingService implements BookingServiceInterface {
  constructor(
    private readonly roomRepository: RoomRepositoryInterface,
    private readonly notificationService: NotificationInterface,
  ) {}

  async bookRoom(
    customer: Readonly<CustomerInterface>,
    criteria: RoomSearchCriteriaInterface,
    numberOfOccupants: number,
  ): Promise<BookingResultType> {
    try {
      const room = await this.roomRepository.findAvailableRoom(criteria);
      if (!room) {
        return { success: false, error: 'No available room matching criteria' };
      }

      if (numberOfOccupants > room.maxOccupants) {
        return { success: false, error: 'Too many occupants for this room' };
      }

      const nights = Math.ceil(
        Math.abs(criteria.endDate.getTime() - criteria.startDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      const totalPrice = room.pricePerNight * nights * 0.9; // Apply SUMMER10 discount

      const success = await this.roomRepository.updateRoomAvailability(room.id, false);
      if (!success) {
        return { success: false, error: 'Failed to update room availability' };
      }

      const emailContent = `Dear ${customer.name},\n\nYour booking for a ${room.type} room from [${criteria.startDate.toDateString()}] to [${criteria.endDate.toDateString()}] has been confirmed.\nTotal Price: $${totalPrice}\n\nThank you for choosing our hotel!`;

      const notificationSent = await this.notificationService.sendNotification(
        customer.email,
        'Booking Confirmation',
        emailContent,
      );

      return {
        success: true,
        message: `Booking confirmed for ${customer.name}. Total price: $${totalPrice}`,
      };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  }
}

// Dependency Injection Container
interface BookingServiceFactoryInterface {
  createBookingService(): BookingServiceInterface;
}

class BookingServiceFactory implements BookingServiceFactoryInterface {
  private roomRepository: InMemoryRoomRepository;

  constructor() {
    this.roomRepository = new InMemoryRoomRepository();
  }

  createBookingService(): BookingServiceInterface {
    const notificationService = new EmailNotificationService();
    return new HotelBookingService(this.roomRepository, notificationService);
  }

  // Method for test setup
  async initializeTestData(room: RoomInterface): Promise<void> {
    await this.roomRepository.save(room);
  }
}

// Example usage
const factory = new BookingServiceFactory();
const hotelService = factory.createBookingService();

// Initialize some test data
const room: RoomInterface = {
  id: 2,
  type: 'Double',
  pricePerNight: 150,
  available: true,
  maxOccupants: 2,
};

const customer: CustomerInterface = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
};

// Setup test data
(async () => {
  await factory.initializeTestData(room);

  const searchCriteria: RoomSearchCriteriaInterface = {
    startDate: new Date('2025-01-15'),
    endDate: new Date('2025-01-18'),
    minOccupants: 1,
    maxOccupants: 2,
  };

  const result = await hotelService.bookRoom(customer, searchCriteria, 2);

  console.log(result.message || result.error);
})();

export {
  BookingServiceFactory,
  EmailNotificationService,
  HotelBookingService,
  InMemoryRoomRepository,
  type BookingResultType,
  type BookingServiceInterface,
  type CustomerInterface,
  type NotificationInterface,
  type RoomInterface,
  type RoomRepositoryInterface,
  type RoomSearchCriteriaInterface,
  type RoomSearchInterface,
};
