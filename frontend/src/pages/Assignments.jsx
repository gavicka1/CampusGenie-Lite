import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import AssignmentCard from '../components/AssignmentCard';
import AssignmentModal from '../components/AssignmentModal';

export default function Assignments() {
  const { assignments, loading, error, refreshData, searchQuery } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const filteredAssignments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return assignments.filter((a) => {
      const matchesStatus   = statusFilter === 'All' || a.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || a.priority === priorityFilter;
      const matchesSearch   = !q || (
        a.title.toLowerCase().includes(q) ||
        a.subject.toLowerCase().includes(q) ||
        (a.description && a.description.toLowerCase().includes(q))
      );
      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [assignments, statusFilter, priorityFilter, searchQuery]);

  const resetFilters = () => {
    setStatusFilter('All');
    setPriorityFilter('All');
  };

  const isFiltered = statusFilter !== 'All' || priorityFilter !== 'All' || searchQuery.trim() !== '';

  if (loading) {
    return (
      <div className="page-container" aria-busy="true" aria-label="Loading assignments">
        <div className="grid-responsive">
          {[...Array(3)].map((_, i) => (
            <div className="skeleton-card" key={i} aria-hidden="true">
              <div className="skeleton skeleton-line skeleton-short" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line skeleton-medium" />
              <div className="skeleton skeleton-line skeleton-short" style={{ marginTop: '0.5rem' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {error && (
        <div className="error-alert" role="alert">
          <span>⚠️ {error}</span>
          <button className="btn-secondary" onClick={refreshData}>Retry Connection</button>
        </div>
      )}

      {/* Filters & Actions Bar */}
      <div className="page-actions-bar">
        <div className="filter-group">
          <div className="select-wrapper">
            <label htmlFor="status-filter">Status:</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="select-wrapper">
            <label htmlFor="priority-filter">Priority:</label>
            <select
              id="priority-filter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              aria-label="Filter by priority"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <button className="btn-primary" onClick={() => setIsModalOpen(true)} aria-label="Add new assignment">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Assignment
        </button>
      </div>

      {/* Results count when searching */}
      {isFiltered && (
        <p className="results-count" aria-live="polite">
          {filteredAssignments.length} result{filteredAssignments.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Assignments Grid */}
      {filteredAssignments.length > 0 ? (
        <div className="grid-responsive">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">
            {searchQuery ? '🔍' : '📋'}
          </span>
          <p>
            {searchQuery
              ? `No assignments match "${searchQuery}".`
              : isFiltered
                ? 'No assignments match these filters.'
                : 'No assignments yet. Add your first one!'}
          </p>
          {isFiltered && (
            <button className="btn-secondary" onClick={resetFilters}>
              Clear Filters
            </button>
          )}
        </div>
      )}

      <AssignmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
