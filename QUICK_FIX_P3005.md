# Quick Fix: P3005 Error Resolution

## TL;DR - What You Need to Do Right Now

### 1. Update Your .env (LOCAL)

Add this line to your `.env` file:
```
DIRECT_URL="postgresql://user:pass@xxxxx.region.aws.neon.tech/dbname?sslmode=require"
```

Get the value from Neon Console → "Direct connection" (not the pooler one)

### 2. Update Render Environment Variables

In Render Dashboard → Your Service → Environment:
- Add `DIRECT_URL` with the same value as above
- Keep `DATABASE_URL` as the pooler connection

### 3. Verify Locally (5 minutes)

```bash
cd backend
npx prisma migrate status
# Should say "Database schema is up to date!"
```

### 4. Set Render Build Command

```bash
cd backend && npm install && npx prisma generate && npm run migrate:deploy
```

### 5. Redeploy on Render

Trigger a new deploy. Check logs for success.

---

## Why This Works

- `DATABASE_URL` (pooler) = for your Node.js app to query data
- `DIRECT_URL` (direct) = for Prisma Migrate to run DDL statements
- Neon requires both because pooler prevents long transactions

---

## Connection String Differences

**❌ Wrong (Pooler - put in DATABASE_URL only)**:
```
postgresql://user:pass@xxxxx-pooler.ap-southeast-1.aws.neon.tech/db?sslmode=require
                         ^^^^^^^^^^^^^^
```

**✅ Right (Direct - put in DIRECT_URL only)**:
```
postgresql://user:pass@xxxxx.ap-southeast-1.aws.neon.tech/db?sslmode=require
                       ^
                    NO pooler
```

---

## Verify It Works

After deploying to Render, check logs for:
```
✔ Database has been migrated to the latest schema
```

If you see P3005, it means `DIRECT_URL` is missing or wrong.
