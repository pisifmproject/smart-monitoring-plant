import express from 'express';
import { authController } from './auth.controller';

const router = express.Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.me);

export { router as authRouter };
