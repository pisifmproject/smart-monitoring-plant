import express from 'express';
import { lvmdpController } from './lvmdp.controller';

const router = express.Router();

router.get('/:id', lvmdpController.getById);
router.get('/:id/realtime', lvmdpController.getRealtime);
router.get('/:id/historical', lvmdpController.getHistorical);

export { router as lvmdpRouter };
