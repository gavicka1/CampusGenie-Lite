import React from 'react';

export default function StatCard({ title, value, icon, color = 'blue', subtitle }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-card-header">
        <span className="stat-title">{title}</span>
        <div className="stat-icon">{icon}</div>
      </div>
      <div className="stat-card-body">
        <h3 className="stat-value">{value}</h3>
        {subtitle && <span className="stat-subtitle">{subtitle}</span>}
      </div>
    </div>
  );
}
