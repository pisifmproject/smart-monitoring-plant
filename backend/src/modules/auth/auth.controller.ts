import { Request, Response } from 'express';
import { authService } from './auth.service';

export const authController = {
    async login(req: Request, res: Response) {
        try {
            const result = await authService.login(req.body);
            if (!result) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            res.json(result);
        } catch (err) {
            console.error('Login error:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async logout(req: Request, res: Response) {
        res.json({ message: 'Logged out' });
    },

    async me(req: Request, res: Response) {
        if (!req.currentUser) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        try {
            const user = await authService.getCurrentUser(req.currentUser.id);
            if (user) {
                res.json(user);
            } else {
                // Fallback / not found
                res.json({
                    id: req.currentUser.id,
                    username: req.currentUser.username,
                    role: req.currentUser.role,
                    full_name: 'Administrator'
                });
            }
        } catch (e) {
             res.json({
                id: req.currentUser.id,
                username: req.currentUser.username,
                role: req.currentUser.role,
                full_name: 'Administrator'
            });
        }
    }
};
