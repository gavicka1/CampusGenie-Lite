import { StudyTaskModel } from '../models/studyTaskModel.js';
import { ApiError } from '../middleware/errorHandler.js';

// @desc    Get all study tasks
// @route   GET /api/study-tasks
export const getStudyTasks = async (req, res) => {
  const tasks = await StudyTaskModel.getAll();
  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
};

// @desc    Create a new study task
// @route   POST /api/study-tasks
export const createStudyTask = async (req, res) => {
  const newTask = await StudyTaskModel.create(req.body);
  res.status(201).json({
    success: true,
    message: 'Study task created successfully',
    data: newTask
  });
};

// @desc    Update study task by ID
// @route   PUT /api/study-tasks/:id
export const updateStudyTask = async (req, res) => {
  const { id } = req.params;
  const existing = await StudyTaskModel.getById(id);

  if (!existing) {
    throw new ApiError(`Study task with ID ${id} not found`, 404);
  }

  const updatedTask = await StudyTaskModel.update(id, req.body);
  res.status(200).json({
    success: true,
    message: 'Study task updated successfully',
    data: updatedTask
  });
};

// @desc    Delete study task by ID
// @route   DELETE /api/study-tasks/:id
export const deleteStudyTask = async (req, res) => {
  const { id } = req.params;
  const existing = await StudyTaskModel.getById(id);

  if (!existing) {
    throw new ApiError(`Study task with ID ${id} not found`, 404);
  }

  await StudyTaskModel.delete(id);
  res.status(200).json({
    success: true,
    message: `Study task ${id} deleted successfully`
  });
};
