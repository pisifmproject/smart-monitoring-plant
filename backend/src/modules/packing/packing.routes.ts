import express from 'express';
import { packingController } from './packing.controller';

const router = express.Router();

router.get('/plants/:plantId/packing-configs', packingController.getByPlantId);
router.get('/packing-configs/:id', packingController.getById);

export { router as packingRouter };
