# Authentication System Setup

## Overview

This project now includes a complete authentication system with Vue 3 frontend and database-backed user management. Users are migrated from `ref_truth/services/auth.ts` and stored in a PostgreSQL database.

## Features

- ✅ Database-backed user authentication
- ✅ JWT token-based authorization
- ✅ Role-based access control
- ✅ Plant-specific access permissions
- ✅ Modern landing and login pages (converted from React to Vue 3)
- ✅ Protected routes with navigation guards

## Database Setup

### 1. Run Migration

The user table migration is located at `pisifmbe/drizzle/0013_add_users_table.sql`

Run the migration using your preferred method:

```bash
cd pisifmbe
# Option 1: Using drizzle-kit
npx drizzle-kit push:pg

# Option 2: Run SQL directly
psql -U your_username -d your_database -f drizzle/0013_add_users_table.sql
```

### 2. Seed Initial Users

Run the seed script to populate the database with initial users:

```bash
cd pisifmbe
npm install bcryptjs @types/bcryptjs jsonwebtoken @types/jsonwebtoken
npx tsx seed-users.ts
```

## Default Users

The system includes 7 default users from ref_truth:

| Username    | Password | Role            | Plant Access |
| ----------- | -------- | --------------- | ------------ |
| admin       | admifm   | Administrator   | All Plants   |
| supervisor  | spvifm   | Supervisor      | CIKUPA       |
| operator    | oprifm   | Operator        | CIKOKOL      |
| maintenance | mtcifm   | Maintenance     | All Plants   |
| qc          | qcifm    | Quality Control | All Plants   |
| management  | mngifm   | Management      | All Plants   |
| guest       | gsifm    | Viewer          | All Plants   |

## Backend Configuration

### Environment Variables

Add the following to your `.env` file in `pisifmbe`:

```env
JWT_SECRET=your-secret-key-change-in-production
DATABASE_URL=your-postgresql-connection-string
```

### API Endpoints

#### POST /api/auth/login

Login with username and password.

**Request:**

```json
{
  "username": "admin",
  "password": "admifm"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "admin",
    "name": "System Administrator",
    "role": "Administrator",
    "plantAccess": ["CIKOKOL", "SEMARANG", "CIKUPA", "AGRO"]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET /api/auth/me

Get current user info from token.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin",
    "role": "Administrator"
  }
}
```

## Frontend Configuration

### Environment Variables

Add the following to your `.env` file in `pisifmfe/frontend`:

```env
VITE_API_URL=http://localhost:2000/api
```

### Routes

- `/` - Landing page
- `/login` - Login page
- `/app` - Main dashboard (requires authentication)
- `/app/*` - All dashboard routes (protected)

### Auth Store

The auth store is located at `pisifmfe/frontend/src/stores/auth.ts`

**Usage:**

```vue
<script setup lang="ts">
import { useAuth } from "@/stores/auth";

const {
  isAuthenticated,
  username,
  name,
  userRole,
  plantAccess,
  login,
  logout,
} = useAuth();

// Login
const handleLogin = async () => {
  const result = await login("admin", "admifm");
  if (result.success) {
    // Redirect to dashboard
  }
};
</script>
```

## File Structure

### Backend (pisifmbe)

```
src/
├── auth/
│   ├── auth.controller.ts      # Login and auth endpoints
│   ├── auth.service.ts         # Authentication logic with JWT
│   └── auth.repository.ts      # Database queries for users
├── db/
│   └── schema.ts               # Updated with users table
└── index.ts                    # Added auth routes

drizzle/
└── 0013_add_users_table.sql    # Migration for users table

seed-users.ts                    # Script to populate initial users
```

### Frontend (pisifmfe/frontend)

```
src/
├── stores/
│   └── auth.ts                 # Auth store with login/logout
├── views/
│   ├── landing.vue             # Landing page (converted from React)
│   └── login.vue               # Login page (converted from React)
└── router/
    └── index.ts                # Updated with auth guards
```

## Security Notes

1. **Change JWT Secret**: Update `JWT_SECRET` in production to a strong, random value
2. **Password Hashing**: Passwords are hashed using bcrypt with 10 salt rounds
3. **Token Expiration**: JWT tokens expire after 7 days
4. **HTTPS**: Always use HTTPS in production
5. **CORS**: Update CORS origins in `pisifmbe/src/index.ts` for your production domain

## Testing

1. Start the backend:

```bash
cd pisifmbe
npm run dev
```

2. Start the frontend:

```bash
cd pisifmfe/frontend
npm run dev
```

3. Visit http://localhost:5173
4. Click "Access Dashboard"
5. Login with any of the default credentials

## Troubleshooting

### Login fails with "Invalid credentials"

- Check if users are seeded in database: `SELECT * FROM users;`
- Verify backend is running on port 2000
- Check console for error messages

### Token expired errors

- Tokens expire after 7 days
- Clear localStorage and login again
- Or adjust `JWT_EXPIRES_IN` in `auth.service.ts`

### CORS errors

- Add your frontend URL to CORS origins in `pisifmbe/src/index.ts`
- Restart backend after changes

## Next Steps

- [ ] Implement password reset functionality
- [ ] Add user management UI (CRUD operations)
- [ ] Implement refresh tokens
- [ ] Add role-based UI restrictions
- [ ] Add audit logging for authentication events
- [ ] Implement 2FA (optional)
