import express from 'express';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent
} from '../controllers/eventController.js';
import { validateEvent } from '../middleware/validationMiddleware.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

router
  .route('/')
  .get(asyncHandler(getEvents))
  .post(validateEvent, asyncHandler(createEvent));

router
  .route('/:id')
  .put(asyncHandler(updateEvent))
  .delete(asyncHandler(deleteEvent));

router.post('/:id/register', asyncHandler(registerForEvent));

export default router;
