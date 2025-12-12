import express from 'express';
import { plantsController } from './plants.controller';

const router = express.Router();

router.get('/', plantsController.getAll);
router.post('/', plantsController.create);
router.get('/:id', plantsController.getById);
router.get('/:id/machines', plantsController.getMachines);
router.get('/:id/lvmdp-panels', plantsController.getLVMDPs);

export { router as plantRouter };
