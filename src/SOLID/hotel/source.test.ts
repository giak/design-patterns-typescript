import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type CustomerInterface, EmailService, HotelBookingService } from './source';

describe('HotelBookingService', () => {
  let hotelBookingService: HotelBookingService;
  let emailService: EmailService;

  // Mock data
  const customer: CustomerInterface = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
  };

  beforeEach(() => {
    // Create a fresh instance and mock for each test
    emailService = new EmailService();
    vi.spyOn(emailService, 'sendEmail');
    // Create service with mocked emailService
    hotelBookingService = new HotelBookingService(emailService);
  });

  describe('bookRoom', () => {
    it('should successfully book an available room', () => {
      const result = hotelBookingService.bookRoom(
        customer,
        2,
        new Date('2025-01-15'),
        new Date('2025-01-18'),
        'SUMMER10',
      );

      expect(result).toContain('Booking confirmed for John Doe');
      expect(result).toContain('Total price: $405');
    });

    it('should apply SUMMER10 discount correctly', () => {
      const result = hotelBookingService.bookRoom(
        customer,
        2,
        new Date('2025-01-15'),
        new Date('2025-01-18'),
        'SUMMER10',
      );

      // 150 * 3 nights * 0.9 (10% discount) = 405
      expect(result).toContain('Total price: $405');
    });

    it('should return error message when room is not available', () => {
      // First booking to make room unavailable
      hotelBookingService.bookRoom(customer, 2, new Date('2025-01-15'), new Date('2025-01-18'));

      // Second booking attempt
      const result = hotelBookingService.bookRoom(customer, 2, new Date('2025-01-15'), new Date('2025-01-18'));

      expect(result).toBe('Room is not available.');
    });

    it('should return error for invalid dates', () => {
      const result = hotelBookingService.bookRoom(
        customer,
        2,
        new Date('2025-01-18'), // Check-in after check-out
        new Date('2025-01-15'),
      );

      expect(result).toBe('Invalid check-in or check-out date.');
    });

    it('should send confirmation email', () => {
      hotelBookingService.bookRoom(customer, 2, new Date('2025-01-15'), new Date('2025-01-18'));

      expect(emailService.sendEmail).toHaveBeenCalledWith(
        'john@example.com',
        'Booking Confirmation',
        expect.stringContaining('Dear John Doe'),
      );
      expect(emailService.sendEmail).toHaveBeenCalledWith(
        'john@example.com',
        'Booking Confirmation',
        expect.stringContaining('Double room'),
      );
      expect(emailService.sendEmail).toHaveBeenCalledWith(
        'john@example.com',
        'Booking Confirmation',
        expect.stringContaining('[Wed Jan 15 2025]'),
      );
      expect(emailService.sendEmail).toHaveBeenCalledWith(
        'john@example.com',
        'Booking Confirmation',
        expect.stringContaining('[Sat Jan 18 2025]'),
      );
    });
  });

  describe('EmailService', () => {
    it('should format and send email correctly', () => {
      const emailService = new EmailService();
      const spy = vi.spyOn(console, 'log');

      emailService.sendEmail('test@example.com', 'Test Subject', 'Test Content');

      expect(spy).toHaveBeenCalledWith('Sending email to: test@example.com');
      expect(spy).toHaveBeenCalledWith('Subject: Test Subject');
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('Test Content'));
    });
  });
});
