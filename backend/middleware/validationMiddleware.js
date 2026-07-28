import { ApiError } from './errorHandler.js';

const VALID_PRIORITIES = ['Low', 'Medium', 'High'];
const VALID_STATUSES = ['Pending', 'In Progress', 'Completed'];

// Helper to validate date format (YYYY-MM-DD) and correctness
const isValidDate = (dateStr) => {
  if (typeof dateStr !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

// Validate Assignment Input (Create)
export const validateAssignment = (req, res, next) => {
  const { title, subject, deadline, priority, status, description } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    throw new ApiError('Title is required and must be a valid string', 400);
  }
  if (title.length > 255) {
    throw new ApiError('Title cannot exceed 255 characters', 400);
  }

  if (!subject || typeof subject !== 'string' || !subject.trim()) {
    throw new ApiError('Subject is required and must be a valid string', 400);
  }
  if (subject.length > 100) {
    throw new ApiError('Subject cannot exceed 100 characters', 400);
  }

  if (!deadline) {
    throw new ApiError('Deadline is required', 400);
  }
  if (!isValidDate(deadline)) {
    throw new ApiError('Deadline must be a valid date in YYYY-MM-DD format', 400);
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    throw new ApiError(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}`, 400);
  }
  if (status && !VALID_STATUSES.includes(status)) {
    throw new ApiError(`Status must be one of: ${VALID_STATUSES.join(', ')}`, 400);
  }

  if (description !== undefined && description !== null) {
    if (typeof description !== 'string' || description.length > 65535) {
      throw new ApiError('Description must be a valid string not exceeding 65535 characters', 400);
    }
  }

  next();
};

// Validate Partial Assignment Input (Update)
export const validateAssignmentUpdate = (req, res, next) => {
  const { title, subject, deadline, priority, status, description } = req.body;

  if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) {
      throw new ApiError('Title must be a valid non-empty string', 400);
    }
    if (title.length > 255) {
      throw new ApiError('Title cannot exceed 255 characters', 400);
    }
  }

  if (subject !== undefined) {
    if (typeof subject !== 'string' || !subject.trim()) {
      throw new ApiError('Subject must be a valid non-empty string', 400);
    }
    if (subject.length > 100) {
      throw new ApiError('Subject cannot exceed 100 characters', 400);
    }
  }

  if (deadline !== undefined) {
    if (!isValidDate(deadline)) {
      throw new ApiError('Deadline must be a valid date in YYYY-MM-DD format', 400);
    }
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    throw new ApiError(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}`, 400);
  }
  if (status && !VALID_STATUSES.includes(status)) {
    throw new ApiError(`Status must be one of: ${VALID_STATUSES.join(', ')}`, 400);
  }

  if (description !== undefined && description !== null) {
    if (typeof description !== 'string' || description.length > 65535) {
      throw new ApiError('Description must be a valid string not exceeding 65535 characters', 400);
    }
  }

  next();
};

// Validate Study Task Input (Create)
export const validateStudyTask = (req, res, next) => {
  const { taskName, subject, plannedDate, priority, status } = req.body;

  if (!taskName || typeof taskName !== 'string' || !taskName.trim()) {
    throw new ApiError('Task name is required and must be a valid string', 400);
  }
  if (taskName.length > 255) {
    throw new ApiError('Task name cannot exceed 255 characters', 400);
  }

  if (!subject || typeof subject !== 'string' || !subject.trim()) {
    throw new ApiError('Subject is required and must be a valid string', 400);
  }
  if (subject.length > 100) {
    throw new ApiError('Subject cannot exceed 100 characters', 400);
  }

  if (!plannedDate) {
    throw new ApiError('Planned date is required', 400);
  }
  if (!isValidDate(plannedDate)) {
    throw new ApiError('Planned date must be a valid date in YYYY-MM-DD format', 400);
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    throw new ApiError(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}`, 400);
  }
  if (status && !VALID_STATUSES.includes(status)) {
    throw new ApiError(`Status must be one of: ${VALID_STATUSES.join(', ')}`, 400);
  }

  next();
};

// Validate Partial Study Task Input (Update)
export const validateStudyTaskUpdate = (req, res, next) => {
  const { taskName, subject, plannedDate, priority, status } = req.body;

  if (taskName !== undefined) {
    if (typeof taskName !== 'string' || !taskName.trim()) {
      throw new ApiError('Task name must be a valid non-empty string', 400);
    }
    if (taskName.length > 255) {
      throw new ApiError('Task name cannot exceed 255 characters', 400);
    }
  }

  if (subject !== undefined) {
    if (typeof subject !== 'string' || !subject.trim()) {
      throw new ApiError('Subject must be a valid non-empty string', 400);
    }
    if (subject.length > 100) {
      throw new ApiError('Subject cannot exceed 100 characters', 400);
    }
  }

  if (plannedDate !== undefined) {
    if (!isValidDate(plannedDate)) {
      throw new ApiError('Planned date must be a valid date in YYYY-MM-DD format', 400);
    }
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    throw new ApiError(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}`, 400);
  }
  if (status && !VALID_STATUSES.includes(status)) {
    throw new ApiError(`Status must be one of: ${VALID_STATUSES.join(', ')}`, 400);
  }

  next();
};

// Validate Event Input (Create)
export const validateEvent = (req, res, next) => {
  const { title, date, location, description } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    throw new ApiError('Event title is required', 400);
  }
  if (title.length > 255) {
    throw new ApiError('Event title cannot exceed 255 characters', 400);
  }

  if (!date) {
    throw new ApiError('Event date is required', 400);
  }
  if (!isValidDate(date)) {
    throw new ApiError('Event date must be a valid date in YYYY-MM-DD format', 400);
  }

  if (!location || typeof location !== 'string' || !location.trim()) {
    throw new ApiError('Event location is required', 400);
  }
  if (location.length > 255) {
    throw new ApiError('Event location cannot exceed 255 characters', 400);
  }

  if (!description || typeof description !== 'string') {
    throw new ApiError('Event description is required', 400);
  }
  if (description.length > 65535) {
    throw new ApiError('Event description cannot exceed 65535 characters', 400);
  }

  next();
};
