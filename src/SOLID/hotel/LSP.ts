// Types de base avec contrats clairs
type DiscountCodeType = 'SUMMER10' | 'WINTER15';
type DiscountMapType = Record<DiscountCodeType, number>;
type BookingResultType = {
  success: boolean;
  message?: string;
  error?: string;
};

// Interfaces de base avec contrats stricts
interface RoomInterface {
  id: number;
  type: string;
  pricePerNight: number;
  available: boolean;
  maxOccupants: number;
}

interface CustomerInterface {
  id: number;
  name: string;
  email: string;
  vipStatus?: boolean;
}

interface BookingInterface {
  id: number;
  customerId: number;
  roomId: number;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: number;
  numberOfOccupants: number;
}

// Interfaces Repository avec contrats LSP
interface RepositoryInterface<T> {
  findById(id: number): Promise<Readonly<T> | null>;
  save(entity: Readonly<T>): Promise<void>;
  delete(id: number): Promise<boolean>;
  exists(id: number): Promise<boolean>;
}

// Extension respectant LSP
interface RoomRepositoryInterface extends RepositoryInterface<RoomInterface> {
  findAvailableRoom(criteria: RoomSearchCriteria): Promise<Readonly<RoomInterface> | null>;
  updateRoomAvailability(roomId: number, available: boolean): Promise<boolean>;
}

// Critères de recherche pour respecter LSP
interface RoomSearchCriteria {
  startDate: Date;
  endDate: Date;
  minOccupants?: number;
  maxOccupants?: number;
  priceRange?: {
    min: number;
    max: number;
  };
}

// Implémentation base qui respecte LSP
abstract class BaseRepository<T> implements RepositoryInterface<T> {
  protected items: Map<number, T> = new Map();

  async findById(id: number): Promise<Readonly<T> | null> {
    return this.items.get(id) ?? null;
  }

  async save(entity: Readonly<T>): Promise<void> {
    if ('id' in entity) {
      this.items.set(entity.id as number, entity);
    }
  }

  async delete(id: number): Promise<boolean> {
    return this.items.delete(id);
  }

  async exists(id: number): Promise<boolean> {
    return this.items.has(id);
  }
}

// Implémentation concrète respectant LSP
class RoomRepository extends BaseRepository<RoomInterface> implements RoomRepositoryInterface {
  async findAvailableRoom(criteria: RoomSearchCriteria): Promise<Readonly<RoomInterface> | null> {
    for (const room of this.items.values()) {
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

  private roomMatchesCriteria(room: RoomInterface, criteria: RoomSearchCriteria): boolean {
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

// Stratégies de notification respectant LSP
interface NotificationStrategyInterface {
  sendNotification(recipient: string, subject: string, content: string): Promise<boolean>;
  validateRecipient(recipient: string): boolean;
}

// Classe de base pour les notifications
abstract class BaseNotificationStrategy implements NotificationStrategyInterface {
  abstract sendNotification(recipient: string, subject: string, content: string): Promise<boolean>;

  validateRecipient(recipient: string): boolean {
    return recipient.length > 0;
  }
}

// Implémentations concrètes respectant LSP
class EmailNotificationStrategy extends BaseNotificationStrategy {
  validateRecipient(recipient: string): boolean {
    return super.validateRecipient(recipient) && recipient.includes('@');
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

class SMSNotificationStrategy extends BaseNotificationStrategy {
  validateRecipient(recipient: string): boolean {
    return super.validateRecipient(recipient) && /^\+?[\d\s-]{10,}$/.test(recipient);
  }

  async sendNotification(recipient: string, subject: string, content: string): Promise<boolean> {
    if (!this.validateRecipient(recipient)) return false;
    // Logique d'envoi de SMS
    return true;
  }
}

// Service principal utilisant les composants LSP
class HotelBookingService {
  constructor(
    private readonly roomRepository: RoomRepositoryInterface,
    private readonly notificationStrategy: NotificationStrategyInterface,
  ) {}

  async bookRoom(
    customer: Readonly<CustomerInterface>,
    criteria: RoomSearchCriteria,
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

      const notificationSent = await this.notificationStrategy.sendNotification(
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

// Example usage
const roomRepo = new RoomRepository();
const emailNotification = new EmailNotificationStrategy();
const hotelService = new HotelBookingService(roomRepo, emailNotification);

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
  await roomRepo.save(room);

  const searchCriteria: RoomSearchCriteria = {
    startDate: new Date('2025-01-15'),
    endDate: new Date('2025-01-18'),
    minOccupants: 1,
    maxOccupants: 2,
  };

  const result = await hotelService.bookRoom(customer, searchCriteria, 2);

  console.log(result.message || result.error);
})();

export {
  BaseNotificationStrategy,
  BaseRepository,
  EmailNotificationStrategy,
  HotelBookingService,
  RoomRepository,
  SMSNotificationStrategy,
  type BookingInterface,
  type BookingResultType,
  type CustomerInterface,
  type DiscountCodeType,
  type DiscountMapType,
  type NotificationStrategyInterface,
  type RepositoryInterface,
  type RoomInterface,
  type RoomRepositoryInterface,
  type RoomSearchCriteria,
};
