import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  type CustomerInterface,
  EmailNotificationService,
  HotelBookingService,
  type NotificationInterface,
  type RoomInterface,
  type RoomRepositoryInterface,
  type RoomSearchCriteriaInterface,
} from './DIP';

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

// Mock implementations
class MockRoomRepository implements RoomRepositoryInterface {
  findById = vi.fn();
  exists = vi.fn();
  save = vi.fn();
  delete = vi.fn();
  findAvailableRoom = vi.fn();
  updateRoomAvailability = vi.fn();
}

class MockNotificationService implements NotificationInterface {
  validateRecipient = vi.fn().mockReturnValue(true);
  sendMessage = vi.fn().mockResolvedValue(true);
  sendNotification = vi.fn().mockResolvedValue(true);
}

describe('DIP Hotel Booking System', () => {
  describe('HotelBookingService', () => {
    let roomRepository: MockRoomRepository;
    let notificationService: MockNotificationService;
    let bookingService: HotelBookingService;

    beforeEach(() => {
      roomRepository = new MockRoomRepository();
      notificationService = new MockNotificationService();
      bookingService = new HotelBookingService(roomRepository, notificationService);

      // Reset all mocks
      vi.clearAllMocks();
    });

    it('should successfully book a room', async () => {
      // Setup mocks
      roomRepository.findAvailableRoom.mockResolvedValue(testRoom);
      roomRepository.updateRoomAvailability.mockResolvedValue(true);
      notificationService.sendNotification.mockResolvedValue(true);

      // Execute test
      const result = await bookingService.bookRoom(testCustomer, searchCriteria, 2);

      // Verify result
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.message).toContain('Booking confirmed for John Doe');
        expect(result.message).toContain('Total price: $405');
      }

      // Verify dependencies were called correctly
      expect(roomRepository.findAvailableRoom).toHaveBeenCalledWith(searchCriteria);
      expect(roomRepository.updateRoomAvailability).toHaveBeenCalledWith(testRoom.id, false);
      expect(notificationService.sendNotification).toHaveBeenCalled();
    });

    it('should handle no available rooms', async () => {
      // Setup mocks
      roomRepository.findAvailableRoom.mockResolvedValue(null);

      // Execute test
      const result = await bookingService.bookRoom(testCustomer, searchCriteria, 2);

      // Verify result
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('No available room matching criteria');
      }

      // Verify dependencies were called correctly
      expect(roomRepository.findAvailableRoom).toHaveBeenCalledWith(searchCriteria);
      expect(roomRepository.updateRoomAvailability).not.toHaveBeenCalled();
      expect(notificationService.sendNotification).not.toHaveBeenCalled();
    });

    it('should handle too many occupants', async () => {
      // Setup mocks
      roomRepository.findAvailableRoom.mockResolvedValue(testRoom);

      // Execute test
      const result = await bookingService.bookRoom(testCustomer, searchCriteria, 3);

      // Verify result
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Too many occupants for this room');
      }

      // Verify dependencies were called correctly
      expect(roomRepository.updateRoomAvailability).not.toHaveBeenCalled();
      expect(notificationService.sendNotification).not.toHaveBeenCalled();
    });

    it('should handle room availability update failure', async () => {
      // Setup mocks
      roomRepository.findAvailableRoom.mockResolvedValue(testRoom);
      roomRepository.updateRoomAvailability.mockResolvedValue(false);

      // Execute test
      const result = await bookingService.bookRoom(testCustomer, searchCriteria, 2);

      // Verify result
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Failed to update room availability');
      }

      // Verify notification was not sent
      expect(notificationService.sendNotification).not.toHaveBeenCalled();
    });
  });

  describe('Integration', () => {
    it('should work with concrete implementations', async () => {
      const roomRepository = new MockRoomRepository();
      const notificationService = new EmailNotificationService();
      const service = new HotelBookingService(roomRepository, notificationService);

      roomRepository.findAvailableRoom.mockResolvedValue(testRoom);
      roomRepository.updateRoomAvailability.mockResolvedValue(true);

      await service.bookRoom(testCustomer, searchCriteria, 2);
      expect(mockConsoleLog).toHaveBeenCalled();
    });
  });
});
