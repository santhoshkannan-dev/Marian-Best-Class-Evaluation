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
    evaluationOpen,
    students,
    addStudent,
    deleteStudent,
    activePage,
    setActivePage,
    criteriaCatalog,
    currentUserInfo
  } = useApp();

  const activeTab = view || activePage || 'dashboard';

  // ----------------------------------------------------
  // STATE DEFINITIONS
  // ----------------------------------------------------
  // Verification Desk Search & Filter
  const [studentSearch, setStudentSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
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
  const pendingCount = submissions.filter((s) => ['Student Rep Verified', 'Pending Rep Verification', 'Pending'].includes(s.status)).length;
  const totalScoreVal = 966.0;
  const targetScoreVal = 971.0;
  const progressPercent = ((totalScoreVal / targetScoreVal) * 100).toFixed(1);

  // Student list performance stats calculation
  const getStudentStats = (studentId: number) => {
    let studentSubs = submissions.filter((s) => s.studentId === studentId);
    if (selectedCategoryFilter !== 'all') {
      studentSubs = studentSubs.filter((s) => {
        const cat = criteriaCatalog.find((c) =>
          c.items.some((i) => i.id === s.criteriaId)
        );
        return cat ? cat.category.toLowerCase().trim() === selectedCategoryFilter.toLowerCase().trim() : false;
      });
    }
    const verified = studentSubs.filter((s) => ['Approved', 'Verified', 'Evaluated', 'Locked'].includes(s.status)).length;
    const total = studentSubs.length;
    const pending = studentSubs.filter((s) => ['Student Rep Verified', 'Pending Rep Verification', 'Pending'].includes(s.status)).length;
    
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

  const pendingVerificationSubmissions = submissions.filter((s) =>
    ['Pending', 'Submitted', 'Student Rep Verified', 'Pending Rep Verification'].includes(s.status)
  );

  // Helper to check if two class names match
  const isSameClass = (c1?: string, c2?: string) => {
    if (!c1 || !c2) return true;
    const norm1 = c1.toLowerCase().replace(/^(i|ii|iii|\d+)\s+/, '').trim();
    const norm2 = c2.toLowerCase().replace(/^(i|ii|iii|\d+)\s+/, '').trim();
    return norm1 === norm2 || c1.toLowerCase().trim() === c2.toLowerCase().trim();
  };

  const teacherClass = (currentUserInfo as any)?.className || (currentUserInfo as any)?.class_name || 'II MCA';

  // ----------------------------------------------------
  // FILTERED STUDENT LIST FOR VERIFICATION DESK (Filtered to Teacher's Class)
  // ----------------------------------------------------
  const filteredStudents = students.filter((student) => {
    // Ensure student belongs to the Class Advisor's class
    if (student.className && teacherClass && !isSameClass(student.className, teacherClass)) {
      return false;
    }

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
    ? submissions.filter((s) => {
        const matchesStudent = s.studentId === selectedStudent.id;
        if (!matchesStudent) return false;
        if (selectedCategoryFilter === 'all') return true;

        const cat = criteriaCatalog.find((c) =>
          c.items.some((i) => i.id === s.criteriaId)
        );
        return cat ? cat.category.toLowerCase().trim() === selectedCategoryFilter.toLowerCase().trim() : false;
      })
    : [];

  const teacherName = currentUserInfo?.name || 'Prof. Kochumol Abraham';

  const handleVerifySubmission = (subId: number, status: 'Approved' | 'Rejected' | 'Correction Requested') => {
    if (!evaluationOpen) {
      alert('Evaluation access is currently CLOSED by system administrator.');
      return;
    }

    let customRemarks = '';
    if (status === 'Correction Requested') {
      customRemarks = prompt('Enter correction instructions for student:') || 'Correction Required by Class Advisor';
    } else if (status === 'Rejected') {
      customRemarks = prompt('Enter rejection remarks:') || 'Rejected by Class Advisor';
    } else {
      customRemarks = 'Verified and Approved by Class Advisor';
    }

    updateSubmission(subId, {
      status,
      verifiedByName: teacherName,
      remarks: customRemarks
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px', alignItems: 'start' }}>
              {/* Recent Student Progress Card */}
              <div className="card" style={{ height: '100%' }}>
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
                  style={{ background: '#ea580c', border: 'none', color: '#ffffff', padding: '12px 24px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center' }}
                  onClick={() => {
                    setActivePage('verification');
                    router.push('/teacher/verification');
                  }}
                >
                  ✓ Open Class Verification Desk
                </button>
              </div>

              {/* Uploaded Documents Awaiting Verification */}
              <div className="card" style={{ height: '100%' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Uploaded Documents Awaiting Verification</h2>
                {pendingVerificationSubmissions.length === 0 ? (
                  <p className="muted" style={{ fontSize: '0.9rem' }}>No pending documents to verify at this time.</p>
                ) : (
                  <div className="table-container" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Activity / Item</th>
                          <th>Proof File</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingVerificationSubmissions.map((sub) => {
                          const studentObj = students.find((s) => s.id === sub.studentId);
                          const itemObj = criteriaCatalog.flatMap((c) => c.items).find((i) => i.id === sub.criteriaId);
                          const isDriveUrl = sub.proof?.startsWith('http://') || sub.proof?.startsWith('https://');
                          const isEventId = sub.eventId || sub.proof?.startsWith('Event ID:');
                          const displayEventId = sub.eventId || (sub.proof?.startsWith('Event ID:') ? sub.proof.replace('Event ID: ', '') : sub.proof);

                          return (
                            <tr key={sub.id}>
                              <td style={{ fontWeight: 700 }}>
                                {studentObj ? studentObj.name : `Student #${sub.studentId}`}
                              </td>
                              <td style={{ fontSize: '0.88rem' }}>
                                {sub.evidence?.submissionType ? (
                                  <span className="badge badge-verified" style={{ background: '#e0e7ff', color: '#3730a3', border: '1px solid #c7d2fe', fontWeight: 800 }}>
                                    📊 {sub.evidence.submissionType}
                                  </span>
                                ) : (
                                  itemObj?.title || 'Activity'
                                )}
                              </td>
                              <td>
                                {isEventId ? (
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      background: '#eff6ff',
                                      color: '#1d4ed8',
                                      padding: '4px 10px',
                                      borderRadius: '8px',
                                      fontWeight: 700,
                                      fontSize: '0.82rem',
                                      border: '1px solid #bfdbfe'
                                    }}
                                  >
                                    🎫 Event ID: {displayEventId}
                                  </span>
                                ) : sub.proof ? (
                                  <a
                                    href={isDriveUrl ? sub.proof : 'https://drive.google.com/'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}
                                  >
                                    📁 {sub.proof.length > 15 ? sub.proof.substring(0, 15) + '...' : sub.proof}
                                  </a>
                                ) : (
                                  <span className="muted">-</span>
                                )}
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleVerifySubmission(sub.id, 'Approved')}
                                    style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                                  >
                                    Approve
                                  </button>
                                  <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => handleVerifySubmission(sub.id, 'Correction Requested')}
                                    style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                                  >
                                    Correction
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
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
            <div className="card" style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
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

              <div className="form-group">
                <label className="form-label">Filter Category</label>
                <select
                  className="select"
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="Academics">Academics</option>
                  <option value="Online Courses">Online Courses</option>
                  <option value="Internships">Internships</option>
                  <option value="Competitive Exams">Competitive Exams</option>
                  <option value="Scholarships">Scholarships</option>
                  <option value="Research">Research</option>
                  <option value="Prizes">Prizes</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Programs Organized">Programs Organized</option>
                  <option value="Social Responsibility">Social Responsibility</option>
                  <option value="Career Advancement">Career Advancement</option>
                  <option value="Documentation">Documentation</option>
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

                <div className="form-group" style={{ marginBottom: '20px', maxWidth: '320px' }}>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Category</label>
                  <select
                    className="select"
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="Academics">Academics</option>
                    <option value="Online Courses">Online Courses</option>
                    <option value="Internships">Internships</option>
                    <option value="Competitive Exams">Competitive Exams</option>
                    <option value="Scholarships">Scholarships</option>
                    <option value="Research">Research</option>
                    <option value="Prizes">Prizes</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Programs Organized">Programs Organized</option>
                    <option value="Social Responsibility">Social Responsibility</option>
                    <option value="Career Advancement">Career Advancement</option>
                    <option value="Documentation">Documentation</option>
                  </select>
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
                      {selectedStudentSubmissions.map((sub) => {
                        const isEventId = sub.eventId || sub.proof?.startsWith('Event ID:');
                        const displayEventId = sub.eventId || (sub.proof?.startsWith('Event ID:') ? sub.proof.replace('Event ID: ', '') : sub.proof);

                        return (
                          <tr key={sub.id}>
                            <td>{sub.description}</td>
                            <td>
                              {isEventId ? (
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    background: '#eff6ff',
                                    color: '#1d4ed8',
                                    padding: '4px 10px',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    fontSize: '0.82rem',
                                    border: '1px solid #bfdbfe'
                                  }}
                                >
                                  🎫 Event ID: {displayEventId}
                                </span>
                              ) : (
                                <a href={`/Assets/Proofs/${sub.proof}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                                  {sub.proof}
                                </a>
                              )}
                            </td>
                          <td>
                            {sub.status === 'Student Rep Verified' ? (
                              <span className="badge badge-submitted" style={{ background: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd' }}>
                                ⭐ Rep Verified
                              </span>
                            ) : sub.status === 'Pending Rep Verification' ? (
                              <span className="badge badge-submitted" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' }}>
                                ⏳ Awaiting Student Rep
                              </span>
                            ) : (
                              <span className={`badge ${getStatusBadgeClass(sub.status)}`}>
                                {sub.status}
                              </span>
                            )}
                          </td>
                          <td style={{ display: 'flex', gap: '6px' }}>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleVerifySubmission(sub.id, 'Approved')}
                              title="Approve submission as Class Teacher"
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => handleVerifySubmission(sub.id, 'Correction Requested')}
                              title="Request correction from student"
                            >
                              Correction
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleVerifySubmission(sub.id, 'Rejected')}
                              title="Reject submission"
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      );
                    })}
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
