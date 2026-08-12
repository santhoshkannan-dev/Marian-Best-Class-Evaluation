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

import { useApp } from '@/context/AppContext';

export const EvaluatorWorkspace: React.FC<EvaluatorWorkspaceProps> = ({ view = 'dashboard' }) => {
  const router = useRouter();
  const {
    evaluationOpen,
    submissions,
    updateSubmission,
    students,
    criteriaCatalog,
    currentUserInfo
  } = useApp();

  // Submissions forwarded from Class Teacher (Round 2) awaiting Evaluator Verification (Round 3)
  const teacherApprovedSubmissions = submissions.filter((s) =>
    ['Teacher Verified', 'Approved', 'Verified'].includes(s.status) && !s.evaluatorVerified && s.status !== 'Locked' && s.status !== 'Evaluated'
  );

  const handleVerifySubmissionEvaluator = (subId: number) => {
    if (!evaluationOpen) {
      alert('Evaluation access is currently CLOSED by system administrator.');
      return;
    }

    const evaluatorName = currentUserInfo?.name || 'Dr. Allen George';
    const assignedMarksStr = prompt('Enter evaluated marks for this submission:', '10') || '10';
    const numMarks = parseFloat(assignedMarksStr) || 10;

    updateSubmission(subId, {
      status: 'Evaluated',
      evaluatorVerified: true,
      evaluatorVerifiedByName: evaluatorName,
      evaluatorRemarks: 'Verified, Evaluated, and Locked by Evaluation Team.',
      marks: numMarks
    });

    alert('Submission successfully verified, evaluated, and locked by Evaluation Team!');
  };

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

  // Rich mock student scores database for leaderboard queries
  const [studentsList, setStudentsList] = useState([
    { name: 'Santhosh Kannan', class: 'BCA A', dept: 'Computer Applications', score: 45.0, email: 'santhosh.25pmc152@mariancollege.org' },
    { name: 'Kiran Menon', class: 'BCom A', dept: 'Commerce', score: 38.0, email: 'kiran.menon@mariancollege.org' },
    { name: 'Anjali Nair', class: 'BCom A', dept: 'Commerce', score: 35.5, email: 'anjali.nair@mariancollege.org' },
    { name: 'Thomas Kurian', class: 'BSc CS B', dept: 'Computer Science', score: 42.0, email: 'thomas.kurian@mariancollege.org' },
    { name: 'Isha Menon', class: 'BSc CS B', dept: 'Computer Science', score: 39.0, email: 'isha.menon@mariancollege.org' },
    { name: 'Mary Joseph', class: 'BA English A', dept: 'English', score: 36.0, email: 'mary.joseph@mariancollege.org' },
    { name: 'Gaurav Menon', class: 'BA English A', dept: 'English', score: 33.0, email: 'gaurav.menon@mariancollege.org' },
    { name: 'Albin Sunny', class: 'BBA A', dept: 'Business Administration', score: 41.5, email: 'albin.sunny@mariancollege.org' },
    { name: 'Merlin Joy', class: 'BBA A', dept: 'Business Administration', score: 37.0, email: 'merlin.joy@mariancollege.org' }
  ]);

  // Rich mock class scores database for best class rank
  const [classesList, setClassesList] = useState([
    { name: 'BCA A', dept: 'Computer Applications', score: 1245.0, mentor: 'Dr. Allen George' },
    { name: 'BCom A', dept: 'Commerce', score: 1120.0, mentor: 'Prof. Kochumol Abraham' },
    { name: 'BSc CS B', dept: 'Computer Science', score: 980.5, mentor: 'Dr. Sijomon P.' },
    { name: 'BBA A', dept: 'Business Administration', score: 850.0, mentor: 'Prof. Joy Mathew' },
    { name: 'BA English A', dept: 'English', score: 790.0, mentor: 'Dr. Mary George' }
  ]);

  const [lookupType, setLookupType] = useState<'department' | 'class'>('department');
  const [selectedLookupGroup, setSelectedLookupGroup] = useState<string>('Computer Applications');

  const getTopStudent = () => {
    const filtered = studentsList.filter(s => 
      lookupType === 'department' ? s.dept === selectedLookupGroup : s.class === selectedLookupGroup
    );
    if (filtered.length === 0) return null;
    return filtered.reduce((prev, current) => (prev.score > current.score) ? prev : current);
  };

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
    if (!evaluationOpen) {
      alert('Evaluation access is currently CLOSED by system administrator.');
      return;
    }

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

    // 5. Update student and class live scores
    setStudentsList((prev) =>
      prev.map((s) => (s.name === studentName ? { ...s, score: s.score + marks } : s))
    );
    const matchedStudent = studentsList.find((s) => s.name === studentName);
    if (matchedStudent) {
      setClassesList((prev) =>
        prev.map((c) => (c.name === matchedStudent.class ? { ...c, score: c.score + marks } : c))
      );
    }

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

          {/* EVALUATOR DETAILS & LEADERS LOOKUP GRID */}
          <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* EVALUATOR DETAILS CARD */}
            <div className="card" style={{ background: '#ffffff', border: '1.5px solid var(--glass-border)', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '1.3rem', fontWeight: 'bold' }}>
                  AG
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>Allen George</h3>
                  <p className="muted" style={{ fontSize: '0.8rem', margin: 0 }}>Senior Evaluator | System Auditor</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Employee ID:</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>MCE-4910</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Scope Access:</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>All Departments & Classes</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Assigned Domain:</span>
                  <span style={{ fontWeight: 700, color: '#3b82f6' }}>Co- & Extracurricular Evaluation</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Last Database Audit:</span>
                  <span style={{ fontWeight: 700, color: '#16a34a' }}>Just now (Synced)</span>
                </div>
              </div>
            </div>

            {/* LEADERBOARD & LOOKUP CARD */}
            <div className="card" style={{ background: '#ffffff', border: '1.5px solid var(--glass-border)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>Performers Leaderboard</h3>
                  <span style={{ padding: '4px 10px', background: '#fef3c7', color: '#d97706', borderRadius: '12px', fontSize: '0.74rem', fontWeight: 800 }}>🏆 Live Standings</span>
                </div>

                {/* Top Class overall */}
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', display: 'block', textTransform: 'uppercase' }}>Top Performing Class</span>
                    <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#1e293b' }}>{classesList.reduce((prev, current) => (prev.score > current.score) ? prev : current).name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary)' }}>{classesList.reduce((prev, current) => (prev.score > current.score) ? prev : current).score.toFixed(1)} pts</span>
                  </div>
                </div>

                {/* Top Student Lookup Panel */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', display: 'block', textTransform: 'uppercase', marginBottom: '8px' }}>Top Student Lookup</span>
                  
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <select 
                      className="select" 
                      style={{ padding: '6px 8px', fontSize: '0.8rem', flex: 1 }}
                      value={lookupType}
                      onChange={(e) => {
                        const val = e.target.value as 'department' | 'class';
                        setLookupType(val);
                        setSelectedLookupGroup(val === 'department' ? 'Computer Applications' : 'BCA A');
                      }}
                    >
                      <option value="department">Department-wise</option>
                      <option value="class">Class-wise</option>
                    </select>

                    <select 
                      className="select" 
                      style={{ padding: '6px 8px', fontSize: '0.8rem', flex: 1.5 }}
                      value={selectedLookupGroup}
                      onChange={(e) => setSelectedLookupGroup(e.target.value)}
                    >
                      {lookupType === 'department' ? (
                        <>
                          <option value="Computer Applications">Computer Applications</option>
                          <option value="Commerce">Commerce</option>
                          <option value="Computer Science">Computer Science</option>
                          <option value="English">English</option>
                          <option value="Business Administration">Business Administration</option>
                        </>
                      ) : (
                        <>
                          <option value="BCA A">BCA A</option>
                          <option value="BCom A">BCom A</option>
                          <option value="BSc CS B">BSc CS B</option>
                          <option value="BBA A">BBA A</option>
                          <option value="BA English A">BA English A</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* Lookup Result Display */}
              <div>
                {getTopStudent() ? (
                  <div style={{ background: '#f0fdf4', padding: '10px 14px', borderRadius: '8px', border: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#16a34a' }}>⭐ {getTopStudent()?.name}</span>
                      <span style={{ fontSize: '0.74rem', color: '#667085', display: 'block' }}>{getTopStudent()?.class} ({getTopStudent()?.dept})</span>
                    </div>
                    <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#15803d' }}>{getTopStudent()?.score.toFixed(1)} pts</span>
                  </div>
                ) : (
                  <div style={{ background: '#fef2f2', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fecaca', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#991b1b' }}>No students found in this group selection.</span>
                  </div>
                )}
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
                          {/* Live Submissions Forwarded from Class Teacher (Round 2) */}
                          {teacherApprovedSubmissions.map((sub) => {
                            const studentObj = students.find((s) => s.id === sub.studentId);
                            const itemObj = criteriaCatalog.flatMap((c) => c.items).find((i) => i.id === sub.criteriaId);
                            const catObj = criteriaCatalog.find((c) => c.items.some((i) => i.id === sub.criteriaId));
                            const isDriveUrl = sub.proof?.startsWith('http://') || sub.proof?.startsWith('https://');

                            return (
                              <div key={`live-sub-${sub.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '14px 18px', border: '1.5px solid #6366f1', borderRadius: '10px', boxShadow: '0 2px 8px rgba(99, 102, 241, 0.08)' }}>
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <h5 style={{ fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                                      {studentObj ? studentObj.name : `Student #${sub.studentId}`}
                                    </h5>
                                    <span className="badge badge-verified" style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', fontSize: '0.72rem', fontWeight: 800 }}>
                                      ✓ Approved by Class Advisor ({sub.teacherVerifiedByName || 'Teacher'})
                                    </span>
                                  </div>
                                  <p className="muted" style={{ fontSize: '0.8rem', margin: 0 }}>
                                    Category: {catObj?.category || 'General'} | Item: {itemObj?.title || sub.description}
                                  </p>
                                  {sub.proof && (
                                    <div style={{ fontSize: '0.76rem', marginTop: '4px' }}>
                                      Proof: <a href={isDriveUrl ? sub.proof : `/Assets/Proofs/${sub.proof}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 700 }}>{sub.proof}</a>
                                    </div>
                                  )}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                  <button
                                    className="btn btn-sm btn-primary"
                                    style={{ background: '#4f46e5', color: '#ffffff', fontWeight: 800 }}
                                    onClick={() => handleVerifySubmissionEvaluator(sub.id)}
                                  >
                                    Verify & Lock (Round 3)
                                  </button>
                                </div>
                              </div>
                            );
                          })}

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

                          {teacherApprovedSubmissions.length === 0 && pendingItems.filter((i) => i.dept === dept.name).length === 0 && (
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
