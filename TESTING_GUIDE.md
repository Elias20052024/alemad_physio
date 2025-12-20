# Testing Guide

This document provides instructions for running tests in the Alemad Physio project.

## Overview

The project includes both backend (Node.js/Express) and frontend (React) tests using Vitest.

### Backend Tests
- Location: `backend/tests/`
- Test Framework: Vitest
- Database: PostgreSQL (via Prisma)

### Frontend Tests
- Location: `frontend/src/tests/`
- Test Framework: Vitest with React Testing Library
- Environment: jsdom

---

## Installation

### Backend Dependencies

```bash
cd backend
npm install --save-dev vitest
```

### Frontend Dependencies

```bash
cd frontend
npm install --save-dev vitest @testing-library/react @testing-library/user-event jsdom
```

---

## Running Tests

### Backend Tests

Run all backend tests:
```bash
cd backend
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

Run specific test file:
```bash
npm run test patientController.test.js
```

### Frontend Tests

Run all frontend tests:
```bash
cd frontend
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

---

## Test Structure

### Backend Unit Tests

**Patient Controller Tests** (`backend/tests/unit/patientController.test.js`)
- `getAllPatients` - Fetch all patients
- `getPatientById` - Fetch single patient
- `createPatient` - Create new patient with validation
- `updatePatient` - Update patient data
- `deletePatient` - Delete patient

**Appointment Controller Tests** (`backend/tests/unit/appointmentController.test.js`)
- `getAllAppointments` - Fetch appointments with filters
- `getAvailableSlots` - Get available time slots
- `createAppointment` - Create appointment with validation
- `updateAppointment` - Update appointment
- `deleteAppointment` - Delete appointment

**Validation Tests** (`backend/tests/unit/validation.test.js`)
- `timeToMinutes` - Convert time string to minutes
- `isValidTimeFormat` - Validate time format
- `hasTimeConflict` - Detect time conflicts
- `isTimeWithinBreak` - Check if time is within break period

### Backend Integration Tests

**Patient Integration Tests** (`backend/tests/integration/patient.integration.test.js`)
- Create patient with user account
- Retrieve patient with relationships
- Update patient information
- Query patients by attributes
- Handle validation and errors

**Appointment Integration Tests** (`backend/tests/integration/appointment.integration.test.js`)
- CRUD operations for appointments
- Query appointments by filters
- Handle therapist and patient relationships

### Frontend Tests

**App Component Tests** (`frontend/src/tests/App.test.jsx`)
- Component rendering
- Navigation handling
- User authentication
- Error handling

**API Client Tests** (`frontend/src/tests/api.test.js`)
- GET request handling
- POST request handling
- PUT request handling
- DELETE request handling
- Error handling and validation

---

## Writing New Tests

### Backend Unit Test Template

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Feature Name', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {}, query: {} };
    res = {
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis()
    };
  });

  describe('Function Name', () => {
    it('should do something', async () => {
      // Arrange
      const input = { /* test data */ };

      // Act
      await functionUnderTest(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith(expectedOutput);
    });
  });
});
```

### Backend Integration Test Template

```javascript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Feature Integration', () => {
  beforeAll(async () => {
    // Setup test data
  });

  afterAll(async () => {
    // Cleanup
    await prisma.$disconnect();
  });

  it('should perform database operation', async () => {
    const result = await prisma.model.create({
      data: { /* test data */ }
    });

    expect(result).toBeDefined();
  });
});
```

### Frontend Test Template

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Component Name', () => {
  it('should render', () => {
    render(<Component />);
    expect(screen.getByText(/text/i)).toBeInTheDocument();
  });
});
```

---

## Configuration Files

### Backend Configuration
- `backend/vitest.config.js` - Vitest configuration for backend
- `backend/tests/setup.js` - Test setup file

### Frontend Configuration
- `frontend/vitest.config.js` - Vitest configuration for frontend
- `frontend/src/tests/setup.js` - Test setup file

---

## Adding Tests to package.json

### Backend

Add to `backend/package.json`:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "devDependencies": {
    "vitest": "^latest"
  }
}
```

### Frontend

Add to `frontend/package.json`:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "devDependencies": {
    "vitest": "^latest",
    "@testing-library/react": "^latest",
    "@testing-library/user-event": "^latest",
    "jsdom": "^latest"
  }
}
```

---

## Best Practices

1. **Test Naming**: Use descriptive test names that explain what is being tested
   ```javascript
   it('should return 400 when required fields are missing', () => {
   ```

2. **Test Organization**: Group related tests using `describe` blocks
   ```javascript
   describe('Input Validation', () => {
     it('should validate email format', () => {});
     it('should validate phone number', () => {});
   });
   ```

3. **Setup and Cleanup**: Always clean up test data
   ```javascript
   beforeEach(() => { /* setup */ });
   afterEach(() => { /* cleanup */ });
   ```

4. **Mocking**: Mock external dependencies
   ```javascript
   vi.mock('@prisma/client');
   prisma.patient.create.mockResolvedValue(mockData);
   ```

5. **Assertions**: Use meaningful assertions
   ```javascript
   expect(result).toBeDefined();
   expect(result.status).toBe(200);
   expect(result.data).toEqual(expectedData);
   ```

6. **Edge Cases**: Test boundary conditions
   ```javascript
   it('should handle empty arrays', () => {});
   it('should handle null values', () => {});
   it('should handle maximum values', () => {});
   ```

---

## Troubleshooting

### Common Issues

1. **Database connection errors in tests**
   - Ensure test database is running
   - Check DATABASE_URL environment variable
   - Run migrations: `npm run migrate`

2. **Import errors**
   - Check file paths are correct
   - Verify modules are installed
   - Check ES modules are configured

3. **Timeout errors**
   - Increase test timeout in vitest.config.js
   - Check for unresolved promises
   - Verify database operations complete

4. **Mock not working**
   - Ensure vi.mock is called before imports
   - Check mock implementation matches actual API
   - Clear mocks between tests with vi.clearAllMocks()

---

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

---

## CI/CD Integration

Add to GitHub Actions workflow (`.github/workflows/test.yml`):

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Backend Tests
        run: |
          cd backend
          npm install
          npm run test:coverage
      
      - name: Frontend Tests
        run: |
          cd frontend
          npm install
          npm run test:coverage
```

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Jest Documentation](https://jestjs.io/) (similar API)
- [Prisma Testing](https://www.prisma.io/docs/guides/testing)
