'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Submission, CriteriaItem } from '@/data/initialData';

interface StudentWorkspaceProps {
  view?: 'dashboard' | 'submit' | 'submissions' | 'verification' | 'profile';
}

export const StudentWorkspace: React.FC<StudentWorkspaceProps> = ({ view }) => {
  const router = useRouter();
  const {
    submissions,
    criteriaCatalog,
    addSubmission,
    updateSubmission,
    deleteSubmission,
    currentStudentId,
    students,
    activePage,
    setActivePage,
    isStudentRep,
    currentUserInfo,
    updateUserProfile,
    editingSubId,
    setEditingSubId
  } = useApp();

  const activeTab = view || activePage || 'dashboard';

  // Filter criteria categories based on Student Representative group membership
  const availableCriteriaCatalog = React.useMemo(() => {
    if (isStudentRep) return criteriaCatalog;
    return criteriaCatalog.filter((c) => {
      const lower = c.category.toLowerCase().trim();
      return (
        c.id !== 'cat-academics' &&
        c.id !== 'cat-programs-organized' &&
        c.id !== 'cat-documentation' &&
        lower !== 'academics' &&
        lower !== 'programs organized' &&
        lower !== 'documentation'
      );
    });
  }, [criteriaCatalog, isStudentRep]);

  // Form State for Submit Activity
  const [selectedCategory, setSelectedCategory] = useState(availableCriteriaCatalog[0]?.id || 'cat-online-courses');
  const [selectedCriteriaId, setSelectedCriteriaId] = useState<number>(availableCriteriaCatalog[0]?.items[0]?.id || 201);

  // Sync selected category if current selection is not available for regular student
  React.useEffect(() => {
    if (!availableCriteriaCatalog.some((c) => c.id === selectedCategory)) {
      if (availableCriteriaCatalog[0]) {
        setSelectedCategory(availableCriteriaCatalog[0].id);
        if (availableCriteriaCatalog[0].items[0]) {
          setSelectedCriteriaId(availableCriteriaCatalog[0].items[0].id);
        }
      }
    }
  }, [availableCriteriaCatalog, selectedCategory]);

  const [countValue, setCountValue] = useState<number>(1);
  const [proofFile, setProofFile] = useState<string>('');
  const [eventId, setEventId] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Synchronize form states when editing a pending submission
  React.useEffect(() => {
    if (editingSubId) {
      const sub = submissions.find((s) => s.id === editingSubId);
      if (sub) {
        const cat = availableCriteriaCatalog.find((c) => c.items.some((i) => i.id === sub.criteriaId));
        if (cat) setSelectedCategory(cat.id);
        setSelectedCriteriaId(sub.criteriaId);
        setDescription(sub.description);
        if (sub.evidence?.count) setCountValue(sub.evidence.count);
        if (sub.eventId) {
          setEventId(sub.eventId);
          setProofFile('');
        } else if (sub.proof?.startsWith('Event ID:')) {
          setEventId(sub.proof.replace('Event ID: ', ''));
          setProofFile('');
        } else {
          setEventId('');
          setProofFile(sub.proof || '');
        }
      }
    }
  }, [editingSubId, submissions, availableCriteriaCatalog]);

  // Search & Filter State for My Submissions
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Verification Desk Search & Filter State for Student Representative
  const [repSearchQuery, setRepSearchQuery] = useState('');
  const [repStatusFilter, setRepStatusFilter] = useState('all');
  const [repPage, setRepPage] = useState(1);
  const repPageSize = 5;

  // Profile View States
  const [profileName, setProfileName] = useState(currentUserInfo?.name || '');
  const [profileClass, setProfileClass] = useState(currentUserInfo?.class_name || '');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [classList, setClassList] = useState<{name: string, department: string}[]>([]);

  // Sync state if currentUserInfo changes
  React.useEffect(() => {
    if (currentUserInfo) {
      setProfileName(currentUserInfo.name);
      setProfileClass(currentUserInfo.class_name || '');
    }
  }, [currentUserInfo]);

  // Fetch classes dynamically from backend when profile tab is active
  React.useEffect(() => {
    if (activeTab === 'profile') {
      fetch('http://localhost:8000/api/auth/classes/')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setClassList(data);
          }
        })
        .catch(err => console.error("Failed to fetch classes:", err));
    }
  }, [activeTab]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg('');
    setProfileErrorMsg('');
    setProfileSaving(true);

    const result = await updateUserProfile(profileName, profileClass);
    setProfileSaving(false);

    if (result.success) {
      setProfileSuccessMsg('Profile updated successfully in database!');
    } else {
      setProfileErrorMsg(result.error || 'Failed to update profile.');
    }
  };

  // Category Checklist Pagination
  const [checklistPage, setChecklistPage] = useState(1);
  const checklistPageSize = 5;

  const currentCategory = availableCriteriaCatalog.find((c) => c.id === selectedCategory) || availableCriteriaCatalog[0];
  const currentItem: CriteriaItem | undefined = currentCategory?.items.find((i) => i.id === selectedCriteriaId) || currentCategory?.items[0];
  const isProgramsOrganized = currentCategory?.id === 'cat-programs-organized' || currentCategory?.category.toLowerCase().trim() === 'programs organized';

  const mySubmissions = submissions.filter((s) => s.studentId === currentStudentId);

  const totalChecklistPages = Math.ceil(availableCriteriaCatalog.length / checklistPageSize) || 1;
  const paginatedChecklist = availableCriteriaCatalog.slice((checklistPage - 1) * checklistPageSize, checklistPage * checklistPageSize);

  // Category completion calculation
  const completedCategoryIds = new Set<string>();
  mySubmissions.forEach((sub) => {
    if (['Approved', 'Verified', 'Student Rep Verified', 'Evaluated', 'Locked'].includes(sub.status)) {
      const cat = availableCriteriaCatalog.find((c) => c.items.some((i) => i.id === sub.criteriaId));
      if (cat) completedCategoryIds.add(cat.id);
    }
  });

  const totalCategories = availableCriteriaCatalog.length;
  const completedCount = completedCategoryIds.size;
  const remainingCount = totalCategories - completedCount;

  // Filtered submissions
  const filteredSubmissions = mySubmissions.filter((sub) => {
    const item = criteriaCatalog.flatMap((c) => c.items).find((i) => i.id === sub.criteriaId);
    const cat = criteriaCatalog.find((c) => c.items.some((i) => i.id === sub.criteriaId));
    
    const matchesSearch =
      !searchQuery ||
      sub.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (cat && cat.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' || sub.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredSubmissions.length / pageSize) || 1;
  const paginatedSubmissions = filteredSubmissions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Peer Submissions for Group Verification Desk
  const peerSubmissions = submissions.filter((s) => s.studentId !== currentStudentId);

  const filteredRepSubmissions = peerSubmissions.filter((sub) => {
    const studentObj = students.find((s) => s.id === sub.studentId);
    const item = criteriaCatalog.flatMap((c) => c.items).find((i) => i.id === sub.criteriaId);
    const cat = criteriaCatalog.find((c) => c.items.some((i) => i.id === sub.criteriaId));

    const matchesSearch =
      !repSearchQuery ||
      (studentObj && studentObj.name.toLowerCase().includes(repSearchQuery.toLowerCase())) ||
      sub.description.toLowerCase().includes(repSearchQuery.toLowerCase()) ||
      (item && item.title.toLowerCase().includes(repSearchQuery.toLowerCase())) ||
      (cat && cat.category.toLowerCase().includes(repSearchQuery.toLowerCase()));

    const matchesStatus =
      repStatusFilter === 'all' ||
      (repStatusFilter === 'pending' && (sub.status === 'Pending Rep Verification' || sub.status === 'Pending' || sub.status === 'Submitted')) ||
      (repStatusFilter === 'verified' && sub.status === 'Student Rep Verified') ||
      (repStatusFilter === 'approved' && sub.status === 'Approved') ||
      (repStatusFilter === 'correction' && sub.status === 'Correction Requested') ||
      (repStatusFilter === 'rejected' && sub.status === 'Rejected');

    return matchesSearch && matchesStatus;
  });

  const totalRepPages = Math.ceil(filteredRepSubmissions.length / repPageSize) || 1;
  const paginatedRepSubmissions = filteredRepSubmissions.slice((repPage - 1) * repPageSize, repPage * repPageSize);

  const handleNavToSubmit = (catId: string, itemId?: number) => {
    setSelectedCategory(catId);
    const cat = availableCriteriaCatalog.find((c) => c.id === catId);
    if (cat && cat.items.length) {
      setSelectedCriteriaId(itemId || cat.items[0].id);
    }
    setActivePage('submit');
  };

  const handleFormSubmit = (status: 'Submitted' | 'Draft') => {
    if (!description.trim()) return;

    const isProgramsOrganized =
      currentCategory?.id === 'cat-programs-organized' ||
      currentCategory?.category.toLowerCase().trim() === 'programs organized';

    const initialStatus = status === 'Draft' ? 'Draft' : 'Pending Rep Verification';
    const computedEventId = isProgramsOrganized ? (eventId.trim() || undefined) : undefined;
    const computedProof = isProgramsOrganized
      ? (eventId.trim() ? `Event ID: ${eventId.trim()}` : (proofFile || 'EVT-SUBMISSION'))
      : (proofFile || 'document_proof.pdf');

    if (editingSubId) {
      updateSubmission(editingSubId, {
        criteriaId: selectedCriteriaId,
        description,
        proof: computedProof,
        eventId: computedEventId,
        status: initialStatus,
        evidence: { type: currentItem?.type || 'count', count: countValue }
      });
      setEditingSubId(null);
    } else {
      addSubmission({
        studentId: currentStudentId,
        criteriaId: selectedCriteriaId,
        description,
        status: initialStatus,
        remarks: status === 'Submitted' ? 'Awaiting Student Rep verification' : 'Saved as draft',
        proof: computedProof,
        eventId: computedEventId,
        evaluatorVerified: false,
        evidence: { type: currentItem?.type || 'count', count: countValue }
      });
    }

    setDescription('');
    setProofFile('');
    setEventId('');
    setCountValue(1);
    setActivePage('submissions');
    router.push('/student/submissions');
  };

  const handleEdit = (sub: Submission) => {
    setEditingSubId(sub.id);
    setActivePage('submit');
    router.push('/student/submit');
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('approved') || s.includes('verified') || s.includes('locked')) {
      return <span className="badge badge-verified">{status}</span>;
    }
    if (s.includes('pending') || s.includes('submitted')) {
      return <span className="badge badge-submitted">{status}</span>;
    }
    if (s.includes('correction')) {
      return <span className="badge badge-correction">{status}</span>;
    }
    if (s.includes('rejected')) {
      return <span className="badge badge-rejected">{status}</span>;
    }
    return <span className="badge badge-draft">{status}</span>;
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
        {/* TAB 1: DASHBOARD                                    */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Student Dashboard</h1>

            {/* Progress Card */}
            <div className="card">
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '12px' }}>Progress</h2>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                {completedCount} out of {totalCategories} categories completed
              </div>
              <div className="muted" style={{ fontSize: '0.85rem', marginBottom: '12px' }}>
                Progress: {completedCount} / {totalCategories}
              </div>

              {/* Progress Bar */}
              <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden', marginBottom: '16px' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${(completedCount / totalCategories) * 100}%`,
                    background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                    borderRadius: '5px',
                    transition: 'width 0.6s ease'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <span className="badge badge-verified" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                  ✓ Completed {completedCount}
                </span>
                <span className="badge badge-correction" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                  ⏳ Remaining {remainingCount}
                </span>
              </div>
            </div>

            {/* Category Checklist Card */}
            <div className="card">
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Category Checklist</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {paginatedChecklist.map((cat) => {
                  const isDone = completedCategoryIds.has(cat.id);
                  return (
                    <div key={cat.id} className="checklist-row">
                      <div className="checklist-left">
                        <span style={{ color: isDone ? 'var(--color-success)' : 'var(--color-text-soft)' }}>
                          {isDone ? '✓' : 'Σ'}
                        </span>
                        <span>{cat.category}</span>
                      </div>

                      {isDone ? (
                        <span className="badge badge-verified" style={{ padding: '6px 14px' }}>Done</span>
                      ) : (
                        <button
                          className="btn btn-sm btn-secondary checklist-add-btn"
                          onClick={() => handleNavToSubmit(cat.id)}
                          title={`Submit claim under ${cat.category}`}
                        >
                          +
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Checklist Pagination */}
              <div className="pagination-container">
                <button
                  className="pagination-btn"
                  disabled={checklistPage <= 1}
                  onClick={() => setChecklistPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </button>
                {Array.from({ length: totalChecklistPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`pagination-num ${checklistPage === pageNum ? 'active' : ''}`}
                    onClick={() => setChecklistPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  className="pagination-btn"
                  disabled={checklistPage >= totalChecklistPages}
                  onClick={() => setChecklistPage((p) => Math.min(totalChecklistPages, p + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: SUBMIT ACTIVITY                               */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'submit' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              {editingSubId ? 'Edit Pending Submission' : 'Submit Activity'}
            </h1>

            <div className="card" style={{ maxWidth: '860px' }}>
              {editingSubId && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    marginBottom: '16px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    background: '#fef3c7',
                    border: '1px solid #fde68a',
                    color: '#92400e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    ✏️ <strong>Editing Pending Submission #{editingSubId}</strong>
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => {
                      setEditingSubId(null);
                      setDescription('');
                      setProofFile('');
                      setEventId('');
                      setCountValue(1);
                    }}
                    style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                  >
                    Cancel Edit
                  </button>
                </div>
              )}
              {/* Category Availability Notice */}
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  background: isStudentRep ? 'rgba(99, 102, 241, 0.08)' : 'rgba(234, 179, 8, 0.1)',
                  border: isStudentRep ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid rgba(234, 179, 8, 0.25)',
                  color: isStudentRep ? '#3730a3' : '#854d0e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <span>{isStudentRep ? '⭐' : 'ℹ️'}</span>
                <div>
                  {isStudentRep ? (
                    <>
                      <strong>Student Representative Access:</strong> All category options (including <em>Academics</em>, <em>Programs Organized</em>, and <em>Documentation</em>) are accessible for you.
                    </>
                  ) : (
                    <>
                      <strong>Regular Student Access:</strong> Categories like <em>Academics</em>, <em>Programs Organized</em>, and <em>Documentation</em> are managed by your class <strong>Student Representative</strong> and are hidden here.
                    </>
                  )}
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleFormSubmit('Submitted');
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="select"
                      value={selectedCategory}
                      onChange={(e) => {
                        const catId = e.target.value;
                        setSelectedCategory(catId);
                        const cat = availableCriteriaCatalog.find((c) => c.id === catId);
                        if (cat && cat.items[0]) {
                          setSelectedCriteriaId(cat.items[0].id);
                        }
                      }}
                    >
                      {availableCriteriaCatalog.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.category}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Item</label>
                    <select
                      className="select"
                      value={selectedCriteriaId}
                      onChange={(e) => setSelectedCriteriaId(Number(e.target.value))}
                    >
                      {currentCategory?.items.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Selected Criteria Rule Box */}
                {currentItem && (
                  <div style={{ padding: '16px', background: 'rgba(79, 70, 229, 0.04)', border: '1px solid rgba(79, 70, 229, 0.15)', borderRadius: '14px' }}>
                    <span className="badge badge-submitted" style={{ marginBottom: '8px' }}>
                      {currentItem.type.toUpperCase()} BASED
                    </span>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, marginTop: '4px' }}>{currentItem.title}</h3>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Count / Frequency</label>
                    <input
                      type="number"
                      className="input"
                      min={1}
                      value={countValue}
                      onChange={(e) => setCountValue(Number(e.target.value))}
                      required
                    />
                  </div>

                  {isProgramsOrganized ? (
                    <div className="form-group">
                      <label className="form-label">Event ID</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="Enter Event ID (e.g. EVT-2026-001, EVT-901)..."
                        value={eventId}
                        onChange={(e) => setEventId(e.target.value)}
                        required
                      />
                      <p className="muted" style={{ fontSize: '0.78rem', marginTop: '6px' }}>
                        Include the official Event ID for this organized program instead of uploading a proof document.
                      </p>
                    </div>
                  ) : (
                    <div className="form-group">
                      <label className="form-label">Proof Document (Google Drive Upload)</label>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <a
                          href="https://drive.google.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            whiteSpace: 'nowrap',
                            background: '#ffffff',
                            border: '1.5px solid #cbd5e1',
                            color: '#0f172a',
                            fontWeight: 700,
                            padding: '10px 16px',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                            transition: 'all 0.2s ease'
                          }}
                          title="Open Google Drive to upload proof document"
                        >
                          <svg width="20" height="20" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                            <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                            <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
                            <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.5l5.85 10.15z" fill="#ea4335"/>
                            <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                            <path d="m59.8 53h27.5c0-1.55-.4-3.1-1.2-4.5l-25.4-44c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8z" fill="#ffba00"/>
                            <path d="m73.55 76.8h-59.8c1.55.8 3.25 1.2 4.95 1.2h49.9c1.7 0 3.4-.4 4.95-1.2z" fill="#2684fc"/>
                          </svg>
                          Upload Proof to Google Drive
                        </a>
                        <input
                          type="text"
                          className="input"
                          style={{ flex: 1, minWidth: '220px' }}
                          placeholder="Paste Google Drive link or document reference..."
                          value={proofFile}
                          onChange={(e) => setProofFile(e.target.value)}
                        />
                      </div>
                      <p className="muted" style={{ fontSize: '0.78rem', marginTop: '6px' }}>
                        Click the button above to upload your document to Google Drive, then paste the file link or reference here.
                      </p>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="textarea"
                    rows={4}
                    placeholder="Describe the activity, details, dates, and achievements..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-start', marginTop: '8px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleFormSubmit('Draft')}
                  >
                    Save Draft
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingSubId ? 'Update Submission' : 'Submit Activity'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: MY SUBMISSIONS                                */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'submissions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>My Submissions</h1>

            <div className="card">
              {/* Search & Filter Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Search Item</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Search item or category..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status Filter</label>
                  <select
                    className="select"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved / Verified</option>
                    <option value="correction">Correction Requested</option>
                    <option value="rejected">Rejected</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="muted" style={{ fontSize: '0.85rem', marginBottom: '16px' }}>
                Showing {paginatedSubmissions.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, filteredSubmissions.length)} of {filteredSubmissions.length} records
              </div>

              {/* Table */}
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Item</th>
                      <th>Evidence</th>
                      <th>Proof File</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedSubmissions.map((sub) => {
                      const item = criteriaCatalog.flatMap((c) => c.items).find((i) => i.id === sub.criteriaId);
                      const cat = criteriaCatalog.find((c) => c.items.some((i) => i.id === sub.criteriaId));
                      const rulePts = item ? item.marks * (sub.evidence?.count || 1) : 0;
                      const isPending = ['Pending', 'Pending Rep Verification', 'Submitted', 'Draft', 'Correction Requested'].includes(sub.status) || sub.status.toLowerCase().includes('pending');
                      const isDriveUrl = sub.proof?.startsWith('http://') || sub.proof?.startsWith('https://');
                      const isEventId = sub.eventId || sub.proof?.startsWith('Event ID:');
                      const displayEventId = sub.eventId || (sub.proof?.startsWith('Event ID:') ? sub.proof.replace('Event ID: ', '') : sub.proof);

                      return (
                        <tr key={sub.id}>
                          <td style={{ fontWeight: 700 }}>{cat?.category || 'General'}</td>
                          <td>{item?.title || 'Activity'}</td>
                          <td>
                            {sub.evidence?.count ? `${sub.evidence.count}` : '-'}
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
                                style={{ color: 'var(--primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                                title="Open Proof Document in Google Drive"
                              >
                                📁 {sub.proof.length > 20 ? sub.proof.substring(0, 20) + '...' : sub.proof}
                              </a>
                            ) : (
                              <span className="muted">-</span>
                            )}
                          </td>
                          <td style={{ maxWidth: '240px' }}>{sub.description}</td>
                          <td>
                            {getStatusBadge(sub.status)}
                            {sub.verifiedByName && (
                              <div style={{
                                fontSize: '0.78rem',
                                color: ['Approved', 'Verified', 'Evaluated', 'Locked'].includes(sub.status) ? '#16a34a' : sub.status === 'Rejected' ? '#dc2626' : '#ea580c',
                                fontWeight: 700,
                                marginTop: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                👤 {['Approved', 'Verified', 'Evaluated', 'Locked'].includes(sub.status) ? 'Approved' : sub.status === 'Rejected' ? 'Rejected' : 'Reviewed'} by {sub.verifiedByName}
                              </div>
                            )}
                            {sub.remarks && (
                              <div style={{
                                fontSize: '0.76rem',
                                color: 'var(--text-muted)',
                                marginTop: '4px',
                                fontStyle: 'italic',
                                background: '#f8fafc',
                                padding: '6px 8px',
                                borderRadius: '6px',
                                border: '1px dashed #e2e8f0',
                                maxWidth: '180px',
                                wordBreak: 'break-word'
                              }}>
                                💬 &ldquo;{sub.remarks}&rdquo;
                              </div>
                            )}
                          </td>
                          <td>
                            {isPending ? (
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  className="btn btn-sm btn-secondary"
                                  onClick={() => handleEdit(sub)}
                                  title="Edit Pending Submission"
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this pending submission?')) {
                                      deleteSubmission(sub.id);
                                    }
                                  }}
                                  title="Delete Pending Submission"
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            ) : (
                              <span className="muted" style={{ fontSize: '0.82rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                🔒 Locked
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {paginatedSubmissions.length === 0 && (
                      <tr>
                        <td colSpan={9} style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-soft)' }}>
                          No submissions matched your search filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="pagination-container">
                <button
                  className="pagination-btn"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`pagination-num ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  className="pagination-btn"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 4: GROUP VERIFICATION (STUDENT REPRESENTATIVE)   */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'verification' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Group Submissions Verification Desk</h1>
              <p className="muted" style={{ fontSize: '0.88rem' }}>
                Review and verify activity claims submitted by other students from your class/group. Once verified by you, claims move forward to Class Teacher verification.
              </p>
            </div>

            <div className="card">
              {/* Search & Filter Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Search Student / Claim</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Search student name, item, or description..."
                    value={repSearchQuery}
                    onChange={(e) => {
                      setRepSearchQuery(e.target.value);
                      setRepPage(1);
                    }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Verification Status Filter</label>
                  <select
                    className="select"
                    value={repStatusFilter}
                    onChange={(e) => {
                      setRepStatusFilter(e.target.value);
                      setRepPage(1);
                    }}
                  >
                    <option value="all">All Peer Submissions</option>
                    <option value="pending">Pending Student Rep Verification</option>
                    <option value="verified">Verified by Student Rep</option>
                    <option value="approved">Teacher Approved</option>
                    <option value="correction">Correction Requested</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Category</th>
                      <th>Item</th>
                      <th>Proof File</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRepSubmissions.map((sub) => {
                      const studentObj = students.find((s) => s.id === sub.studentId);
                      const item = criteriaCatalog.flatMap((c) => c.items).find((i) => i.id === sub.criteriaId);
                      const cat = criteriaCatalog.find((c) => c.items.some((i) => i.id === sub.criteriaId));
                      const isDriveUrl = sub.proof?.startsWith('http://') || sub.proof?.startsWith('https://');
                      const isEventId = sub.eventId || sub.proof?.startsWith('Event ID:');
                      const displayEventId = sub.eventId || (sub.proof?.startsWith('Event ID:') ? sub.proof.replace('Event ID: ', '') : sub.proof);

                      const canVerify = sub.status === 'Pending Rep Verification' || sub.status === 'Pending' || sub.status === 'Submitted';

                      return (
                        <tr key={sub.id}>
                          <td style={{ fontWeight: 700 }}>
                            {studentObj ? studentObj.name : `Student #${sub.studentId}`}
                            <div className="muted" style={{ fontSize: '0.76rem' }}>{studentObj?.className || 'BSc CS A'}</div>
                          </td>
                          <td style={{ fontWeight: 600 }}>{cat?.category || 'General'}</td>
                          <td>{item?.title || 'Activity'}</td>
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
                                style={{ color: 'var(--primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                                title="Open Proof Document"
                              >
                                📁 {sub.proof.length > 18 ? sub.proof.substring(0, 18) + '...' : sub.proof}
                              </a>
                            ) : (
                              <span className="muted">-</span>
                            )}
                          </td>
                          <td style={{ maxWidth: '220px' }}>{sub.description}</td>
                          <td>{getStatusBadge(sub.status)}</td>
                          <td>
                            {canVerify ? (
                              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() =>
                                    updateSubmission(sub.id, {
                                      status: 'Student Rep Verified',
                                      remarks: 'Verified by Student Representative and forwarded to Class Teacher.'
                                    })
                                  }
                                  title="Verify and forward to Class Teacher"
                                  style={{ padding: '6px 12px', fontSize: '0.8rem', fontWeight: 700 }}
                                >
                                  ✓ Verify & Forward
                                </button>
                                <button
                                  className="btn btn-sm btn-secondary"
                                  onClick={() =>
                                    updateSubmission(sub.id, {
                                      status: 'Correction Requested',
                                      remarks: 'Correction requested by Student Representative.'
                                    })
                                  }
                                  title="Request correction"
                                  style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                                >
                                  Correction
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() =>
                                    updateSubmission(sub.id, {
                                      status: 'Rejected',
                                      remarks: 'Rejected by Student Representative.'
                                    })
                                  }
                                  title="Reject submission"
                                  style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="muted" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                                {sub.status === 'Student Rep Verified' ? '✓ Forwarded to Teacher' : sub.status}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {paginatedRepSubmissions.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '28px', color: 'var(--color-text-soft)' }}>
                          No peer group submissions match your filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Rep Pagination Controls */}
              <div className="pagination-container">
                <button
                  className="pagination-btn"
                  disabled={repPage <= 1}
                  onClick={() => setRepPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </button>
                {Array.from({ length: totalRepPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`pagination-num ${repPage === pageNum ? 'active' : ''}`}
                    onClick={() => setRepPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  className="pagination-btn"
                  disabled={repPage >= totalRepPages}
                  onClick={() => setRepPage((p) => Math.min(totalRepPages, p + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 5: MY PROFILE                                    */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>My Profile</h1>
              <p className="muted" style={{ fontSize: '0.88rem' }}>
                View your personal student profile details derived from your official institutional account.
              </p>
            </div>

            {/* Profile Card Summary */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '36px 40px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary, #3b82f6), #1d4ed8)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25)',
                  overflow: 'hidden'
                }}
              >
                {currentUserInfo?.picture ? (
                  <img
                    src={currentUserInfo.picture}
                    alt={currentUserInfo.name || 'Profile'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span>{currentUserInfo?.name ? currentUserInfo.name.charAt(0).toUpperCase() : 'S'}</span>
                )}
              </div>

              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>{currentUserInfo?.name || 'Student'}</h2>
                <p className="muted" style={{ fontSize: '0.86rem', marginTop: '4px' }}>{currentUserInfo?.email}</p>
              </div>

              <div style={{ width: '100%', height: '1px', background: '#e2e8f0', margin: '4px 0' }} />

              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.92rem' }}>
                  <span className="muted" style={{ color: '#64748b' }}>Role</span>
                  <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>{currentUserInfo?.role || 'Student'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', fontSize: '0.92rem' }}>
                  <span className="muted" style={{ color: '#64748b', whiteSpace: 'nowrap' }}>Department</span>
                  <span style={{ fontWeight: 700, textAlign: 'right' }}>{currentUserInfo?.department || 'Not Assigned'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.92rem' }}>
                  <span className="muted" style={{ color: '#64748b' }}>Current Class</span>
                  <span style={{ fontWeight: 700 }}>{currentUserInfo?.class_name || 'Not Assigned'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
