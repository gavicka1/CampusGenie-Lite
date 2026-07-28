import { AssignmentModel } from '../models/assignmentModel.js';
import { ApiError } from '../middleware/errorHandler.js';

// @desc    Get all assignments
// @route   GET /api/assignments
export const getAssignments = async (req, res) => {
  const assignments = await AssignmentModel.getAll();
  res.status(200).json({
    success: true,
    count: assignments.length,
    data: assignments
  });
};

// @desc    Create a new assignment
// @route   POST /api/assignments
export const createAssignment = async (req, res) => {
  const newAssignment = await AssignmentModel.create(req.body);
  res.status(201).json({
    success: true,
    message: 'Assignment created successfully',
    data: newAssignment
  });
};

// @desc    Update assignment by ID
// @route   PUT /api/assignments/:id
export const updateAssignment = async (req, res) => {
  const { id } = req.params;
  const existing = await AssignmentModel.getById(id);

  if (!existing) {
    throw new ApiError(`Assignment with ID ${id} not found`, 404);
  }

  const updatedAssignment = await AssignmentModel.update(id, req.body);
  res.status(200).json({
    success: true,
    message: 'Assignment updated successfully',
    data: updatedAssignment
  });
};

// @desc    Delete assignment by ID
// @route   DELETE /api/assignments/:id
export const deleteAssignment = async (req, res) => {
  const { id } = req.params;
  const existing = await AssignmentModel.getById(id);

  if (!existing) {
    throw new ApiError(`Assignment with ID ${id} not found`, 404);
  }

  await AssignmentModel.delete(id);
  res.status(200).json({
    success: true,
    message: `Assignment ${id} deleted successfully`
  });
};
