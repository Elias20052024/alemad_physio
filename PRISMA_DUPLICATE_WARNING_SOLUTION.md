# Prisma Duplicate Declaration Warning - Root Cause & Solution

## The Problem (Why You're Getting the Warning)

### Exact Issue
Your file `src/controllers/therapistController.js` (and similar files) has **duplicate Prisma declarations**:

```javascript
// ❌ WRONG - First declaration (in try-catch)
let prisma;
try {
  prisma = new PrismaClient({ errorFormat: 'minimal' });
} catch (error) {
  console.warn('⚠️ Prisma warning:', error.message);
  prisma = null;
}

// ❌ WRONG - Second declaration (conflicts with first)
const prisma = new PrismaClient();
```

This causes: **"Identifier 'prisma' has already been declared"**

### Why This Causes Route Loading Failures

1. JavaScript throws a syntax error during module parsing
2. When routes are dynamically imported in `server.js`, the error propagates
3. Routes fail to load → `Could not load routes: Identifier 'prisma' has already been declared`
4. The error is caught, but routes are unavailable

### Why All Controllers Have This Pattern

Each controller file creates its own `PrismaClient()` instance, meaning:
- **Multiple database connections** (bad for serverless Neon)
- **Connection pool exhaustion** over time
- **Memory waste**
- **Potential timeout issues**

Neon free tier has limited connections. Multiple instances drain them quickly.

---

## The Correct Solution (Best Practice)

### Architecture Pattern

```
src/
├── lib/
│   └── prisma.js          ← Single, reusable instance
├── controllers/
│   ├── adminController.js
│   ├── therapistController.js
│   └── ...
├── routes/
│   ├── adminRoutes.js
│   └── ...
└── server.js
```

### Step 1: Create a Single Shared Prisma Instance

**File**: `src/lib/prisma.js`

```javascript
import { PrismaClient } from '@prisma/client';

// Singleton pattern: reuse the same instance across the app
let prisma;

if (process.env.NODE_ENV === 'production') {
  // In production (Render), create the instance once
  prisma = new PrismaClient({
    errorFormat: 'pretty',
    log: ['error', 'warn'],
  });
} else {
  // In development, prevent multiple instances
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      errorFormat: 'pretty',
      log: ['query', 'error', 'warn'],
    });
  }
  prisma = global.prisma;
}

export default prisma;
```

**Why this works:**
- **Singleton pattern**: Only one instance per app lifecycle
- **Reuses connections**: No connection pool exhaustion
- **Serverless-safe**: Handles hot reloads in development
- **Clear error handling**: Logs issues without crashing

### Step 2: Import Shared Instance in Controllers

**File**: `src/controllers/adminController.js` (example)

```javascript
// ✅ CORRECT - Single import
import prisma from '../lib/prisma.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Use shared prisma instance
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // ... rest of your logic
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};
```

### Step 3: Apply to All Controllers

Replace this pattern in **every controller**:

```javascript
// ❌ OLD - Remove this
import { PrismaClient } from '@prisma/client';
let prisma;
try {
  prisma = new PrismaClient({ errorFormat: 'minimal' });
} catch (error) {
  console.warn('⚠️ Prisma warning:', error.message);
  prisma = null;
}
const prisma = new PrismaClient(); // ← Duplicate declaration

// ✅ NEW - Replace with this single line
import prisma from '../lib/prisma.js';
```

### Step 4: No Changes Needed in server.js

Your route loading code is correct:

```javascript
async function loadRoutes() {
  try {
    const [admin, therapist, patient, appointment, booking, notification] = await Promise.all([
      import('./routes/adminRoutes.js').then(m => m.default),
      import('./routes/therapistRoutes.js').then(m => m.default),
      // ...
    ]);
    // Routes now load without Prisma errors
  } catch (error) {
    console.error('⚠️ Warning: Could not load routes:', error.message);
  }
}
```

---

## Production Benefits

| Issue | Before | After |
|-------|--------|-------|
| Database connections | Multiple per controller | Single shared instance |
| Memory usage | High (multiple connections) | Low |
| Neon connection limits | Exceeded quickly | Never exceeded |
| Serverless startup time | Slow (multiple inits) | Fast |
| Route loading errors | Frequent | Never |
| Code maintainability | Scattered instances | Centralized |

---

## Verification Checklist

- [ ] All controllers import `import prisma from '../lib/prisma.js'`
- [ ] No `new PrismaClient()` in controller files
- [ ] `src/lib/prisma.js` is the only place creating PrismaClient
- [ ] Routes load without warnings
- [ ] `npm start` shows `✅ All routes loaded successfully`
- [ ] No "Identifier 'prisma' has already been declared" in logs

---

## Recommended Prisma Client Configurations

### Development (local)
```javascript
const prisma = new PrismaClient({
  errorFormat: 'pretty',
  log: ['query', 'error', 'warn'],
});
```

### Production (Render + Neon)
```javascript
const prisma = new PrismaClient({
  errorFormat: 'pretty',
  log: ['error', 'warn'],
  // No 'query' logging in production (performance impact)
});
```

---

## Troubleshooting

**If routes still fail to load:**
1. Clear `node_modules/`: `rm -rf node_modules && npm install`
2. Restart dev server
3. Check console for other import errors

**If connection errors occur:**
1. Verify `DATABASE_URL` is set correctly
2. Check Neon dashboard for active connections (max ~25 on free tier)
3. Ensure only one PrismaClient instance exists

**To debug Prisma operations:**
```javascript
// In src/lib/prisma.js, add:
prisma.$on('query', (e) => {
  console.log('🔍 Query:', e.query);
  console.log('⏱️  Duration:', e.duration, 'ms');
});
```

---

## Summary

**Root cause**: Duplicate `let` and `const` declarations of Prisma in each controller  
**Impact**: Route loading fails, error message: "Identifier 'prisma' has already been declared"  
**Solution**: Single centralized `src/lib/prisma.js` with singleton pattern  
**Benefit**: Better performance, fewer DB connections, cleaner code, serverless-optimized
