'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface EvaluatorWorkspaceProps {
  view?: 'dashboard' | 'evaluation';
}

interface LockedSubmission {
  id: string;
  student: string;
  category: string;
  item: string;
  status: 'Locked' | 'Pending';
  marks: number;
  dept: string;
}

export const EvaluatorWorkspace: React.FC<EvaluatorWorkspaceProps> = ({ view = 'dashboard' }) => {
  const router = useRouter();

  // Local interactive state for pending list to simulate live evaluation approvals
  const [pendingItems, setPendingItems] = useState<LockedSubmission[]>([
    {
      id: 'p-1',
      student: 'Anjali Nair',
      category: 'Social Responsibility',
      item: 'Community Outreach Activity',
      status: 'Pending',
      marks: 3.0,
      dept: 'Commerce'
    },
    {
      id: 'p-2',
      student: 'Thomas Kurian',
      category: 'Research',
      item: 'Research Publication',
      status: 'Pending',
      marks: 15.0,
      dept: 'Computer Science'
    },
    {
      id: 'p-3',
      student: 'Mary Joseph',
      category: 'Leadership',
      item: 'Class Representative',
      status: 'Pending',
      marks: 10.0,
      dept: 'English'
    }
  ]);

  const [verifiedCount, setVerifiedCount] = useState(694);
  const [pendingCount, setPendingCount] = useState(3);
  const [totalScore, setTotalScore] = useState(10872.0);

  // List of initial verified submissions for display in Dashboard table
  const [lockedList, setLockedList] = useState<LockedSubmission[]>([
    { id: '1', student: 'Kiran Menon', category: 'Social Responsibility', item: 'NSS/NCC/Service Activity Participation', status: 'Locked', marks: 5.0, dept: 'Commerce' },
    { id: '2', student: 'Kiran Menon', category: 'Leadership', item: 'Event Coordinator Role', status: 'Locked', marks: 10.0, dept: 'Commerce' },
    { id: '3', student: 'Isha Menon', category: 'Social Responsibility', item: 'NSS/NCC/Service Activity Participation', status: 'Locked', marks: 5.0, dept: 'Computer Science' },
    { id: '4', student: 'Isha Menon', category: 'Leadership', item: 'Event Coordinator Role', status: 'Locked', marks: 10.0, dept: 'Computer Science' },
    { id: '5', student: 'Gaurav Menon', category: 'Leadership', item: 'Event Coordinator Role', status: 'Locked', marks: 10.0, dept: 'English' }
  ]);

  // Evaluation tab active filters
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [expandedDept, setExpandedDept] = useState<string | null>(null);

  // Simulated Department verified database
  const [deptStats, setDeptStats] = useState([
    { name: 'Business Administration', total: 92, verified: 92 },
    { name: 'Commerce', total: 156, verified: 155 },
    { name: 'Computer Applications', total: 48, verified: 48 },
    { name: 'Computer Science', total: 114, verified: 113 },
    { name: 'Economics', total: 46, verified: 46 },
    { name: 'English', total: 103, verified: 102 },
    { name: 'Mathematics', total: 92, verified: 92 },
    { name: 'Physics', total: 46, verified: 46 }
  ]);

  const handleVerifyAndLock = (itemId: string, deptName: string, marks: number, studentName: string) => {
    // 1. Move to locked list
    const foundItem = pendingItems.find((i) => i.id === itemId);
    if (!foundItem) return;

    setLockedList((prev) => [
      { ...foundItem, status: 'Locked' },
      ...prev
    ]);

    // 2. Remove from pending list
    setPendingItems((prev) => prev.filter((i) => i.id !== itemId));

    // 3. Update stats
    setVerifiedCount((prev) => prev + 1);
    setPendingCount((prev) => prev - 1);
    setTotalScore((prev) => prev + marks);

    // 4. Update department progress
    setDeptStats((prev) =>
      prev.map((d) => {
        if (d.name === deptName) {
          return { ...d, verified: d.total };
        }
        return d;
      })
    );

    alert(`Successfully verified and locked submissions for ${studentName}!`);
    setExpandedDept(null);
  };

  // Filtering Departments
  const pendingDepts = deptStats.filter((d) => d.verified < d.total);
  const completedDepts = deptStats.filter((d) => d.verified === d.total);

  const activeDepts = activeTab === 'pending' ? pendingDepts : completedDepts;

  const filteredDepts = activeDepts.filter((d) => {
    const matchesDept = selectedDept === 'All Departments' || d.name === selectedDept;
    return matchesDept;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {view === 'dashboard' ? (
        <>
          {/* STATS ROW */}
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div className="stat-card" style={{ background: '#ffffff', border: '1.5px solid var(--glass-border)', padding: '20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="stat-label" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Submissions</span>
                <span className="stat-value" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>{verifiedCount + pendingCount}</span>
              </div>
              <span style={{ fontSize: '1.6rem' }}>📊</span>
            </div>

            <div className="stat-card" style={{ background: '#ffffff', border: '1.5px solid var(--glass-border)', padding: '20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="stat-label" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Verified</span>
                <span className="stat-value" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a' }}>{verifiedCount}</span>
              </div>
              <span style={{ fontSize: '1.6rem' }}>✓</span>
            </div>

            <div className="stat-card" style={{ background: '#ffffff', border: '1.5px solid var(--glass-border)', padding: '20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="stat-label" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Pending</span>
                <span className="stat-value" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d97706' }}>{pendingCount}</span>
              </div>
              <span style={{ fontSize: '1.6rem' }}>⌛</span>
            </div>

            <div className="stat-card" style={{ background: '#ffffff', border: '1.5px solid var(--glass-border)', padding: '20px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <span className="stat-label" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Score</span>
                  <span className="stat-value" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary)' }}>{totalScore.toFixed(1)} / 11138.0</span>
                </div>
                <span style={{ fontSize: '1.2rem' }}>📈</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#16a34a' }}>97.6%</span>
                <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '97.6%', height: '100%', background: '#16a34a' }} />
                </div>
              </div>
            </div>
          </div>

          {/* PROGRESS SUMMARY BOX */}
          <div className="card" style={{ padding: '24px', background: '#ffffff', border: '1.5px solid var(--glass-border)', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px' }}>Evaluation Progress</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 700, marginBottom: '4px' }}>
                  <span>Verified</span>
                  <span>{verifiedCount} | {((verifiedCount / (verifiedCount + pendingCount)) * 100).toFixed(1)}%</span>
                </div>
                <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(verifiedCount / (verifiedCount + pendingCount)) * 100}%`, height: '100%', background: '#16a34a' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 700, marginBottom: '4px' }}>
                  <span>Submitted / Draft</span>
                  <span>{pendingCount} | {((pendingCount / (verifiedCount + pendingCount)) * 100).toFixed(1)}%</span>
                </div>
                <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(pendingCount / (verifiedCount + pendingCount)) * 100}%`, height: '100%', background: '#eab308' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 700, marginBottom: '4px', color: '#94a3b8' }}>
                  <span>Rejected</span>
                  <span>0 | 0.0%</span>
                </div>
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px' }} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 700, marginBottom: '4px', color: '#94a3b8' }}>
                  <span>Correction</span>
                  <span>0 | 0.0%</span>
                </div>
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px' }} />
              </div>
            </div>
          </div>

          {/* VERIFIED AND LOCKED SUBMISSIONS TABLE */}
          <div className="card" style={{ padding: '24px', background: '#ffffff', border: '1.5px solid var(--glass-border)', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px' }}>Verified and Locked Submissions</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Category</th>
                    <th>Item</th>
                    <th>Status</th>
                    <th>Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {lockedList.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 700 }}>{item.student}</td>
                      <td>{item.category}</td>
                      <td>{item.item}</td>
                      <td>
                        <span className="badge" style={{ background: '#dcfce7', color: '#16a34a', fontWeight: 700 }}>{item.status}</span>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{item.marks.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '20px' }}>
              <button
                className="btn btn-primary"
                style={{ padding: '12px 24px', borderRadius: '10px', cursor: 'pointer' }}
                onClick={() => router.push('/evaluator/evaluation')}
              >
                Open Evaluation
              </button>
            </div>
          </div>
        </>
      ) : (
        /* EVALUATION QUEUE VIEW */
        <div className="card" style={{ padding: '24px', background: '#ffffff', border: '1.5px solid var(--glass-border)', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '20px' }}>Evaluation Workspace</h2>

          {/* FILTER CONTROLS */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
            {/* PENDING / COMPLETED TABS */}
            <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
              <button
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  background: activeTab === 'pending' ? 'var(--color-primary)' : 'transparent',
                  color: activeTab === 'pending' ? '#ffffff' : '#475569'
                }}
                onClick={() => {
                  setActiveTab('pending');
                  setExpandedDept(null);
                }}
              >
                Pending
              </button>
              <button
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  background: activeTab === 'completed' ? 'var(--color-primary)' : 'transparent',
                  color: activeTab === 'completed' ? '#ffffff' : '#475569'
                }}
                onClick={() => {
                  setActiveTab('completed');
                  setExpandedDept(null);
                }}
              >
                Completed
              </button>
            </div>

            {/* SEARCH */}
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <input
                type="text"
                className="input"
                placeholder="🔍 Search student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '36px' }}
              />
            </div>

            {/* DEPT DROPDOWN */}
            <select
              className="select"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              style={{ width: '200px' }}
            >
              <option value="All Departments">All Departments</option>
              <option value="Business Administration">Business Administration</option>
              <option value="Commerce">Commerce</option>
              <option value="Computer Science">Computer Science</option>
              <option value="English">English</option>
            </select>

            {/* CLASS DROPDOWN */}
            <select
              className="select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{ width: '180px' }}
            >
              <option value="All Classes">All Classes</option>
              <option value="BCom A">BCom A</option>
              <option value="BSc CS A">BSc CS A</option>
              <option value="BA English A">BA English A</option>
            </select>
          </div>

          {/* INNER DEPARTMENT LISTING */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>Departments</h3>
              <span className="muted" style={{ fontSize: '0.84rem' }}>
                Showing 1-{filteredDepts.length} of {filteredDepts.length} records
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredDepts.map((dept) => {
                const isExpanded = expandedDept === dept.name;
                const progressPct = (dept.verified / dept.total) * 100;
                return (
                  <div key={dept.name} style={{ display: 'flex', flexDirection: 'column', border: '1.5px solid var(--glass-border)', borderRadius: '12px', background: '#ffffff', overflow: 'hidden' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        cursor: 'pointer',
                        background: '#ffffff'
                      }}
                      onClick={() => setExpandedDept(isExpanded ? null : dept.name)}
                    >
                      <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{dept.name}</span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '30%' }}>
                        <span style={{ fontSize: '0.84rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                          {dept.verified} / {dept.total} Verified
                        </span>
                        <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${progressPct}%`, height: '100%', background: '#16a34a' }} />
                        </div>
                        <span style={{ fontSize: '1rem', color: 'var(--color-primary)', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(90deg)' : 'none' }}>&rarr;</span>
                      </div>
                    </div>

                    {/* EXPANDED INNER LIST OF SUBMISSIONS */}
                    {isExpanded && (
                      <div style={{ padding: '20px', background: '#fafaf9', borderTop: '1px solid var(--glass-border)' }}>
                        <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '12px' }}>Pending Submissions in {dept.name}</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {pendingItems.filter((i) => i.dept === dept.name).map((item) => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '14px 18px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                              <div>
                                <h5 style={{ fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>{item.student}</h5>
                                <p className="muted" style={{ fontSize: '0.8rem', margin: 0 }}>
                                  Category: {item.category} | Item: {item.item}
                                </p>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-primary)' }}>{item.marks.toFixed(1)} pts</span>
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => handleVerifyAndLock(item.id, dept.name, item.marks, item.student)}
                                >
                                  Verify & Lock
                                </button>
                              </div>
                            </div>
                          ))}

                          {pendingItems.filter((i) => i.dept === dept.name).length === 0 && (
                            <p className="muted" style={{ fontSize: '0.84rem', margin: 0, textAlign: 'center' }}>No pending verification files for this department.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredDepts.length === 0 && (
                <p className="muted" style={{ textAlign: 'center', padding: '30px' }}>No departments found matching the filter specs.</p>
              )}
            </div>
          </div>

          {/* PAGINATION FOOTER */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '24px' }}>
            <button className="btn btn-secondary btn-sm" disabled style={{ opacity: 0.6 }}>Prev</button>
            <button className="btn btn-sm btn-primary">1</button>
            <button className="btn btn-secondary btn-sm" disabled style={{ opacity: 0.6 }}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
};
