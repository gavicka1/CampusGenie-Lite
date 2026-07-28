import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import AssignmentCard from '../components/AssignmentCard';
import StudyTaskCard from '../components/StudyTaskCard';

function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-line skeleton-short" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line skeleton-medium" />
    </div>
  );
}

function SkeletonStat() {
  return (
    <div className="stat-card" aria-hidden="true">
      <div className="stat-card-header">
        <div className="skeleton skeleton-line skeleton-short" style={{ height: '12px' }} />
        <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 10 }} />
      </div>
      <div className="stat-card-body" style={{ marginTop: '0.75rem' }}>
        <div className="skeleton skeleton-line skeleton-short" style={{ height: '28px', width: '40px' }} />
        <div className="skeleton skeleton-line skeleton-medium" style={{ height: '10px', marginTop: '6px' }} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { assignments, studyTasks, events, setActiveTab, loading, error, refreshData } = useApp();

  const stats = useMemo(() => ({
    total:        assignments.length,
    pending:      assignments.filter((a) => a.status === 'Pending').length,
    completed:    assignments.filter((a) => a.status === 'Completed').length,
    totalTasks:   studyTasks.length,
    doneTasks:    studyTasks.filter((t) => t.status === 'Completed').length,
    upcomingEvts: events.length,
    registered:   events.filter((e) => e.registered).length,
  }), [assignments, studyTasks, events]);

  const recentAssignments  = useMemo(() => assignments.slice(0, 3), [assignments]);
  const upcomingStudyTasks = useMemo(
    () => studyTasks.filter((t) => t.status !== 'Completed').slice(0, 3),
    [studyTasks]
  );

  const bannerMessage = () => {
    if (stats.pending === 0 && stats.doneTasks === studyTasks.length && studyTasks.length > 0) {
      return 'All caught up! No pending assignments or tasks. 🎉';
    }
    const parts = [];
    if (stats.pending > 0)
      parts.push(`${stats.pending} pending assignment${stats.pending !== 1 ? 's' : ''}`);
    if (upcomingStudyTasks.length > 0)
      parts.push(`${upcomingStudyTasks.length} study task${upcomingStudyTasks.length !== 1 ? 's' : ''} in progress`);
    return parts.length > 0
      ? `You have ${parts.join(' and ')}.`
      : 'Your dashboard is up to date.';
  };

  if (loading) {
    return (
      <div className="page-container" aria-busy="true" aria-label="Loading dashboard">
        <div className="stats-grid">
          {[...Array(4)].map((_, i) => <SkeletonStat key={i} />)}
        </div>
        <div className="dashboard-sections-grid">
          <section className="dashboard-section">
            <div className="section-header">
              <div className="skeleton skeleton-line" style={{ width: 160, height: 18 }} />
            </div>
            {[...Array(2)].map((_, i) => <SkeletonCard key={i} />)}
          </section>
          <section className="dashboard-section">
            <div className="section-header">
              <div className="skeleton skeleton-line" style={{ width: 160, height: 18 }} />
            </div>
            {[...Array(2)].map((_, i) => <SkeletonCard key={i} />)}
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Error Banner */}
      {error && (
        <div className="error-alert" role="alert">
          <span>⚠️ {error}</span>
          <button className="btn-secondary" onClick={refreshData}>Retry Connection</button>
        </div>
      )}

      {/* Welcome Banner */}
      <section className="welcome-banner" aria-label="Summary">
        <div className="banner-content">
          <h2>Welcome back! 👋</h2>
          <p>{bannerMessage()}</p>
        </div>
        <div className="banner-actions">
          <button className="btn-primary" onClick={() => setActiveTab('assignments')}>
            View All Assignments
          </button>
        </div>
      </section>

      {/* Stat Cards */}
      <section className="stats-grid" aria-label="Statistics overview">
        <StatCard
          title="Total Assignments"
          value={stats.total}
          color="blue"
          subtitle={`${stats.completed} completed`}
          icon={
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatCard
          title="Pending Assignments"
          value={stats.pending}
          color="amber"
          subtitle={stats.pending === 0 ? 'All caught up!' : `${stats.pending} require${stats.pending === 1 ? 's' : ''} attention`}
          icon={
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Study Tasks"
          value={stats.totalTasks}
          color="purple"
          subtitle={`${stats.doneTasks} completed`}
          icon={
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          title="Campus Events"
          value={stats.upcomingEvts}
          color="emerald"
          subtitle={`${stats.registered} registered`}
          icon={
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />
      </section>

      {/* Recent Assignments & Upcoming Tasks */}
      <div className="dashboard-sections-grid">
        <section className="dashboard-section" aria-label="Recent assignments">
          <div className="section-header">
            <h3>Recent Assignments</h3>
            <button className="btn-link" onClick={() => setActiveTab('assignments')}>
              See All →
            </button>
          </div>
          <div className="cards-stack">
            {recentAssignments.length > 0 ? (
              recentAssignments.map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))
            ) : (
              <div className="empty-state">
                <span className="empty-icon" aria-hidden="true">📋</span>
                <p>No assignments yet.</p>
                <button className="btn-secondary" onClick={() => setActiveTab('assignments')}>
                  Add Assignment
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="dashboard-section" aria-label="Upcoming study tasks">
          <div className="section-header">
            <h3>Upcoming Study Tasks</h3>
            <button className="btn-link" onClick={() => setActiveTab('study-planner')}>
              Open Planner →
            </button>
          </div>
          <div className="cards-stack">
            {upcomingStudyTasks.length > 0 ? (
              upcomingStudyTasks.map((task) => (
                <StudyTaskCard key={task.id} task={task} />
              ))
            ) : (
              <div className="empty-state">
                <span className="empty-icon" aria-hidden="true">✅</span>
                <p>No pending tasks — great work!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
