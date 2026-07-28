import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function EventCard({ event }) {
  const { toggleEventRegistration } = useApp();
  const [registering, setRegistering] = useState(false);

  const handleRegister = async () => {
    if (registering) return;
    setRegistering(true);
    await toggleEventRegistration(event.id);
    setRegistering(false);
  };

  return (
    <article className="card event-card" aria-label={`Event: ${event.title}`}>
      <div className="card-header">
        <span className="category-badge" aria-label={`Category: ${event.category || 'Event'}`}>
          {event.category || 'Event'}
        </span>
        <span className="event-date">
          <span aria-hidden="true">🗓</span>{' '}
          <time dateTime={event.date}>{event.date}</time>
        </span>
      </div>

      <div className="card-body">
        <h3 className="card-title">{event.title}</h3>
        <div className="location-info" aria-label={`Location: ${event.location}`}>
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{event.location}</span>
        </div>
        {event.description && (
          <p className="card-description">{event.description}</p>
        )}
      </div>

      <div className="card-footer">
        <button
          className={`btn-register${event.registered ? ' btn-registered' : ''}`}
          onClick={handleRegister}
          disabled={registering}
          aria-label={event.registered ? `Unregister from ${event.title}` : `Register for ${event.title}`}
          aria-pressed={event.registered}
        >
          {registering ? (
            <>
              <span className="inline-spinner" aria-label="Processing…" />
              Processing…
            </>
          ) : event.registered ? (
            <>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              Registered
            </>
          ) : (
            'Register Now'
          )}
        </button>
      </div>
    </article>
  );
}
