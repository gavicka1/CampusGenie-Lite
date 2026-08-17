import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const {
    activeTab,
    setSidebarOpen,
    assignments,
    studyTasks,
    toast,
    refreshData,
    loading,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  // Close panel on outside click
  useEffect(() => {
    if (!notifOpen) return;
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [notifOpen]);

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':     return 'Student Dashboard';
      case 'assignments':   return 'Assignments';
      case 'study-planner': return 'Study Planner';
      case 'campus-events': return 'Campus Events';
      default:              return 'Dashboard';
    }
  };

  const getPlaceholder = () => {
    switch (activeTab) {
      case 'assignments':   return 'Search assignments…';
      case 'study-planner': return 'Search study tasks…';
      case 'campus-events': return 'Search events…';
      default:              return 'Search assignments, tasks…';
    }
  };

  const pendingAssignments = assignments.filter((a) => a.status === 'Pending');
  const pendingTasks = studyTasks.filter((t) => t.status === 'Pending');
  const pendingCount = pendingAssignments.length + pendingTasks.length;

  const formatDue = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    if (isNaN(date)) return null;
    const now = new Date();
    const diff = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { label: 'Overdue', urgent: true };
    if (diff === 0) return { label: 'Due today', urgent: true };
    if (diff === 1) return { label: 'Due tomorrow', urgent: true };
    return { label: `Due in ${diff} days`, urgent: false };
  };

  return (
    <>
      <header className="navbar" role="banner">
        <div className="navbar-left">
          <button
            className="mobile-toggle"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="page-title">{getTitle()}</h1>
        </div>

        <div className="navbar-right">
          <button
            className={`icon-btn${loading ? ' spinning' : ''}`}
            onClick={refreshData}
            title="Refresh data"
            aria-label="Refresh data from server"
            disabled={loading}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          <div className="search-bar" role="search">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="global-search"
              type="search"
              placeholder={getPlaceholder()}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search content"
              autoComplete="off"
            />
            {searchQuery && (
              <button
                className="search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <div className="notif-wrapper" ref={notifRef}>
            <button
              className={`icon-btn${notifOpen ? ' icon-btn--active' : ''}`}
              onClick={() => setNotifOpen((prev) => !prev)}
              aria-label={`${pendingCount} pending item${pendingCount !== 1 ? 's' : ''}. Open notifications`}
              aria-expanded={notifOpen}
              aria-haspopup="true"
              title="Notifications"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9" />
              </svg>
              {pendingCount > 0 && (
                <span className="notification-badge" aria-label={`${pendingCount} pending`}>
                  {pendingCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="notif-panel" role="dialog" aria-label="Notifications">
                <div className="notif-panel-header">
                  <span className="notif-panel-title">Notifications</span>
                  {pendingCount > 0 && (
                    <span className="notif-panel-count">{pendingCount} pending</span>
                  )}
                </div>

                <div className="notif-panel-body">
                  {pendingCount === 0 ? (
                    <div className="notif-empty">
                      <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>You're all caught up!</p>
                    </div>
                  ) : (
                    <>
                      {pendingAssignments.length > 0 && (
                        <div className="notif-group">
                          <span className="notif-group-label">Assignments</span>
                          {pendingAssignments.map((a) => {
                            const due = formatDue(a.due_date || a.dueDate);
                            return (
                              <div className="notif-item" key={a.id}>
                                <div className="notif-item-icon notif-item-icon--assignment">
                                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                <div className="notif-item-content">
                                  <span className="notif-item-title">{a.title || a.name}</span>
                                  {due && (
                                    <span className={`notif-item-due${due.urgent ? ' notif-item-due--urgent' : ''}`}>
                                      {due.label}
                                    </span>
                                  )}
                                </div>
                                <span className="notif-item-badge notif-item-badge--assignment">Task</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {pendingTasks.length > 0 && (
                        <div className="notif-group">
                          <span className="notif-group-label">Study Tasks</span>
                          {pendingTasks.map((t) => {
                            const due = formatDue(t.due_date || t.dueDate);
                            return (
                              <div className="notif-item" key={t.id}>
                                <div className="notif-item-icon notif-item-icon--study">
                                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                  </svg>
                                </div>
                                <div className="notif-item-content">
                                  <span className="notif-item-title">{t.title || t.name || t.subject}</span>
                                  {due && (
                                    <span className={`notif-item-due${due.urgent ? ' notif-item-due--urgent' : ''}`}>
                                      {due.label}
                                    </span>
                                  )}
                                </div>
                                <span className="notif-item-badge notif-item-badge--study">Study</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="nav-user" aria-label="Current user">
            <div className="avatar-sm" aria-hidden="true">S</div>
            <span className="user-greeting">Student</span>
          </div>
        </div>
      </header>

      {/* Global Toast Notification */}
      {toast && (
        <div
          className={`toast-notification toast-${toast.type}`}
          role="status"
          aria-live="polite"
        >
          <span>{toast.type === 'error' ? '⚠️' : '✅'} {toast.message}</span>
        </div>
      )}
    </>
  );
}
