import express from 'express';
import { dashboardController } from './dashboard.controller';

const router = express.Router();

router.get('/dashboard/global-summary', dashboardController.getGlobalSummary);
router.get('/plants/:plantId/dashboard-overview', dashboardController.getPlantOverview);

export { router as dashboardRouter };
