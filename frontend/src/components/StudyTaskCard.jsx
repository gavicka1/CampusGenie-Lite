import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function StudyTaskCard({ task }) {
  const { updateTaskStatus, deleteTask } = useApp();
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isCompleted = task.status === 'Completed';

  const handleToggle = async () => {
    setUpdating(true);
    await updateTaskStatus(task.id, isCompleted ? 'Pending' : 'Completed');
    setUpdating(false);
  };

  const handleStatusChange = async (e) => {
    setUpdating(true);
    await updateTaskStatus(task.id, e.target.value);
    setUpdating(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${task.taskName}"? This cannot be undone.`)) return;
    setDeleting(true);
    await deleteTask(task.id);
  };

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':   return 'badge-high';
      case 'medium': return 'badge-medium';
      case 'low':    return 'badge-low';
      default:       return 'badge-secondary';
    }
  };

  return (
    <article
      className={`card task-card${isCompleted ? ' task-completed' : ''}`}
      aria-label={`Study task: ${task.taskName}`}
    >
      <div className="task-card-left">
        <button
          className={`checkbox-btn${isCompleted ? ' checked' : ''}`}
          onClick={handleToggle}
          disabled={updating || deleting}
          aria-label={isCompleted ? `Mark "${task.taskName}" as pending` : `Mark "${task.taskName}" as completed`}
          aria-pressed={isCompleted}
        >
          {isCompleted && (
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="task-details">
          <h4 className="task-title">{task.taskName}</h4>
          <div className="task-submeta">
            <span className="task-subject">{task.subject}</span>
            <span className="dot-divider" aria-hidden="true">•</span>
            <span className="task-date">
              <span aria-hidden="true">📅</span>{' '}
              <time dateTime={task.plannedDate}>{task.plannedDate}</time>
            </span>
          </div>
        </div>
      </div>

      <div className="task-card-right">
        <span
          className={`priority-badge ${getPriorityClass(task.priority)}`}
          aria-label={`Priority: ${task.priority}`}
        >
          {task.priority}
        </span>

        <select
          className="task-status-select"
          value={task.status}
          onChange={handleStatusChange}
          disabled={updating || deleting}
          aria-label={`Status for ${task.taskName}`}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <button
          className="btn-delete"
          onClick={handleDelete}
          disabled={deleting || updating}
          aria-label={`Delete task: ${task.taskName}`}
          title="Delete task"
        >
          {deleting ? (
            <span className="inline-spinner" aria-label="Deleting…" />
          ) : (
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>
    </article>
  );
}
