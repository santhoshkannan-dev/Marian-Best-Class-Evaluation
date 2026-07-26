'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Submission, CriteriaItem } from '@/data/initialData';

interface StudentWorkspaceProps {
  view?: 'dashboard' | 'submit' | 'submissions';
}

export const StudentWorkspace: React.FC<StudentWorkspaceProps> = ({ view }) => {
  const {
    submissions,
    criteriaCatalog,
    addSubmission,
    updateSubmission,
    deleteSubmission,
    currentStudentId,
    students,
    activePage,
    setActivePage
  } = useApp();

  const activeTab = view || activePage || 'dashboard';

  // Form State for Submit Activity
  const [selectedCategory, setSelectedCategory] = useState(criteriaCatalog[0]?.id || 'cat-academics');
  const [selectedCriteriaId, setSelectedCriteriaId] = useState<number>(criteriaCatalog[0]?.items[0]?.id || 101);
  const [countValue, setCountValue] = useState<number>(1);
  const [proofFile, setProofFile] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [editingSubId, setEditingSubId] = useState<number | null>(null);

  // Search & Filter State for My Submissions
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Category Checklist Pagination
  const [checklistPage, setChecklistPage] = useState(1);
  const checklistPageSize = 5;

  const currentCategory = criteriaCatalog.find((c) => c.id === selectedCategory) || criteriaCatalog[0];
  const currentItem: CriteriaItem | undefined = currentCategory?.items.find((i) => i.id === selectedCriteriaId) || currentCategory?.items[0];

  const mySubmissions = submissions.filter((s) => s.studentId === currentStudentId);

  const totalChecklistPages = Math.ceil(criteriaCatalog.length / checklistPageSize) || 1;
  const paginatedChecklist = criteriaCatalog.slice((checklistPage - 1) * checklistPageSize, checklistPage * checklistPageSize);

  // Category completion calculation
  const completedCategoryIds = new Set<string>();
  mySubmissions.forEach((sub) => {
    if (['Approved', 'Verified', 'Evaluated', 'Locked'].includes(sub.status)) {
      const cat = criteriaCatalog.find((c) => c.items.some((i) => i.id === sub.criteriaId));
      if (cat) completedCategoryIds.add(cat.id);
    }
  });

  const totalCategories = criteriaCatalog.length;
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

  const handleNavToSubmit = (catId: string, itemId?: number) => {
    setSelectedCategory(catId);
    const cat = criteriaCatalog.find((c) => c.id === catId);
    if (cat && cat.items.length) {
      setSelectedCriteriaId(itemId || cat.items[0].id);
    }
    setActivePage('submit');
  };

  const handleFormSubmit = (status: 'Submitted' | 'Draft') => {
    if (!description.trim()) return;

    if (editingSubId) {
      updateSubmission(editingSubId, {
        criteriaId: selectedCriteriaId,
        description,
        proof: proofFile || 'document_proof.pdf',
        status: status === 'Submitted' ? 'Pending' : 'Draft',
        evidence: { type: currentItem?.type || 'count', count: countValue }
      });
      setEditingSubId(null);
    } else {
      addSubmission({
        studentId: currentStudentId,
        criteriaId: selectedCriteriaId,
        description,
        status: status === 'Submitted' ? 'Pending' : 'Draft',
        remarks: status === 'Submitted' ? 'Awaiting verification' : 'Saved as draft',
        proof: proofFile || 'document_proof.pdf',
        evaluatorVerified: false,
        evidence: { type: currentItem?.type || 'count', count: countValue }
      });
    }

    setDescription('');
    setProofFile('');
    setCountValue(1);
    setActivePage('submissions');
  };

  const handleEdit = (sub: Submission) => {
    const cat = criteriaCatalog.find((c) => c.items.some((i) => i.id === sub.criteriaId));
    if (cat) setSelectedCategory(cat.id);
    setSelectedCriteriaId(sub.criteriaId);
    setDescription(sub.description);
    setProofFile(sub.proof || '');
    setEditingSubId(sub.id);
    setActivePage('submit');
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
              {editingSubId ? 'Edit Submission' : 'Submit Activity'}
            </h1>

            <div className="card" style={{ maxWidth: '860px' }}>
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
                        const cat = criteriaCatalog.find((c) => c.id === catId);
                        if (cat && cat.items[0]) {
                          setSelectedCriteriaId(cat.items[0].id);
                        }
                      }}
                    >
                      {criteriaCatalog.map((cat) => (
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
                          {item.title} ({item.marks > 0 ? `+${item.marks}` : item.marks} pts)
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
                    <p className="muted" style={{ fontSize: '0.88rem', marginTop: '4px' }}>
                      Points rule: {currentItem.marks > 0 ? `+${currentItem.marks}` : currentItem.marks} pts per entry claim
                    </p>
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

                  <div className="form-group">
                    <label className="form-label">Upload Proof Document</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. nptel_certificate_proof.pdf"
                      value={proofFile}
                      onChange={(e) => setProofFile(e.target.value)}
                    />
                  </div>
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
                      <th>Description</th>
                      <th>Status</th>
                      <th>Rule Marks</th>
                      <th>Final Marks</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedSubmissions.map((sub) => {
                      const item = criteriaCatalog.flatMap((c) => c.items).find((i) => i.id === sub.criteriaId);
                      const cat = criteriaCatalog.find((c) => c.items.some((i) => i.id === sub.criteriaId));
                      const rulePts = item ? item.marks * (sub.evidence?.count || 1) : 0;
                      const isLocked = ['Approved', 'Verified', 'Evaluated', 'Locked'].includes(sub.status);

                      return (
                        <tr key={sub.id}>
                          <td style={{ fontWeight: 700 }}>{cat?.category || 'General'}</td>
                          <td>{item?.title || 'Activity'}</td>
                          <td>
                            {sub.evidence?.count ? `${sub.evidence.count} x ${item?.marks || 0} = ${rulePts.toFixed(1)}` : '-'}
                          </td>
                          <td style={{ maxWidth: '240px' }}>{sub.description}</td>
                          <td>{getStatusBadge(sub.status)}</td>
                          <td>{rulePts.toFixed(1)}</td>
                          <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                            {sub.marks !== null && sub.marks !== undefined ? sub.marks.toFixed(1) : '-'}
                          </td>
                          <td>
                            {!isLocked ? (
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  className="btn btn-sm btn-secondary"
                                  onClick={() => handleEdit(sub)}
                                  title="Edit Submission"
                                >
                                  ✏️
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => deleteSubmission(sub.id)}
                                  title="Delete Submission"
                                >
                                  🗑️
                                </button>
                              </div>
                            ) : (
                              <span className="muted" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Locked</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {paginatedSubmissions.length === 0 && (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-soft)' }}>
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
      </div>
    </div>
  );
};
