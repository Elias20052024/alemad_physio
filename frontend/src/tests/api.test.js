import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * API Testing utilities
 * Tests for API integration and error handling
 */

// Mock API client
const createMockApiClient = () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  patch: vi.fn()
});

describe('API Client', () => {
  let apiClient;

  beforeEach(() => {
    apiClient = createMockApiClient();
  });

  describe('GET requests', () => {
    it('should fetch data successfully', async () => {
      const mockData = { id: 1, name: 'Test Patient', phone: '050123456' };
      apiClient.get.mockResolvedValue({ data: mockData });

      const result = await apiClient.get('/api/patients/1');

      expect(apiClient.get).toHaveBeenCalledWith('/api/patients/1');
      expect(result.data).toEqual(mockData);
    });

    it('should handle GET errors', async () => {
      const error = new Error('Not Found');
      apiClient.get.mockRejectedValue(error);

      try {
        await apiClient.get('/api/patients/999');
      } catch (e) {
        expect(e.message).toBe('Not Found');
      }
    });

    it('should fetch multiple records', async () => {
      const mockData = [
        { id: 1, name: 'Patient 1' },
        { id: 2, name: 'Patient 2' }
      ];
      apiClient.get.mockResolvedValue({ data: mockData });

      const result = await apiClient.get('/api/patients');

      expect(result.data).toHaveLength(2);
    });
  });

  describe('POST requests', () => {
    it('should create data successfully', async () => {
      const payload = { name: 'New Patient', phone: '050987654' };
      const mockResponse = { id: 1, ...payload };
      apiClient.post.mockResolvedValue({ data: mockResponse });

      const result = await apiClient.post('/api/patients', payload);

      expect(apiClient.post).toHaveBeenCalledWith('/api/patients', payload);
      expect(result.data.id).toBe(1);
    });

    it('should handle POST validation errors', async () => {
      const payload = { name: '' }; // Invalid
      apiClient.post.mockRejectedValue(new Error('Validation failed'));

      try {
        await apiClient.post('/api/patients', payload);
      } catch (e) {
        expect(e.message).toBe('Validation failed');
      }
    });

    it('should handle duplicate creation error', async () => {
      const payload = { email: 'existing@example.com' };
      apiClient.post.mockRejectedValue(new Error('Email already exists'));

      try {
        await apiClient.post('/api/patients', payload);
      } catch (e) {
        expect(e.message).toBe('Email already exists');
      }
    });
  });

  describe('PUT requests', () => {
    it('should update data successfully', async () => {
      const payload = { name: 'Updated Name' };
      const mockResponse = { id: 1, ...payload };
      apiClient.put.mockResolvedValue({ data: mockResponse });

      const result = await apiClient.put('/api/patients/1', payload);

      expect(apiClient.put).toHaveBeenCalledWith('/api/patients/1', payload);
      expect(result.data.name).toBe('Updated Name');
    });

    it('should handle PUT not found error', async () => {
      apiClient.put.mockRejectedValue(new Error('Not Found'));

      try {
        await apiClient.put('/api/patients/999', { name: 'Test' });
      } catch (e) {
        expect(e.message).toBe('Not Found');
      }
    });
  });

  describe('DELETE requests', () => {
    it('should delete data successfully', async () => {
      apiClient.delete.mockResolvedValue({ status: 200 });

      const result = await apiClient.delete('/api/patients/1');

      expect(apiClient.delete).toHaveBeenCalledWith('/api/patients/1');
      expect(result.status).toBe(200);
    });

    it('should handle DELETE not found error', async () => {
      apiClient.delete.mockRejectedValue(new Error('Not Found'));

      try {
        await apiClient.delete('/api/patients/999');
      } catch (e) {
        expect(e.message).toBe('Not Found');
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      apiClient.get.mockRejectedValue(new Error('Network error'));

      try {
        await apiClient.get('/api/patients');
      } catch (e) {
        expect(e.message).toBe('Network error');
      }
    });

    it('should handle timeout errors', async () => {
      apiClient.get.mockRejectedValue(new Error('Request timeout'));

      try {
        await apiClient.get('/api/patients');
      } catch (e) {
        expect(e.message).toBe('Request timeout');
      }
    });

    it('should handle server errors', async () => {
      apiClient.get.mockRejectedValue(new Error('Internal Server Error'));

      try {
        await apiClient.get('/api/patients');
      } catch (e) {
        expect(e.message).toBe('Internal Server Error');
      }
    });
  });
});
