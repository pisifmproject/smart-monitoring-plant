import express from 'express';
import { machinesController } from './machines.controller';

const router = express.Router();

router.get('/', machinesController.getAll);
router.get('/:id', machinesController.getById);
router.get('/:id/alarms', machinesController.getAlarms);
router.get('/:id/downtime', machinesController.getDowntime);
router.get('/:id/packing-config', machinesController.getPackingConfig);
router.get('/:id/maintenance-records', machinesController.getMaintenanceRecords);

export { router as machineRouter };
