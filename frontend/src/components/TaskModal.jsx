import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

const NAME_MAX = 255;

export default function TaskModal({ isOpen, onClose }) {
  const { addStudyTask } = useApp();
  const [error, setError]           = useState(null);
  const [submitting, setSubmitting]  = useState(false);
  const nameRef = useRef(null);

  const defaultForm = {
    taskName: '', subject: '', plannedDate: '', priority: 'Medium', status: 'Pending',
  };
  const [formData, setFormData] = useState(defaultForm);

  // Auto-focus first field when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => nameRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setError(null);
    setFormData(defaultForm);
    onClose();
  };

  const set = (field) => (e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.taskName.trim() || !formData.subject.trim() || !formData.plannedDate) return;

    setError(null);
    setSubmitting(true);
    const result = await addStudyTask(formData);
    setSubmitting(false);

    if (result?.success) {
      setFormData(defaultForm);
      onClose();
    } else {
      setError(result?.error || 'Failed to add study task');
    }
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="task-modal-title">Add Study Task</h2>
          <button className="btn-close" onClick={handleClose} aria-label="Close modal">×</button>
        </div>

        {error && (
          <div className="error-alert" role="alert" style={{ marginTop: '1rem' }}>
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <div className="form-group">
            <div className="label-row">
              <label htmlFor="task-name">Task Name *</label>
              <span className={`char-count${formData.taskName.length > NAME_MAX - 20 ? ' char-count-warn' : ''}`}>
                {formData.taskName.length}/{NAME_MAX}
              </span>
            </div>
            <input
              id="task-name"
              ref={nameRef}
              type="text"
              required
              maxLength={NAME_MAX}
              placeholder="e.g. Revise Chapter 3 — Dynamic Programming"
              value={formData.taskName}
              onChange={set('taskName')}
              aria-required="true"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-subject">Subject *</label>
              <input
                id="task-subject"
                type="text"
                required
                maxLength={100}
                placeholder="e.g. Algorithms"
                value={formData.subject}
                onChange={set('subject')}
                aria-required="true"
              />
            </div>
            <div className="form-group">
              <label htmlFor="task-date">Planned Date *</label>
              <input
                id="task-date"
                type="date"
                required
                value={formData.plannedDate}
                onChange={set('plannedDate')}
                aria-required="true"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-priority">Priority</label>
              <select id="task-priority" value={formData.priority} onChange={set('priority')}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="task-status">Initial Status</label>
              <select id="task-status" value={formData.status} onChange={set('status')}>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={handleClose} disabled={submitting}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting || !formData.taskName.trim() || !formData.subject.trim() || !formData.plannedDate}
            >
              {submitting ? (
                <><span className="inline-spinner" aria-hidden="true" /> Saving…</>
              ) : (
                'Save Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
