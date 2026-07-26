'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

export const HodWorkspace: React.FC = () => {
  const { students, submissions } = useApp();

  const totalPoints = submissions
    .filter((s) => s.status === 'Approved' && s.marks)
    .reduce((sum, s) => sum + (s.marks || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{students.length}</span>
          <span className="stat-label">Department Students</span>
        </div>
        <div className="stat-card">
          <span className="stat-value" style={{ color: 'var(--primary)' }}>
            {totalPoints} pts
          </span>
          <span className="stat-label">Total Score Accumulated</span>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Department Activity Overview</h2>
        <p style={{ color: 'var(--color-text-soft)', marginBottom: '16px' }}>
          Monitoring real-time submission statistics for Computer Science department classes.
        </p>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Enrolled Students</th>
                <th>Submissions</th>
                <th>Approved</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>BSc CS A</td>
                <td>36</td>
                <td>{submissions.length}</td>
                <td>{submissions.filter((s) => s.status === 'Approved').length}</td>
              </tr>
              <tr>
                <td>BSc CS B</td>
                <td>34</td>
                <td>12</td>
                <td>10</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
