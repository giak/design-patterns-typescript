import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BookingRepository,
  BookingValidator,
  HotelBookingManager,
  NotificationService,
  PriceCalculator,
  RoomRepository,
} from './SRP';

describe('SRP Hotel Booking System', () => {
  describe('RoomRepository', () => {
    it('should find available room by id', () => {
      const repository = new RoomRepository();
      const room = repository.findAvailableRoom(2);

      expect(room).not.toBeNull();
      expect(room?.type).toBe('Double');
      expect(room?.pricePerNight).toBe(150);
      expect(room?.available).toBe(true);
    });

    it('should not find unavailable room', () => {
      const repository = new RoomRepository();
      const room = repository.findAvailableRoom(3); // Suite is not available

      expect(room).toBeNull();
    });

    it('should update room availability', () => {
      const repository = new RoomRepository();
      repository.updateRoomAvailability(1, false);
      const room = repository.findAvailableRoom(1);

      expect(room).toBeNull();
    });
  });

  describe('BookingRepository', () => {
    it('should save new booking', () => {
      const repository = new BookingRepository();
      const booking = {
        customerId: 1,
        roomId: 2,
        checkInDate: new Date('2025-01-15'),
        checkOutDate: new Date('2025-01-18'),
        totalPrice: 405,
      };

      expect(() => repository.save(booking)).not.toThrow();
    });
  });

  describe('NotificationService', () => {
    it('should send booking confirmation email', () => {
      const service = new NotificationService();
      const spy = vi.spyOn(console, 'log');

      service.sendBookingConfirmation(
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, type: 'Double', pricePerNight: 150, available: true },
        {
          customerId: 1,
          roomId: 2,
          checkInDate: new Date('2025-01-15'),
          checkOutDate: new Date('2025-01-18'),
          totalPrice: 405,
        },
      );

      expect(spy).toHaveBeenCalledWith('Sending email to: john@example.com');
      expect(spy).toHaveBeenCalledWith('Subject: Booking Confirmation');
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('Dear John Doe'));
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('Double room'));
    });
  });

  describe('PriceCalculator', () => {
    const calculator = new PriceCalculator();

    it('should calculate price without discount', () => {
      const price = calculator.calculateTotalPrice(150, 3);
      expect(price).toBe(450);
    });

    it('should apply SUMMER10 discount correctly', () => {
      const price = calculator.calculateTotalPrice(150, 3, 'SUMMER10');
      expect(price).toBe(405); // 450 - 10%
    });

    it('should apply WINTER15 discount correctly', () => {
      const price = calculator.calculateTotalPrice(150, 3, 'WINTER15');
      expect(price).toBe(382.5); // 450 - 15%
    });
  });

  describe('BookingValidator', () => {
    const validator = new BookingValidator();

    it('should validate correct dates', () => {
      const isValid = validator.validateDates(new Date('2025-01-15'), new Date('2025-01-18'));
      expect(isValid).toBe(true);
    });

    it('should invalidate incorrect dates', () => {
      const isValid = validator.validateDates(new Date('2025-01-18'), new Date('2025-01-15'));
      expect(isValid).toBe(false);
    });
  });

  describe('HotelBookingManager', () => {
    let manager: HotelBookingManager;
    const customer = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
    };

    beforeEach(() => {
      manager = new HotelBookingManager();
    });

    it('should successfully book a room', () => {
      const result = manager.bookRoom(customer, 2, new Date('2025-01-15'), new Date('2025-01-18'), 'SUMMER10');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.message).toContain('Booking confirmed for John Doe');
        expect(result.message).toContain('Total price: $405');
      }
    });

    it('should reject booking for unavailable room', () => {
      const result = manager.bookRoom(
        customer,
        3, // Suite is not available
        new Date('2025-01-15'),
        new Date('2025-01-18'),
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Room is not available.');
      }
    });

    it('should reject booking for invalid dates', () => {
      const result = manager.bookRoom(customer, 2, new Date('2025-01-18'), new Date('2025-01-15'));

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Invalid check-in or check-out date.');
      }
    });
  });
});
