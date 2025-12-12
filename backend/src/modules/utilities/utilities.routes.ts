import express from 'express';
import { utilitiesController } from './utilities.controller';

const router = express.Router();

router.get('/plants/:plantId/utility-summary', utilitiesController.getSummary);
router.get('/plants/:plantId/utility-trend', utilitiesController.getTrend);
router.get('/plants/:plantId/utility-area-consumption', utilitiesController.getAreaConsumption);

export { router as utilityRouter };
