import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import StudyTaskCard from '../components/StudyTaskCard';
import TaskModal from '../components/TaskModal';

export default function StudyPlanner() {
  const { studyTasks, loading, error, refreshData, searchQuery } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('All');

  const filteredTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return studyTasks.filter((t) => {
      const matchesFilter =
        filter === 'All' ||
        (filter === 'Pending' && (t.status === 'Pending' || t.status === 'In Progress')) ||
        (filter === 'Completed' && t.status === 'Completed');
      const matchesSearch =
        !q ||
        t.taskName.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [studyTasks, filter, searchQuery]);

  const pendingCount   = useMemo(() => studyTasks.filter((t) => t.status !== 'Completed').length, [studyTasks]);
  const completedCount = useMemo(() => studyTasks.filter((t) => t.status === 'Completed').length, [studyTasks]);

  if (loading) {
    return (
      <div className="page-container" aria-busy="true" aria-label="Loading study tasks">
        <div className="cards-stack">
          {[...Array(3)].map((_, i) => (
            <div className="skeleton-card skeleton-task" key={i} aria-hidden="true">
              <div className="skeleton" style={{ width: 22, height: 22, borderRadius: '50%' }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton skeleton-line" style={{ height: 14, marginBottom: 6 }} />
                <div className="skeleton skeleton-line skeleton-short" style={{ height: 10 }} />
              </div>
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

      <div className="page-actions-bar">
        <div className="tab-filters" role="group" aria-label="Task status filter">
          <button
            className={`filter-chip${filter === 'All' ? ' active' : ''}`}
            onClick={() => setFilter('All')}
            aria-pressed={filter === 'All'}
          >
            All ({studyTasks.length})
          </button>
          <button
            className={`filter-chip${filter === 'Pending' ? ' active' : ''}`}
            onClick={() => setFilter('Pending')}
            aria-pressed={filter === 'Pending'}
          >
            Pending / In Progress ({pendingCount})
          </button>
          <button
            className={`filter-chip${filter === 'Completed' ? ' active' : ''}`}
            onClick={() => setFilter('Completed')}
            aria-pressed={filter === 'Completed'}
          >
            Completed ({completedCount})
          </button>
        </div>

        <button
          className="btn-primary"
          onClick={() => setIsModalOpen(true)}
          aria-label="Add new study task"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Study Task
        </button>
      </div>

      {/* Results count when searching */}
      {searchQuery.trim() && (
        <p className="results-count" aria-live="polite">
          {filteredTasks.length} result{filteredTasks.length !== 1 ? 's' : ''} found
        </p>
      )}

      {filteredTasks.length > 0 ? (
        <div className="cards-stack">
          {filteredTasks.map((task) => (
            <StudyTaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">
            {searchQuery ? '🔍' : filter === 'Completed' ? '📚' : '✅'}
          </span>
          <p>
            {searchQuery
              ? `No tasks match "${searchQuery}".`
              : filter === 'Completed'
                ? 'No completed tasks yet. Keep going!'
                : filter === 'Pending'
                  ? 'No pending tasks — great work!'
                  : 'No study tasks yet. Add your first one!'}
          </p>
        </div>
      )}

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
