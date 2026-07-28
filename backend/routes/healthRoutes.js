import express from 'express';
import { getHealthStatus } from '../controllers/healthController.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

router.get('/health', asyncHandler(getHealthStatus));

export default router;
