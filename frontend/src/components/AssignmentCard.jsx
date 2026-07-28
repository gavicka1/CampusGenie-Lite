import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function AssignmentCard({ assignment }) {
  const { updateAssignmentStatus, deleteAssignment } = useApp();
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':   return 'badge-high';
      case 'medium': return 'badge-medium';
      case 'low':    return 'badge-low';
      default:       return 'badge-secondary';
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':  return 'status-completed';
      case 'in progress': return 'status-in-progress';
      case 'pending':    return 'status-pending';
      default:           return 'status-secondary';
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setUpdating(true);
    await updateAssignmentStatus(assignment.id, newStatus);
    setUpdating(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${assignment.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    await deleteAssignment(assignment.id);
    // Component unmounts on success; no need to reset state
  };

  return (
    <article className="card assignment-card" aria-label={`Assignment: ${assignment.title}`}>
      <div className="card-header">
        <div className="subject-tag">{assignment.subject}</div>
        <div className="card-badges">
          <span
            className={`priority-badge ${getPriorityClass(assignment.priority)}`}
            aria-label={`Priority: ${assignment.priority}`}
          >
            {assignment.priority} Priority
          </span>
          <span
            className={`status-badge ${getStatusClass(assignment.status)}`}
            aria-label={`Status: ${assignment.status}`}
          >
            {assignment.status}
          </span>
        </div>
      </div>

      <div className="card-body">
        <h3 className="card-title">{assignment.title}</h3>
        {assignment.description && (
          <p className="card-description">{assignment.description}</p>
        )}
        <div className="card-meta">
          <div className="meta-item">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Due: <time dateTime={assignment.deadline}>{assignment.deadline}</time></span>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <div className="status-selector">
          <label htmlFor={`status-${assignment.id}`}>Status:</label>
          <select
            id={`status-${assignment.id}`}
            value={assignment.status}
            onChange={handleStatusChange}
            disabled={updating || deleting}
            aria-label={`Update status for ${assignment.title}`}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          {updating && <span className="inline-spinner" aria-label="Updating…" />}
        </div>

        <button
          className="btn-delete"
          onClick={handleDelete}
          disabled={deleting || updating}
          aria-label={`Delete assignment: ${assignment.title}`}
          title="Delete assignment"
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
