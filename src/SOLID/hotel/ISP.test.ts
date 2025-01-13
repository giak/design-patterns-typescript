import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  type CustomerInterface,
  EmailNotificationService,
  HotelBookingService,
  type NotificationInterface,
  type ReadableRepositoryInterface,
  type RoomInterface,
  RoomRepository,
  type RoomSearchCriteriaInterface,
  SMSNotificationService,
  type WritableRepositoryInterface,
} from './ISP';

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

const searchCriteria: RoomSearchCriteriaInterface = {
  startDate: new Date('2025-01-15'),
  endDate: new Date('2025-01-18'),
  minOccupants: 1,
  maxOccupants: 2,
  priceRange: {
    min: 100,
    max: 200,
  },
};

describe('ISP Hotel Booking System', () => {
  describe('Segregated Repository Interfaces', () => {
    let repository: RoomRepository;

    beforeEach(() => {
      repository = new RoomRepository();
    });

    describe('ReadableRepositoryInterface', () => {
      let readableRepo: ReadableRepositoryInterface<RoomInterface>;

      beforeEach(() => {
        readableRepo = repository;
      });

      it('should find entity by id', async () => {
        await repository.save(testRoom);
        const found = await readableRepo.findById(testRoom.id);
        expect(found).toEqual(testRoom);
      });

      it('should check if entity exists', async () => {
        await repository.save(testRoom);
        const exists = await readableRepo.exists(testRoom.id);
        expect(exists).toBe(true);
      });
    });

    describe('WritableRepositoryInterface', () => {
      let writableRepo: WritableRepositoryInterface<RoomInterface>;

      beforeEach(() => {
        writableRepo = repository;
      });

      it('should save entity', async () => {
        await writableRepo.save(testRoom);
        const found = await repository.findById(testRoom.id);
        expect(found).toEqual(testRoom);
      });

      it('should delete entity', async () => {
        await repository.save(testRoom);
        const deleted = await writableRepo.delete(testRoom.id);
        expect(deleted).toBe(true);
        const found = await repository.findById(testRoom.id);
        expect(found).toBeNull();
      });
    });

    describe('RoomSearchInterface', () => {
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
    });

    describe('RoomManagementInterface', () => {
      it('should update room availability', async () => {
        await repository.save(testRoom);
        const updated = await repository.updateRoomAvailability(testRoom.id, false);
        expect(updated).toBe(true);
        const found = await repository.findAvailableRoom(searchCriteria);
        expect(found).toBeNull();
      });
    });
  });

  describe('Segregated Notification Interfaces', () => {
    describe('MessageValidatorInterface', () => {
      describe('EmailNotificationService', () => {
        let emailService: EmailNotificationService;

        beforeEach(() => {
          emailService = new EmailNotificationService();
        });

        it('should validate correct email', () => {
          expect(emailService.validateRecipient('test@example.com')).toBe(true);
        });

        it('should reject invalid email', () => {
          expect(emailService.validateRecipient('invalid-email')).toBe(false);
        });

        it('should validate content', () => {
          expect(emailService.validateContent('Valid content')).toBe(true);
          expect(emailService.validateContent('')).toBe(false);
        });
      });

      describe('SMSNotificationService', () => {
        let smsService: SMSNotificationService;

        beforeEach(() => {
          smsService = new SMSNotificationService();
        });

        it('should validate correct phone number', () => {
          expect(smsService.validateRecipient('+1234567890')).toBe(true);
        });

        it('should reject invalid phone number', () => {
          expect(smsService.validateRecipient('invalid-number')).toBe(false);
        });
      });
    });

    describe('MessageSenderInterface', () => {
      it('should send email message', async () => {
        const emailService = new EmailNotificationService();
        const sent = await emailService.sendMessage('test@example.com', 'Test content');
        expect(sent).toBe(true);
      });

      it('should send SMS message', async () => {
        const smsService = new SMSNotificationService();
        const sent = await smsService.sendMessage('+1234567890', 'Test content');
        expect(sent).toBe(true);
      });
    });

    describe('NotificationInterface', () => {
      it('should send email notification', async () => {
        const emailService = new EmailNotificationService();
        const sent = await emailService.sendNotification('test@example.com', 'Test Subject', 'Test Content');
        expect(sent).toBe(true);
        expect(mockConsoleLog).toHaveBeenCalledWith('Sending email to: test@example.com');
      });

      it('should send SMS notification', async () => {
        const smsService = new SMSNotificationService();
        const sent = await smsService.sendNotification('+1234567890', 'Test Subject', 'Test Content');
        expect(sent).toBe(true);
      });
    });
  });

  describe('HotelBookingService Integration', () => {
    let roomRepository: RoomRepository;
    let notificationService: NotificationInterface;
    let bookingService: HotelBookingService;

    beforeEach(() => {
      roomRepository = new RoomRepository();
      notificationService = new EmailNotificationService();
      bookingService = new HotelBookingService(roomRepository, notificationService);
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

    it('should work with different notification services', async () => {
      const emailService = new HotelBookingService(new RoomRepository(), new EmailNotificationService());
      const smsService = new HotelBookingService(new RoomRepository(), new SMSNotificationService());

      await expect(emailService.bookRoom(testCustomer, searchCriteria, 2)).resolves.toBeDefined();
      await expect(smsService.bookRoom(testCustomer, searchCriteria, 2)).resolves.toBeDefined();
    });
  });
});
