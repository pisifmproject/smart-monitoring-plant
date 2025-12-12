import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { authRouter } from './modules/auth/auth.routes';
import { plantRouter } from './modules/plants/plants.routes';
import { machineRouter } from './modules/machines/machines.routes';
import { lvmdpRouter } from './modules/lvmdp/lvmdp.routes';
import { utilityRouter } from './modules/utilities/utilities.routes';
import { dashboardRouter } from './modules/dashboard/dashboard.routes';
import { maintenanceRouter } from './modules/maintenance/maintenance.routes';
import { packingRouter } from './modules/packing/packing.routes';
import { visibilityRouter } from './modules/visibility/visibility.routes';
import { requireAuth } from './common/middlewares/auth-middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Security Middleware
app.use(helmet()); // Secure HTTP headers
app.use(cors());   // Allow CORS (configure strictly in production)

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

app.use(express.json());

// Routes
app.get('/api/stable/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Auth Routes (Public)
app.use('/api/stable/auth', authRouter);

// Protected Routes
// For now, we apply auth middleware to all other routes.
// But since the frontend sends token in headers (not yet implemented in frontend fully),
// and we have a mock "requireAuth" that defaults to admin if no token, it's safe to apply.
// We should update requireAuth to actually verify JWT.
app.use(requireAuth);

app.use('/api/stable/plants', plantRouter);
app.use('/api/stable/machines', machineRouter);
app.use('/api/stable/lvmdp-panels', lvmdpRouter);
app.use('/api/stable', utilityRouter);
app.use('/api/stable', dashboardRouter);
app.use('/api/stable', maintenanceRouter);
app.use('/api/stable', packingRouter);
app.use('/api/stable', visibilityRouter);

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
