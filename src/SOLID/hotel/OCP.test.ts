import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  type BookingInterface,
  type BookingRepositoryInterface,
  type CustomerInterface,
  EmailNotificationStrategy,
  HotelBookingManager,
  InMemoryBookingRepository,
  InMemoryRoomRepository,
  PremiumPriceCalculator,
  type RoomInterface,
  type RoomRepositoryInterface,
  SMSNotificationStrategy,
  StandardBookingValidator,
  StandardPriceCalculator,
  StrictBookingValidator,
} from './OCP';

// Mock console.log for notification testing
const mockConsoleLog = vi.spyOn(console, 'log');

// Test data
const testCustomer: CustomerInterface = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
};

const testRoom: RoomInterface = {
  id: 2,
  type: 'Double',
  pricePerNight: 150,
  available: true,
};

const checkInDate = new Date('2025-01-15');
const checkOutDate = new Date('2025-01-18');

describe('OCP Hotel Booking System', () => {
  describe('InMemoryRoomRepository', () => {
    let roomRepository: RoomRepositoryInterface;

    beforeEach(() => {
      roomRepository = new InMemoryRoomRepository();
    });

    it('should find available room by id', async () => {
      const room = await roomRepository.findAvailableRoom(2);
      expect(room).not.toBeNull();
      expect(room?.type).toBe('Double');
      expect(room?.pricePerNight).toBe(150);
      expect(room?.available).toBe(true);
    });

    it('should not find unavailable room', async () => {
      const room = await roomRepository.findAvailableRoom(3);
      expect(room).toBeNull();
    });

    it('should update room availability', async () => {
      await roomRepository.updateRoomAvailability(1, false);
      const room = await roomRepository.findAvailableRoom(1);
      expect(room).toBeNull();
    });
  });

  describe('InMemoryBookingRepository', () => {
    let bookingRepository: BookingRepositoryInterface;

    beforeEach(() => {
      bookingRepository = new InMemoryBookingRepository();
    });

    it('should save new booking', async () => {
      const booking: BookingInterface = {
        customerId: 1,
        roomId: 2,
        checkInDate: new Date('2025-01-15'),
        checkOutDate: new Date('2025-01-18'),
        totalPrice: 405,
      };

      await expect(bookingRepository.save(booking)).resolves.not.toThrow();
    });

    it('should find bookings by customer id', async () => {
      const booking: BookingInterface = {
        customerId: 1,
        roomId: 2,
        checkInDate: new Date('2025-01-15'),
        checkOutDate: new Date('2025-01-18'),
        totalPrice: 405,
      };

      await bookingRepository.save(booking);
      const bookings = await bookingRepository.findByCustomerId(1);
      expect(bookings).toHaveLength(1);
      expect(bookings[0]).toEqual(booking);
    });
  });

  describe('NotificationStrategies', () => {
    it('should send email notification', async () => {
      const emailStrategy = new EmailNotificationStrategy();
      const booking: BookingInterface = {
        customerId: 1,
        roomId: 2,
        checkInDate,
        checkOutDate,
        totalPrice: 405,
      };

      await emailStrategy.sendBookingConfirmation(testCustomer, testRoom, booking);

      expect(mockConsoleLog).toHaveBeenCalledWith('Sending email to: john@example.com');
      expect(mockConsoleLog).toHaveBeenCalledWith('Subject: Booking Confirmation');
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Dear John Doe'));
    });

    it('should send SMS notification', async () => {
      const smsStrategy = new SMSNotificationStrategy();
      const booking: BookingInterface = {
        customerId: 1,
        roomId: 2,
        checkInDate,
        checkOutDate,
        totalPrice: 405,
      };

      await smsStrategy.sendBookingConfirmation(testCustomer, testRoom, booking);

      expect(mockConsoleLog).toHaveBeenCalledWith('Sending SMS to: John Doe');
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Booking confirmed'));
    });
  });

  describe('PriceCalculators', () => {
    it('should calculate standard price with discount', async () => {
      const calculator = new StandardPriceCalculator();
      const price = await calculator.calculateTotalPrice(150, 3, 'SUMMER10');
      expect(price).toBe(405); // 450 - 10%
    });

    it('should calculate premium price with better discount', async () => {
      const calculator = new PremiumPriceCalculator();
      const price = await calculator.calculateTotalPrice(150, 3, 'SUMMER10');
      expect(price).toBe(382.5); // 450 - 15%
    });

    it('should apply minimum discount for premium customers', async () => {
      const calculator = new PremiumPriceCalculator();
      const price = await calculator.calculateTotalPrice(150, 3);
      expect(price).toBe(427.5); // 450 - 5%
    });
  });

  describe('BookingValidators', () => {
    it('should validate standard booking dates', async () => {
      const validator = new StandardBookingValidator();
      const isValid = await validator.validateDates(checkInDate, checkOutDate);
      expect(isValid).toBe(true);
    });

    it('should validate strict booking with additional checks', async () => {
      const validator = new StrictBookingValidator();

      // Test date validation
      const isValidDates = await validator.validateDates(checkInDate, checkOutDate);
      expect(isValidDates).toBe(true);

      // Test customer validation
      const isValidCustomer = await validator.validateCustomer(testCustomer);
      expect(isValidCustomer).toBe(true);

      // Test room validation
      const isValidRoom = await validator.validateRoom(testRoom);
      expect(isValidRoom).toBe(true);
    });

    it('should reject weekend check-ins in strict validation', async () => {
      const validator = new StrictBookingValidator();
      const weekendDate = new Date('2025-01-18'); // Saturday
      const checkOutDate = new Date('2025-01-20');

      const isValid = await validator.validateDates(weekendDate, checkOutDate);
      expect(isValid).toBe(false);
    });
  });

  describe('HotelBookingManager Integration', () => {
    let standardManager: HotelBookingManager;
    let premiumManager: HotelBookingManager;

    beforeEach(() => {
      standardManager = new HotelBookingManager(
        new InMemoryRoomRepository(),
        new InMemoryBookingRepository(),
        new EmailNotificationStrategy(),
        new StandardPriceCalculator(),
        new StandardBookingValidator(),
      );

      premiumManager = new HotelBookingManager(
        new InMemoryRoomRepository(),
        new InMemoryBookingRepository(),
        new SMSNotificationStrategy(),
        new PremiumPriceCalculator(),
        new StrictBookingValidator(),
      );
    });

    it('should complete standard booking successfully', async () => {
      const result = await standardManager.bookRoom(testCustomer, 2, checkInDate, checkOutDate, 'SUMMER10');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.message).toContain('Booking confirmed for John Doe');
        expect(result.message).toContain('Total price: $405');
      }
    });

    it('should complete premium booking with better discount', async () => {
      const result = await premiumManager.bookRoom(testCustomer, 2, checkInDate, checkOutDate, 'SUMMER10');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.message).toContain('Booking confirmed for John Doe');
        expect(result.message).toContain('Total price: $382.5');
      }
    });

    it('should reject booking with invalid dates', async () => {
      const result = await standardManager.bookRoom(testCustomer, 2, checkOutDate, checkInDate);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Invalid check-in or check-out date.');
      }
    });

    it('should reject premium booking on weekends', async () => {
      const weekendDate = new Date('2025-01-18'); // Saturday
      const result = await premiumManager.bookRoom(testCustomer, 2, weekendDate, new Date('2025-01-20'));

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Invalid check-in or check-out date.');
      }
    });
  });
});
