import { describe, it, expect } from 'vitest';
import {
  timeToMinutes,
  hasTimeConflict,
  isTimeWithinBreak,
  isValidTimeFormat
} from '../../src/utils/validation.js';

describe('Validation Utilities', () => {
  describe('timeToMinutes', () => {
    it('should convert time string to minutes', () => {
      expect(timeToMinutes('09:00')).toBe(540); // 9 * 60
      expect(timeToMinutes('14:30')).toBe(870); // 14 * 60 + 30
      expect(timeToMinutes('00:00')).toBe(0);
      expect(timeToMinutes('23:59')).toBe(1439); // 23 * 60 + 59
    });

    it('should handle edge cases', () => {
      expect(timeToMinutes('10:00')).toBe(600);
      expect(timeToMinutes('12:00')).toBe(720);
    });
  });

  describe('isValidTimeFormat', () => {
    it('should validate correct time format', () => {
      expect(isValidTimeFormat('09:00')).toBe(true);
      expect(isValidTimeFormat('14:30')).toBe(true);
      expect(isValidTimeFormat('23:59')).toBe(true);
      expect(isValidTimeFormat('00:00')).toBe(true);
    });

    it('should reject invalid time format', () => {
      expect(isValidTimeFormat('25:00')).toBe(false);
      expect(isValidTimeFormat('09:60')).toBe(false);
      expect(isValidTimeFormat('9:00')).toBe(false);
      expect(isValidTimeFormat('09-00')).toBe(false);
      expect(isValidTimeFormat('invalid')).toBe(false);
    });
  });

  describe('hasTimeConflict', () => {
    it('should detect overlapping time slots', () => {
      const appointment1 = { startTime: '09:00', endTime: '10:00' };
      const appointment2 = { startTime: '09:30', endTime: '10:30' };
      
      expect(hasTimeConflict(appointment1, appointment2)).toBe(true);
    });

    it('should detect adjacent time slots as no conflict', () => {
      const appointment1 = { startTime: '09:00', endTime: '10:00' };
      const appointment2 = { startTime: '10:00', endTime: '11:00' };
      
      expect(hasTimeConflict(appointment1, appointment2)).toBe(false);
    });

    it('should handle various overlap scenarios', () => {
      const appointment1 = { startTime: '09:00', endTime: '10:00' };
      
      // Completely contained
      expect(hasTimeConflict(appointment1, { startTime: '09:15', endTime: '09:45' })).toBe(true);
      
      // Starts before, ends during
      expect(hasTimeConflict(appointment1, { startTime: '08:30', endTime: '09:30' })).toBe(true);
      
      // Starts during, ends after
      expect(hasTimeConflict(appointment1, { startTime: '09:30', endTime: '10:30' })).toBe(true);
      
      // Completely contains
      expect(hasTimeConflict(appointment1, { startTime: '08:00', endTime: '11:00' })).toBe(true);
    });
  });

  describe('isTimeWithinBreak', () => {
    it('should detect time within break period', () => {
      expect(isTimeWithinBreak('12:00', '12:00', '13:00')).toBe(true);
      expect(isTimeWithinBreak('12:30', '12:00', '13:00')).toBe(true);
      expect(isTimeWithinBreak('13:00', '12:00', '13:00')).toBe(true);
    });

    it('should detect time outside break period', () => {
      expect(isTimeWithinBreak('11:59', '12:00', '13:00')).toBe(false);
      expect(isTimeWithinBreak('13:01', '12:00', '13:00')).toBe(false);
      expect(isTimeWithinBreak('09:00', '12:00', '13:00')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isTimeWithinBreak('10:00', '10:00', '10:00')).toBe(true);
      expect(isTimeWithinBreak('09:59', '10:00', '10:00')).toBe(false);
    });
  });
});
