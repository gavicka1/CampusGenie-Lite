import React from 'react';
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

  const pendingCount =
    assignments.filter((a) => a.status === 'Pending').length +
    studyTasks.filter((t) => t.status === 'Pending').length;

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

          <button
            className="icon-btn"
            aria-label={`${pendingCount} pending item${pendingCount !== 1 ? 's' : ''}`}
            title={`${pendingCount} pending item${pendingCount !== 1 ? 's' : ''}`}
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
