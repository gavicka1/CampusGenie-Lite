import express from 'express';
import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment
} from '../controllers/assignmentController.js';
import {
  validateAssignment,
  validateAssignmentUpdate
} from '../middleware/validationMiddleware.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

router
  .route('/')
  .get(asyncHandler(getAssignments))
  .post(validateAssignment, asyncHandler(createAssignment));

router
  .route('/:id')
  .put(validateAssignmentUpdate, asyncHandler(updateAssignment))
  .delete(asyncHandler(deleteAssignment));

export default router;
