import express from 'express';
import { visibilityController } from './visibility.controller';

const router = express.Router();

router.get('/visibility/items', visibilityController.getItems);
router.get('/visibility/rules', visibilityController.getRules);

export { router as visibilityRouter };
