import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import { query } from '../../config/database';

const router = express.Router();

// Mock User DB for auth (since real DB is offline)
// In real app, this would query `users` table.
const users = [
    {
        id: 1,
        username: 'admin',
        password_hash: '$2a$10$wT.f.q.q.q.q.q.q.q.q.q.q', // Placeholder, we will use hardcoded check for demo
        role: 'ADMIN',
        full_name: 'Administrator'
    }
];

router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Real implementation:
  // const userResult = await query('SELECT * FROM users WHERE username = $1', [username]);
  // if (userResult.rows.length === 0) return res.status(401)...
  // const validPassword = await bcrypt.compare(password, userResult.rows[0].password_hash);

  // Mock implementation for Demo:
  // Use bcrypt to generate a hash on the fly to simulate verification?
  // No, just check plain text for the "admin/admin" access but return a REAL JWT.

  if (username === 'admin' && password === 'admin') {
      const user = users[0];

      // Generate real JWT
      const token = jwt.sign(
          { id: user.id, username: user.username, role: user.role },
          process.env.JWT_KEY || 'secret_key',
          { expiresIn: '12h' }
      );

      res.json({
          token,
          user: {
              id: user.id,
              username: user.username,
              role: user.role,
              full_name: user.full_name
          }
      });
  } else {
      res.status(401).json({ message: 'Invalid credentials' });
  }
});

router.post('/logout', (req: Request, res: Response) => {
    res.json({ message: 'Logged out' });
});

router.get('/me', (req: Request, res: Response) => {
    // Should use req.currentUser from middleware
    if (!req.currentUser) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    // Return mock user info
    res.json({
        id: req.currentUser.id,
        username: req.currentUser.username,
        role: req.currentUser.role,
        full_name: 'Administrator' // In real app, fetch from DB
    });
});

export { router as authRouter };
