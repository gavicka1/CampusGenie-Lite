import { EventModel } from '../models/eventModel.js';
import { ApiError } from '../middleware/errorHandler.js';

// @desc    Get all events
// @route   GET /api/events
export const getEvents = async (req, res) => {
  const events = await EventModel.getAll();
  res.status(200).json({
    success: true,
    count: events.length,
    data: events
  });
};

// @desc    Create a new event
// @route   POST /api/events
export const createEvent = async (req, res) => {
  const newEvent = await EventModel.create(req.body);
  res.status(201).json({
    success: true,
    message: 'Event created successfully',
    data: newEvent
  });
};

// @desc    Update event by ID
// @route   PUT /api/events/:id
export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const existing = await EventModel.getById(id);

  if (!existing) {
    throw new ApiError(`Event with ID ${id} not found`, 404);
  }

  const updatedEvent = await EventModel.update(id, req.body);
  res.status(200).json({
    success: true,
    message: 'Event updated successfully',
    data: updatedEvent
  });
};

// @desc    Delete event by ID
// @route   DELETE /api/events/:id
export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  const existing = await EventModel.getById(id);

  if (!existing) {
    throw new ApiError(`Event with ID ${id} not found`, 404);
  }

  await EventModel.delete(id);
  res.status(200).json({
    success: true,
    message: `Event ${id} deleted successfully`
  });
};

// @desc    Register for event (toggle registration status)
// @route   POST /api/events/:id/register
export const registerForEvent = async (req, res) => {
  const { id } = req.params;
  const existing = await EventModel.getById(id);

  if (!existing) {
    throw new ApiError(`Event with ID ${id} not found`, 404);
  }

  const updatedEvent = await EventModel.toggleRegistration(id);
  res.status(200).json({
    success: true,
    message: updatedEvent.registered
      ? `Successfully registered for event: ${updatedEvent.title}`
      : `Cancelled registration for event: ${updatedEvent.title}`,
    data: updatedEvent
  });
};
