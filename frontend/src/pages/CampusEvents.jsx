import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import EventCard from '../components/EventCard';

export default function CampusEvents() {
  const { events, loading, error, refreshData, searchQuery } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Derive categories dynamically from live data instead of a hardcoded array
  const categories = useMemo(() => {
    const unique = [...new Set(events.map((e) => e.category).filter(Boolean))].sort();
    return ['All', ...unique];
  }, [events]);

  const filteredEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return events.filter((e) => {
      const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
      const matchesSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        (e.description && e.description.toLowerCase().includes(q)) ||
        (e.location && e.location.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [events, selectedCategory, searchQuery]);

  const registeredCount = useMemo(() => events.filter((e) => e.registered).length, [events]);

  if (loading) {
    return (
      <div className="page-container" aria-busy="true" aria-label="Loading campus events">
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

      {/* Filters & Registration Summary */}
      <div className="page-actions-bar">
        <div className="tab-filters" role="group" aria-label="Event category filter">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-chip${selectedCategory === cat ? ' active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
              aria-pressed={selectedCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="registered-summary" aria-live="polite">
          <span>
            Registered for <strong>{registeredCount}</strong> event{registeredCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Results count when searching */}
      {searchQuery.trim() && (
        <p className="results-count" aria-live="polite">
          {filteredEvents.length} result{filteredEvents.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid-responsive">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">
            {searchQuery ? '🔍' : '🗓'}
          </span>
          <p>
            {searchQuery
              ? `No events match "${searchQuery}".`
              : `No events found${selectedCategory !== 'All' ? ` for category "${selectedCategory}"` : ''}.`}
          </p>
          {selectedCategory !== 'All' && (
            <button className="btn-secondary" onClick={() => setSelectedCategory('All')}>
              Show All Events
            </button>
          )}
        </div>
      )}
    </div>
  );
}
