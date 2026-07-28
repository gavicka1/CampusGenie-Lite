import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

const TITLE_MAX = 255;
const DESC_MAX  = 1000;

export default function AssignmentModal({ isOpen, onClose }) {
  const { addAssignment } = useApp();
  const [error, setError]         = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const titleRef = useRef(null);

  const defaultForm = {
    title: '', subject: '', deadline: '', priority: 'Medium', status: 'Pending', description: '',
  };
  const [formData, setFormData] = useState(defaultForm);

  // Auto-focus first field when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => titleRef.current?.focus(), 50);
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
    if (!formData.title.trim() || !formData.subject.trim() || !formData.deadline) return;

    setError(null);
    setSubmitting(true);
    const result = await addAssignment(formData);
    setSubmitting(false);

    if (result?.success) {
      setFormData(defaultForm);
      onClose();
    } else {
      setError(result?.error || 'Failed to add assignment');
    }
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assignment-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="assignment-modal-title">Create New Assignment</h2>
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
              <label htmlFor="modal-title">Assignment Title *</label>
              <span className={`char-count${formData.title.length > TITLE_MAX - 20 ? ' char-count-warn' : ''}`}>
                {formData.title.length}/{TITLE_MAX}
              </span>
            </div>
            <input
              id="modal-title"
              ref={titleRef}
              type="text"
              required
              maxLength={TITLE_MAX}
              placeholder="e.g. Distributed Systems Lab Report"
              value={formData.title}
              onChange={set('title')}
              aria-required="true"
              aria-describedby="modal-title-hint"
            />
            <span id="modal-title-hint" className="field-hint">Required. Max {TITLE_MAX} characters.</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="modal-subject">Subject *</label>
              <input
                id="modal-subject"
                type="text"
                required
                maxLength={100}
                placeholder="e.g. Cloud Computing"
                value={formData.subject}
                onChange={set('subject')}
                aria-required="true"
              />
            </div>
            <div className="form-group">
              <label htmlFor="modal-deadline">Deadline *</label>
              <input
                id="modal-deadline"
                type="date"
                required
                value={formData.deadline}
                onChange={set('deadline')}
                aria-required="true"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="modal-priority">Priority</label>
              <select id="modal-priority" value={formData.priority} onChange={set('priority')}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="modal-status">Initial Status</label>
              <select id="modal-status" value={formData.status} onChange={set('status')}>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="modal-desc">Description</label>
              <span className={`char-count${formData.description.length > DESC_MAX - 50 ? ' char-count-warn' : ''}`}>
                {formData.description.length}/{DESC_MAX}
              </span>
            </div>
            <textarea
              id="modal-desc"
              rows="3"
              maxLength={DESC_MAX}
              placeholder="Brief details about instructions or requirements…"
              value={formData.description}
              onChange={set('description')}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={handleClose} disabled={submitting}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting || !formData.title.trim() || !formData.subject.trim() || !formData.deadline}
            >
              {submitting ? (
                <><span className="inline-spinner" aria-hidden="true" /> Adding…</>
              ) : (
                'Add Assignment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
