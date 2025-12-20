import { describe, it, expect } from 'vitest';

/**
 * Test utilities for frontend tests
 */

// Mock utility for API calls
export const mockApiCall = (data, delay = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Mock utility for localStorage
export const createLocalStorageMock = () => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
};

describe('Frontend Test Utilities', () => {
  it('should mock API calls', async () => {
    const mockData = { id: 1, name: 'Test' };
    const result = await mockApiCall(mockData);
    
    expect(result).toEqual(mockData);
  });

  it('should mock localStorage', () => {
    const localStorage = createLocalStorageMock();
    
    localStorage.setItem('key', 'value');
    expect(localStorage.getItem('key')).toBe('value');
    
    localStorage.removeItem('key');
    expect(localStorage.getItem('key')).toBeNull();
    
    localStorage.setItem('key1', 'value1');
    localStorage.setItem('key2', 'value2');
    localStorage.clear();
    
    expect(localStorage.getItem('key1')).toBeNull();
    expect(localStorage.getItem('key2')).toBeNull();
  });

  it('should handle async operations', async () => {
    const result = await mockApiCall({ success: true }, 100);
    expect(result.success).toBe(true);
  });
});
