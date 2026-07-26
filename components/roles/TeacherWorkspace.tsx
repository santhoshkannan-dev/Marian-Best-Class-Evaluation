'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Student, Submission } from '@/data/initialData';

interface TeacherWorkspaceProps {
  view?: 'dashboard' | 'verification' | 'student-management';
}

export const TeacherWorkspace: React.FC<TeacherWorkspaceProps> = ({ view }) => {
  const router = useRouter();
  const {
    submissions,
    updateSubmission,
    students,
    addStudent,
    deleteStudent,
    activePage,
    setActivePage
  } = useApp();

  const activeTab = view || activePage || 'dashboard';

  // ----------------------------------------------------
  // STATE DEFINITIONS
  // ----------------------------------------------------
  // Verification Desk Search & Filter
  const [studentSearch, setStudentSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [verificationPage, setVerificationPage] = useState(1);
  const verificationPageSize = 5;

  // Student Management Form States
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPass, setNewStudentPass] = useState('');
  const [studentManagementPage, setStudentManagementPage] = useState(1);
  const studentPageSize = 5;

  // CSV Bulk Upload
  const [csvFile, setCsvFile] = useState<string>('');

  // ----------------------------------------------------
  // CALCULATIONS FOR DASHBOARD
  // ----------------------------------------------------
  const totalSubmissionsCount = submissions.length;
  const verifiedCount = submissions.filter((s) => ['Approved', 'Verified', 'Evaluated', 'Locked'].includes(s.status)).length;
  const pendingCount = submissions.filter((s) => s.status === 'Pending').length;
  const totalScoreVal = 966.0;
  const targetScoreVal = 971.0;
  const progressPercent = ((totalScoreVal / targetScoreVal) * 100).toFixed(1);

  // Student list performance stats calculation
  const getStudentStats = (studentId: number) => {
    const studentSubs = submissions.filter((s) => s.studentId === studentId);
    const verified = studentSubs.filter((s) => ['Approved', 'Verified', 'Evaluated', 'Locked'].includes(s.status)).length;
    const total = studentSubs.length;
    const pending = studentSubs.filter((s) => s.status === 'Pending').length;
    
    let percent = 0;
    if (total > 0) {
      percent = Math.round((verified / total) * 100);
    }
    
    return { verified, total, pending, percent };
  };

  // Recent Student Progress (Top 5 students sorted by progress/pending status)
  const recentProgressStudents = students.slice(0, 5).map((s) => {
    const stats = getStudentStats(s.id);
    return {
      ...s,
      stats
    };
  });

  // ----------------------------------------------------
  // FILTERED STUDENT LIST FOR VERIFICATION DESK
  // ----------------------------------------------------
  const filteredStudents = students.filter((student) => {
    const stats = getStudentStats(student.id);
    const studentEmail = student.name.toLowerCase().replace(/\s+/g, '.') + '@college.edu';
    const matchesSearch =
      student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      studentEmail.toLowerCase().includes(studentSearch.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && stats.pending > 0) ||
      (statusFilter === 'completed' && stats.pending === 0 && stats.verified > 0);

    return matchesSearch && matchesStatus;
  });

  // Paginated students for verification desk
  const totalVerificationPages = Math.ceil(filteredStudents.length / verificationPageSize) || 1;
  const paginatedVerificationStudents = filteredStudents.slice(
    (verificationPage - 1) * verificationPageSize,
    verificationPage * verificationPageSize
  );

  // ----------------------------------------------------
  // SUBMISSIONS REVIEW ACTIONS FOR A STUDENT
  // ----------------------------------------------------
  const selectedStudentSubmissions = selectedStudent
    ? submissions.filter((s) => s.studentId === selectedStudent.id)
    : [];

  const handleVerifySubmission = (subId: number, status: 'Approved' | 'Rejected' | 'Correction Requested') => {
    updateSubmission(subId, {
      status,
      remarks: status === 'Approved' ? 'Teacher Verified' : 'Correction Required by Teacher'
    });
  };

  // ----------------------------------------------------
  // STUDENT MANAGEMENT CALCS
  // ----------------------------------------------------
  const totalStudentPages = Math.ceil(students.length / studentPageSize) || 1;
  const paginatedStudents = students.slice(
    (studentManagementPage - 1) * studentPageSize,
    studentManagementPage * studentPageSize
  );

  const handleManualAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentEmail.trim() || !newStudentPass.trim()) return;

    addStudent({
      name: newStudentName,
      className: 'BSc CS A'
    });

    setNewStudentName('');
    setNewStudentEmail('');
    setNewStudentPass('');
  };

  const handleCSVUpload = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate parsing and uploading
    alert('Simulated Import: 3 students parsed from CSV and added successfully!');
    addStudent({ name: 'Bhavya Sharma', className: 'BSc CS A' });
    addStudent({ name: 'Chitra Sharma', className: 'BSc CS A' });
  };

  const getStatusBadgeClass = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('approved') || s.includes('verified') || s.includes('locked')) {
      return 'badge-verified';
    }
    if (s.includes('pending') || s.includes('submitted')) {
      return 'badge-submitted';
    }
    if (s.includes('correction')) {
      return 'badge-correction';
    }
    if (s.includes('rejected')) {
      return 'badge-rejected';
    }
    return 'badge-draft';
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
        {/* TAB 1: TEACHER DASHBOARD                            */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Teacher Dashboard</h1>
              <p className="muted" style={{ fontSize: '0.88rem' }}>Class Performance: BSc CS A</p>
            </div>

            {/* KPI Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <div className="card" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="muted" style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Submissions</span>
                  <span style={{ fontSize: '1.3rem' }}>📊</span>
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: 'var(--text-main)' }}>{totalSubmissionsCount}</h2>
              </div>

              <div className="card" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="muted" style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>Verified</span>
                  <span style={{ fontSize: '1.3rem', color: '#15803d' }}>✓</span>
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: 'var(--text-main)' }}>{verifiedCount}</h2>
              </div>

              <div className="card" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="muted" style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>Pending</span>
                  <span style={{ fontSize: '1.3rem', color: '#a16207' }}>⏳</span>
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: 'var(--text-main)' }}>{pendingCount}</h2>
              </div>

              <div className="card" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="muted" style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Score</span>
                  <span style={{ fontSize: '1.3rem' }}>📝</span>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-main)' }}>Score: {totalScoreVal} / {targetScoreVal}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{progressPercent}% completed</div>
                  <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', marginTop: '6px' }}>
                    <div style={{ height: '100%', width: `${progressPercent}%`, background: '#22c55e', borderRadius: '3px' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Student Progress Card */}
            <div className="card">
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Recent Student Progress</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                {recentProgressStudents.map((s) => {
                  return (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--glass-border)' }}>
                      <div>
                        <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-main)' }}>{s.name}</h3>
                        <p style={{ fontSize: '0.8rem', color: '#ea580c', fontWeight: 700, margin: 0 }}>Pending</p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '200px' }}>
                        <div style={{ flex: 1, height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${s.stats.percent}%`, background: 'var(--primary)', borderRadius: '4px' }} />
                        </div>
                        <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', minWidth: '36px', textAlign: 'right' }}>
                          {s.stats.percent}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                className="btn btn-primary"
                style={{ background: '#ea580c', border: 'none', color: '#ffffff', padding: '12px 24px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={() => {
                  setActivePage('verification');
                  router.push('/teacher/verification');
                }}
              >
                ✓ Open Class Verification Desk
              </button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: VERIFICATION DESK                            */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'verification' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Verification Desk</h1>
              <p className="muted" style={{ fontSize: '0.88rem' }}>Manage and verify submissions per student for BSc CS A</p>
            </div>

            {/* Filter Section */}
            <div className="card" style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Search Students</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Search name..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Filter Status</label>
                <select
                  className="select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Student Table */}
            <div className="card">
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Progress</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedVerificationStudents.map((stud) => {
                      const stats = getStudentStats(stud.id);
                      const studentEmail = stud.name.toLowerCase().replace(/\s+/g, '.') + '@college.edu';
                      return (
                        <tr key={stud.id}>
                          <td style={{ fontWeight: 700 }}>{stud.name}</td>
                          <td>{studentEmail}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '200px' }}>
                              <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${stats.percent}%`, background: '#22c55e', borderRadius: '3px' }} />
                              </div>
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', minWidth: '60px' }}>
                                {stats.verified} / {stats.total} verified
                              </span>
                            </div>
                          </td>
                          <td>
                            {stats.pending > 0 ? (
                              <span className="badge badge-submitted">Pending</span>
                            ) : (
                              <span className="badge badge-verified">Completed</span>
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => setSelectedStudent(stud)}
                            >
                              Review Submissions
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="pagination-container">
                <button
                  className="pagination-btn"
                  disabled={verificationPage <= 1}
                  onClick={() => setVerificationPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </button>
                {Array.from({ length: totalVerificationPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`pagination-num ${verificationPage === pageNum ? 'active' : ''}`}
                    onClick={() => setVerificationPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  className="pagination-btn"
                  disabled={verificationPage >= totalVerificationPages}
                  onClick={() => setVerificationPage((p) => Math.min(totalVerificationPages, p + 1))}
                >
                  Next
                </button>
              </div>
            </div>

            {/* Individual Student Review Detail Panel overlay/section */}
            {selectedStudent && (
              <div className="card" style={{ border: '1.5px solid var(--primary)', background: '#ffffff', marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Reviewing: {selectedStudent.name}</h2>
                    <p className="muted" style={{ fontSize: '0.84rem' }}>{selectedStudent.name.toLowerCase().replace(/\s+/g, '.') + '@college.edu'}</p>
                  </div>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedStudent(null)}
                  >
                    Close Review
                  </button>
                </div>

                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Proof File</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudentSubmissions.map((sub) => (
                        <tr key={sub.id}>
                          <td>{sub.description}</td>
                          <td>
                            <a href={`/Assets/Proofs/${sub.proof}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                              {sub.proof}
                            </a>
                          </td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(sub.status)}`}>
                              {sub.status}
                            </span>
                          </td>
                          <td style={{ display: 'flex', gap: '6px' }}>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleVerifySubmission(sub.id, 'Approved')}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => handleVerifySubmission(sub.id, 'Correction Requested')}
                            >
                              Correction
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleVerifySubmission(sub.id, 'Rejected')}
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                      {selectedStudentSubmissions.length === 0 && (
                        <tr>
                          <td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                            No submissions found for this student.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: STUDENT MANAGEMENT                           */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'student-management' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Student Management</h1>
              <p className="muted" style={{ fontSize: '0.88rem' }}>View class list, add new students manually, or import from CSV files.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', alignItems: 'flex-start' }}>
              {/* Left Class List Card */}
              <div className="card">
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Class List</h2>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedStudents.map((s) => {
                        const studentEmail = s.name.toLowerCase().replace(/\s+/g, '.') + '@college.edu';
                        const studentDept = s.className.includes('CS') ? 'Computer Science' : 'Commerce';
                        return (
                          <tr key={s.id}>
                            <td style={{ fontWeight: 700 }}>{s.name}</td>
                            <td>{studentEmail}</td>
                            <td>{studentDept}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => deleteStudent(s.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Student List Pagination */}
                <div className="pagination-container">
                  <button
                    className="pagination-btn"
                    disabled={studentManagementPage <= 1}
                    onClick={() => setStudentManagementPage((p) => Math.max(1, p - 1))}
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalStudentPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      className={`pagination-num ${studentManagementPage === pageNum ? 'active' : ''}`}
                      onClick={() => setStudentManagementPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    className="pagination-btn"
                    disabled={studentManagementPage >= totalStudentPages}
                    onClick={() => setStudentManagementPage((p) => Math.min(totalStudentPages, p + 1))}
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* Right Manual Add & Bulk CSV Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="card">
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>Manual Add Student</h3>
                  <form onSubmit={handleManualAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="Student Name"
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="input"
                        placeholder="student@college.edu"
                        value={newStudentEmail}
                        onChange={(e) => setNewStudentEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="input"
                        placeholder="Password"
                        value={newStudentPass}
                        onChange={(e) => setNewStudentPass(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn"
                      style={{ background: '#f97316', color: '#ffffff', fontWeight: 700, marginTop: '8px' }}
                    >
                      Add Student
                    </button>
                  </form>
                </div>

                <div className="card">
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>Bulk Upload Students (CSV)</h3>
                  <form onSubmit={handleCSVUpload} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">CSV File</label>
                      <input
                        type="file"
                        className="input"
                        accept=".csv"
                        onChange={(e) => setCsvFile(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-secondary" style={{ fontWeight: 700 }}>
                      Upload CSV
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
