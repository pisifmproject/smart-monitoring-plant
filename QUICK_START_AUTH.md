# 🚀 Quick Start - Authentication System

## 📦 Installation (One-Time Setup)

### Option 1: Using PowerShell Script (Recommended)

```powershell
.\setup-auth.ps1
```

### Option 2: Manual Setup

```bash
# 1. Install backend dependencies
cd pisifmbe
npm install bcryptjs @types/bcryptjs jsonwebtoken @types/jsonwebtoken

# 2. Run migration
npx drizzle-kit push:pg

# 3. Seed users
npx tsx seed-users.ts
```

## ⚙️ Environment Setup

### pisifmbe/.env

```env
JWT_SECRET=your-secret-key-change-in-production
DATABASE_URL=postgresql://user:password@host:port/database
PORT=2000
```

### pisifmfe/frontend/.env

```env
VITE_API_URL=http://localhost:2000/api
```

## 🏃 Running the Application

```bash
# Terminal 1 - Backend
cd pisifmbe
npm run dev

# Terminal 2 - Frontend
cd pisifmfe/frontend
npm run dev
```

## 👤 Default Users

| Username    | Password | Role            |
| ----------- | -------- | --------------- |
| admin       | admifm   | Administrator   |
| supervisor  | spvifm   | Supervisor      |
| operator    | oprifm   | Operator        |
| maintenance | mtcifm   | Maintenance     |
| qc          | qcifm    | Quality Control |
| management  | mngifm   | Management      |
| guest       | gsifm    | Viewer          |

## 🔗 URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:2000/api
- Login: http://localhost:5173/login

## 📚 Documentation

- [AUTH_SETUP.md](./AUTH_SETUP.md) - Complete setup guide
- [IMPLEMENTASI_AUTH.md](./IMPLEMENTASI_AUTH.md) - Implementation details (Bahasa Indonesia)

## 🐛 Common Issues

**Cannot find module 'bcryptjs'**

```bash
cd pisifmbe && npm install bcryptjs @types/bcryptjs jsonwebtoken @types/jsonwebtoken
```

**Database connection error**

- Check DATABASE_URL in pisifmbe/.env

**CORS error**

- Add your frontend URL to CORS origins in pisifmbe/src/index.ts

**Login fails**

- Verify users are seeded: `SELECT * FROM users;`
- Check backend is running on port 2000

## 📁 Key Files

### Backend

- `pisifmbe/src/auth/auth.controller.ts` - Auth endpoints
- `pisifmbe/src/auth/auth.service.ts` - Auth logic
- `pisifmbe/src/db/schema.ts` - Users table schema
- `pisifmbe/seed-users.ts` - Seed script

### Frontend

- `pisifmfe/frontend/src/stores/auth.ts` - Auth store
- `pisifmfe/frontend/src/views/login.vue` - Login page
- `pisifmfe/frontend/src/views/landing.vue` - Landing page
- `pisifmfe/frontend/src/router/index.ts` - Router with guards

## ✅ Quick Test

1. Visit http://localhost:5173
2. Click "Access Dashboard"
3. Login: `admin` / `admifm`
4. Should redirect to `/app`
