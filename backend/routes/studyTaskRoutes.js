import express from 'express';
import {
  getStudyTasks,
  createStudyTask,
  updateStudyTask,
  deleteStudyTask
} from '../controllers/studyTaskController.js';
import { validateStudyTask, validateStudyTaskUpdate } from '../middleware/validationMiddleware.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

router
  .route('/')
  .get(asyncHandler(getStudyTasks))
  .post(validateStudyTask, asyncHandler(createStudyTask));

router
  .route('/:id')
  .put(validateStudyTaskUpdate, asyncHandler(updateStudyTask))
  .delete(asyncHandler(deleteStudyTask));

export default router;
