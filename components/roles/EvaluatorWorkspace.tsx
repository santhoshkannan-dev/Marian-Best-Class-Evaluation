'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

export const EvaluatorWorkspace: React.FC = () => {
  const { submissions, updateSubmission, criteriaCatalog } = useApp();

  const getMarksForCriteria = (criteriaId: number) => {
    for (const cat of criteriaCatalog) {
      const found = cat.items.find((i) => i.id === criteriaId);
      if (found) return found.marks;
    }
    return 10;
  };

  const handleEvaluate = (id: number, criteriaId: number) => {
    const marks = getMarksForCriteria(criteriaId);
    updateSubmission(id, {
      status: 'Approved',
      evaluatorVerified: true,
      marks,
      remarks: `Evaluated & Marks Assigned: ${marks}`
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{submissions.filter((s) => s.evaluatorVerified).length}</span>
          <span className="stat-label">Evaluated Records</span>
        </div>
        <div className="stat-card">
          <span className="stat-value" style={{ color: 'var(--color-warning)' }}>
            {submissions.filter((s) => !s.evaluatorVerified).length}
          </span>
          <span className="stat-label">Pending Evaluation</span>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Evaluation Queue</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student ID</th>
                <th>Description</th>
                <th>Assigned Marks</th>
                <th>Evaluator Verified</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub.id}>
                  <td>#{sub.id}</td>
                  <td>Student #{sub.studentId}</td>
                  <td>{sub.description}</td>
                  <td>{sub.marks !== null ? `${sub.marks} pts` : 'Not Set'}</td>
                  <td>
                    {sub.evaluatorVerified ? (
                      <span className="badge badge-verified">Verified</span>
                    ) : (
                      <span className="badge badge-draft">Pending</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleEvaluate(sub.id, sub.criteriaId)}
                    >
                      Verify & Save Marks
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
