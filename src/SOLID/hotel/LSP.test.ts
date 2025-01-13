import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BaseRepository,
  type CustomerInterface,
  EmailNotificationStrategy,
  HotelBookingService,
  type NotificationStrategyInterface,
  type RepositoryInterface,
  type RoomInterface,
  RoomRepository,
  type RoomSearchCriteria,
  SMSNotificationStrategy,
} from './LSP';

// Mock console.log for notification testing
const mockConsoleLog = vi.spyOn(console, 'log');

// Test data
const testCustomer: CustomerInterface = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  vipStatus: false,
};

const testRoom: RoomInterface = {
  id: 2,
  type: 'Double',
  pricePerNight: 150,
  available: true,
  maxOccupants: 2,
};

const searchCriteria: RoomSearchCriteria = {
  startDate: new Date('2025-01-15'),
  endDate: new Date('2025-01-18'),
  minOccupants: 1,
  maxOccupants: 2,
  priceRange: {
    min: 100,
    max: 200,
  },
};

describe('LSP Hotel Booking System', () => {
  describe('BaseRepository', () => {
    class TestRepository<T> extends BaseRepository<T> {}
    let repository: TestRepository<RoomInterface>;

    beforeEach(() => {
      repository = new TestRepository<RoomInterface>();
    });

    it('should save and find an entity', async () => {
      await repository.save(testRoom);
      const found = await repository.findById(testRoom.id);
      expect(found).toEqual(testRoom);
    });

    it('should delete an entity', async () => {
      await repository.save(testRoom);
      const deleted = await repository.delete(testRoom.id);
      expect(deleted).toBe(true);
      const found = await repository.findById(testRoom.id);
      expect(found).toBeNull();
    });

    it('should check if entity exists', async () => {
      await repository.save(testRoom);
      const exists = await repository.exists(testRoom.id);
      expect(exists).toBe(true);
    });
  });

  describe('RoomRepository', () => {
    let repository: RoomRepository;

    beforeEach(() => {
      repository = new RoomRepository();
    });

    it('should find available room matching criteria', async () => {
      await repository.save(testRoom);
      const found = await repository.findAvailableRoom(searchCriteria);
      expect(found).toEqual(testRoom);
    });

    it('should not find room with incompatible occupancy', async () => {
      await repository.save(testRoom);
      const invalidCriteria = {
        ...searchCriteria,
        minOccupants: 3,
      };
      const found = await repository.findAvailableRoom(invalidCriteria);
      expect(found).toBeNull();
    });

    it('should not find room outside price range', async () => {
      await repository.save(testRoom);
      const invalidCriteria = {
        ...searchCriteria,
        priceRange: {
          min: 200,
          max: 300,
        },
      };
      const found = await repository.findAvailableRoom(invalidCriteria);
      expect(found).toBeNull();
    });

    it('should update room availability', async () => {
      await repository.save(testRoom);
      const updated = await repository.updateRoomAvailability(testRoom.id, false);
      expect(updated).toBe(true);
      const found = await repository.findAvailableRoom(searchCriteria);
      expect(found).toBeNull();
    });
  });

  describe('NotificationStrategies', () => {
    describe('EmailNotificationStrategy', () => {
      let strategy: EmailNotificationStrategy;

      beforeEach(() => {
        strategy = new EmailNotificationStrategy();
      });

      it('should validate correct email', () => {
        expect(strategy.validateRecipient('test@example.com')).toBe(true);
      });

      it('should reject invalid email', () => {
        expect(strategy.validateRecipient('invalid-email')).toBe(false);
      });

      it('should send email notification', async () => {
        const sent = await strategy.sendNotification('test@example.com', 'Test Subject', 'Test Content');
        expect(sent).toBe(true);
        expect(mockConsoleLog).toHaveBeenCalledWith('Sending email to: test@example.com');
      });
    });

    describe('SMSNotificationStrategy', () => {
      let strategy: SMSNotificationStrategy;

      beforeEach(() => {
        strategy = new SMSNotificationStrategy();
      });

      it('should validate correct phone number', () => {
        expect(strategy.validateRecipient('+1234567890')).toBe(true);
      });

      it('should reject invalid phone number', () => {
        expect(strategy.validateRecipient('invalid-number')).toBe(false);
      });
    });
  });

  describe('HotelBookingService', () => {
    let roomRepository: RoomRepository;
    let notificationStrategy: EmailNotificationStrategy;
    let bookingService: HotelBookingService;

    beforeEach(() => {
      roomRepository = new RoomRepository();
      notificationStrategy = new EmailNotificationStrategy();
      bookingService = new HotelBookingService(roomRepository, notificationStrategy);
    });

    it('should successfully book a room', async () => {
      await roomRepository.save(testRoom);
      const result = await bookingService.bookRoom(testCustomer, searchCriteria, 2);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.message).toContain('Booking confirmed for John Doe');
        expect(result.message).toContain('Total price: $');
      }
    });

    it('should reject booking when no rooms available', async () => {
      const result = await bookingService.bookRoom(testCustomer, searchCriteria, 2);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('No available room matching criteria');
      }
    });

    it('should reject booking with too many occupants', async () => {
      await roomRepository.save(testRoom);
      const result = await bookingService.bookRoom(testCustomer, searchCriteria, 3);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Too many occupants for this room');
      }
    });

    it('should handle notification failure gracefully', async () => {
      await roomRepository.save(testRoom);
      const invalidCustomer = { ...testCustomer, email: 'invalid-email' };
      const result = await bookingService.bookRoom(invalidCustomer, searchCriteria, 2);

      expect(result.success).toBe(true); // La réservation doit quand même réussir
    });
  });

  // Test LSP Compliance
  describe('LSP Compliance', () => {
    it('should allow substitution of BaseRepository with RoomRepository', async () => {
      const baseRepo: RepositoryInterface<RoomInterface> = new RoomRepository();
      await baseRepo.save(testRoom);
      const found = await baseRepo.findById(testRoom.id);
      expect(found).toEqual(testRoom);
    });

    it('should allow substitution of BaseNotificationStrategy', async () => {
      const baseStrategy: NotificationStrategyInterface = new EmailNotificationStrategy();
      const isValid = baseStrategy.validateRecipient('test@example.com');
      expect(isValid).toBe(true);
    });

    it('should work with any NotificationStrategy implementation', async () => {
      const emailStrategy = new EmailNotificationStrategy();
      const smsStrategy = new SMSNotificationStrategy();

      const emailService = new HotelBookingService(new RoomRepository(), emailStrategy);
      const smsService = new HotelBookingService(new RoomRepository(), smsStrategy);

      // Les deux services devraient fonctionner de la même manière
      await expect(emailService.bookRoom(testCustomer, searchCriteria, 2)).resolves.toBeDefined();
      await expect(smsService.bookRoom(testCustomer, searchCriteria, 2)).resolves.toBeDefined();
    });
  });
});
