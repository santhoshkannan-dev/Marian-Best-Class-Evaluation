'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';

interface IqacWorkspaceProps {
  view?: 'dashboard' | 'reports' | 'remarks';
}

interface DepartmentInfo {
  id: string;
  name: string;
  classesCount: number;
  scoredRatio: string;
  progressPercent: number;
}

interface ClassReport {
  className: string;
  totalScore: number;
  normalized: number;
  percentile: number;
  grade: string;
}

interface InstitutionalRemark {
  id: number;
  target: string;
  text: string;
  timestamp: string;
}

export const IqacWorkspace: React.FC<IqacWorkspaceProps> = ({ view }) => {
  const { activePage } = useApp();
  const activeTab = view || activePage || 'dashboard';

  // ----------------------------------------------------
  // DATASETS (MATCHING THE SCREENSHOTS)
  // ----------------------------------------------------
  const initialDepartments: DepartmentInfo[] = [
    { id: '1', name: 'Administration', classesCount: 0, scoredRatio: '0 / 1 scored', progressPercent: 0 },
    { id: '2', name: 'Business Administration', classesCount: 2, scoredRatio: '92 / 401 scored', progressPercent: 23 },
    { id: '3', name: 'Commerce', classesCount: 3, scoredRatio: '156 / 658 scored', progressPercent: 24 },
    { id: '4', name: 'Computer Applications', classesCount: 1, scoredRatio: '48 / 208 scored', progressPercent: 23 },
    { id: '5', name: 'Computer Science', classesCount: 2, scoredRatio: '114 / 467 scored', progressPercent: 24 },
    { id: '6', name: 'Economics', classesCount: 1, scoredRatio: '46 / 197 scored', progressPercent: 23 },
    { id: '7', name: 'English', classesCount: 3, scoredRatio: '103 / 425 scored', progressPercent: 24 },
    { id: '8', name: 'Evaluation Cell', classesCount: 0, scoredRatio: '0 / 1 scored', progressPercent: 0 },
    { id: '9', name: 'IQAC', classesCount: 0, scoredRatio: '0 / 1 scored', progressPercent: 0 },
    { id: '10', name: 'Mathematics', classesCount: 2, scoredRatio: '92 / 401 scored', progressPercent: 23 }
  ];

  const initialClassReports: ClassReport[] = [
    { className: 'BSc CS B', totalScore: 1272.0, normalized: 100.0, percentile: 100.0, grade: 'A+' },
    { className: 'BCom C', totalScore: 978.0, normalized: 92.4, percentile: 93.3, grade: 'A+' },
    { className: 'BSc CS A', totalScore: 966.0, normalized: 99.5, percentile: 86.7, grade: 'A+' },
    { className: 'BA English B', totalScore: 930.0, normalized: 100.0, percentile: 80.0, grade: 'A+' },
    { className: 'BA English A', totalScore: 876.0, normalized: 100.0, percentile: 73.3, grade: 'A+' },
    { className: 'BBA B', totalScore: 850.0, normalized: 100.0, percentile: 66.7, grade: 'A+' },
    { className: 'BSc Physics A', totalScore: 754.0, normalized: 100.0, percentile: 60.0, grade: 'A+' },
    { className: 'BA Economics A', totalScore: 750.0, normalized: 100.0, percentile: 53.3, grade: 'A+' },
    { className: 'BBA A', totalScore: 730.0, normalized: 91.3, percentile: 46.7, grade: 'A+' },
    { className: 'BSc Math A', totalScore: 684.0, normalized: 100.0, percentile: 40.0, grade: 'A+' },
    { className: 'BCom B', totalScore: 597.0, normalized: 97.4, percentile: 33.3, grade: 'A+' },
    { className: 'BCA A', totalScore: 572.0, normalized: 100.0, percentile: 26.7, grade: 'A+' }
  ];

  // ----------------------------------------------------
  // STATE DEFINITIONS
  // ----------------------------------------------------
  // Dashboard Search & Pagination
  const [deptSearch, setDeptSearch] = useState('');
  const [deptPage, setDeptPage] = useState(1);
  const deptPageSize = 5;

  // Feedback State
  const [feedbackClass, setFeedbackClass] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [classFeedbacks, setClassFeedbacks] = useState<Record<string, string>>({});

  // Remarks Form State
  const [remarksTarget, setRemarksTarget] = useState('Institution Summary');
  const [remarksText, setRemarksText] = useState('');
  const [remarksHistory, setRemarksHistory] = useState<InstitutionalRemark[]>([]);

  // ----------------------------------------------------
  // CALCULATIONS & HANDLERS
  // ----------------------------------------------------
  // Dashboard Search Filter
  const filteredDepts = initialDepartments.filter((dept) =>
    dept.name.toLowerCase().includes(deptSearch.toLowerCase())
  );

  const totalDeptPages = Math.ceil(filteredDepts.length / deptPageSize) || 1;
  const paginatedDepts = filteredDepts.slice(
    (deptPage - 1) * deptPageSize,
    deptPage * deptPageSize
  );

  // Submit Remarks
  const handleRemarksSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarksText.trim()) return;

    const newRemark: InstitutionalRemark = {
      id: Date.now(),
      target: remarksTarget,
      text: remarksText,
      timestamp: new Date().toLocaleString()
    };

    setRemarksHistory((prev) => [newRemark, ...prev]);
    setRemarksText('');
  };

  // Submit Feedback
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackClass || !feedbackText.trim()) return;

    setClassFeedbacks((prev) => ({
      ...prev,
      [feedbackClass]: feedbackText
    }));

    setFeedbackClass(null);
    setFeedbackText('');
  };

  return (
    <div style={{ position: 'relative', minHeight: '85vh', padding: '10px 0' }}>
      {/* Slightly Blurred Marian Background Image Overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: 'url("/Assets/Images/Marian_College_Kuttikkanam.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.05,
          filter: 'blur(6px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* ---------------------------------------------------- */}
        {/* TAB 1: INSTITUTION MONITORING                        */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Institution Monitoring</h1>
            </div>

            {/* Department Performance Panel */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Departments Across Institution</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => alert('Exporting to CSV...')}>Export CSV</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => alert('Exporting to PDF...')}>Export PDF</button>
                </div>
              </div>

              {/* Search Box */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Search department</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Search department"
                  value={deptSearch}
                  onChange={(e) => {
                    setDeptSearch(e.target.value);
                    setDeptPage(1);
                  }}
                />
              </div>

              {/* Department Progress List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {paginatedDepts.map((dept) => (
                  <div
                    key={dept.id}
                    className="card"
                    style={{
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: 'none',
                      border: '1.5px solid var(--glass-border)',
                      borderRadius: '12px'
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>{dept.name}</h3>
                      <p className="muted" style={{ fontSize: '0.8rem', margin: 0 }}>
                        {dept.classesCount} classes | {dept.scoredRatio}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '220px' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, minWidth: '32px', textAlign: 'right' }}>
                        {dept.progressPercent}%
                      </span>
                      <div style={{ flex: 1, height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${dept.progressPercent}%`,
                            background: dept.progressPercent > 0 ? '#10b981' : '#e2e8f0',
                            borderRadius: '4px'
                          }}
                        />
                      </div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer' }}>&rsaquo;</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="pagination-container">
                <button
                  className="pagination-btn"
                  disabled={deptPage <= 1}
                  onClick={() => setDeptPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </button>
                {Array.from({ length: totalDeptPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`pagination-num ${deptPage === pageNum ? 'active' : ''}`}
                    onClick={() => setDeptPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  className="pagination-btn"
                  disabled={deptPage >= totalDeptPages}
                  onClick={() => setDeptPage((p) => Math.min(totalDeptPages, p + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: REPORTS & FEEDBACK                           */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'reports' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Reports & Feedback</h1>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary" onClick={() => alert('Exporting to CSV...')}>Export CSV</button>
                <button className="btn btn-secondary" onClick={() => alert('Exporting to PDF...')}>Export PDF</button>
              </div>
            </div>

            {/* Class Leaderboard Stack */}
            <div className="card">
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Class Leaderboard</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {initialClassReports.slice(0, 5).map((report, idx) => (
                  <div
                    key={report.className}
                    className="card"
                    style={{
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1.5px solid var(--glass-border)',
                      boxShadow: 'none',
                      borderRadius: '14px',
                      background: idx === 0 ? '#fefcbf' : idx === 1 ? '#f7fafc' : '#ffffff'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '1.2rem' }}>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}</span>
                      <div>
                        <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{report.className}</span>
                        <span className="badge badge-verified" style={{ marginLeft: '8px', fontSize: '0.72rem' }}>{report.grade}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700 }}>Total: {report.totalScore.toFixed(1)}</div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Normalized: {report.normalized.toFixed(1)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Class-wise Progress & Feedback Table */}
            <div className="card">
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Class-wise Progress & Feedback</h2>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Class</th>
                      <th>Total Score</th>
                      <th>Normalized</th>
                      <th>Percentile</th>
                      <th>Grade</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {initialClassReports.map((report) => (
                      <tr key={report.className}>
                        <td style={{ fontWeight: 700 }}>{report.className}</td>
                        <td>{report.totalScore.toFixed(1)}</td>
                        <td>{report.normalized.toFixed(1)}</td>
                        <td>{report.percentile.toFixed(1)}</td>
                        <td>
                          <span className="badge badge-verified">{report.grade}</span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => {
                              setFeedbackClass(report.className);
                              setFeedbackText(classFeedbacks[report.className] || '');
                            }}
                          >
                            Provide Feedback
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Provide Feedback Dialog overlay */}
            {feedbackClass && (
              <div className="card" style={{ border: '1.5px solid var(--primary)', background: '#ffffff', marginTop: '16px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '12px' }}>Provide Feedback for {feedbackClass}</h3>
                <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Feedback</label>
                    <textarea
                      className="textarea"
                      placeholder="Write class review feedback..."
                      rows={4}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="submit" className="btn btn-primary btn-sm">Save Feedback</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setFeedbackClass(null)}>Cancel</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: REMARKS                                      */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'remarks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Institutional Remarks</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '24px', alignItems: 'flex-start' }}>
              {/* Submit Remarks Form */}
              <div className="card">
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px' }}>Submit Remarks</h2>
                <form onSubmit={handleRemarksSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Target</label>
                    <select
                      className="select"
                      value={remarksTarget}
                      onChange={(e) => setRemarksTarget(e.target.value)}
                    >
                      <option value="Institution Summary">Institution Summary</option>
                      <option value="BSc CS A">BSc CS A</option>
                      <option value="BSc CS B">BSc CS B</option>
                      <option value="BCom C">BCom C</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Remarks</label>
                    <textarea
                      className="textarea"
                      placeholder="Summarize institutional observations..."
                      rows={5}
                      value={remarksText}
                      onChange={(e) => setRemarksText(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ background: '#f97316' }}>
                    Submit Remarks
                  </button>
                </form>
              </div>

              {/* Remarks History */}
              <div className="card">
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px' }}>Remarks History</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {remarksHistory.map((rem) => (
                    <div
                      key={rem.id}
                      style={{
                        padding: '14px',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '10px',
                        background: '#f8fafc'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span className="badge badge-submitted">{rem.target}</span>
                        <span className="muted" style={{ fontSize: '0.78rem' }}>{rem.timestamp}</span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0 }}>{rem.text}</p>
                    </div>
                  ))}
                  {remarksHistory.length === 0 && (
                    <p className="muted" style={{ fontSize: '0.88rem' }}>No remarks submitted yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
