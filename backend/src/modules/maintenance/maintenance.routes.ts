import express from 'express';
import { maintenanceController } from './maintenance.controller';

const router = express.Router();

router.get('/maintenance-records', maintenanceController.getAll);
router.post('/maintenance-records', maintenanceController.create);
router.get('/maintenance-records/:id', maintenanceController.getById);

export { router as maintenanceRouter };
