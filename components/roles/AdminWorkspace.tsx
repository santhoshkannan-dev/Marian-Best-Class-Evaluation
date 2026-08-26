'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';

interface AdminWorkspaceProps {
  view?: 'years' | 'criteria' | 'users' | 'departments' | 'settings' | 'champions';
}

interface AcademicYear {
  year: string;
  status: 'Active' | 'Inactive';
}

interface CriteriaCategory {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  className: string;
  approval: 'Approved' | 'Pending';
}

interface AdminDept {
  name: string;
  classes: string[];
}

export const AdminWorkspace: React.FC<AdminWorkspaceProps> = ({ view }) => {
  const { activePage } = useApp();
  const activeTab = view || activePage || 'years';

  const {
    submissionOpen,
    toggleSubmissionOpen,
    evaluationOpen,
    toggleEvaluationOpen,
    submissionWindowStart,
    submissionWindowEnd,
    setSubmissionWindow,
    academicYears: globalYears,
    activeAcademicYear: globalActiveYear,
    addAcademicYearGlobal,
    deleteAcademicYearGlobal,
    setActiveAcademicYearGlobal,
    departments,
    classes,
    addDepartmentGlobal,
    deleteDepartmentGlobal,
    addClassGlobal,
    updateClassMapping,
    users,
    userGroups,
    addUserGlobal,
    criteriaCatalog,
    addCriteriaCategory,
    addCriteriaItem,
    updateCriteriaItem,
    deleteCriteriaItem,
    deleteCriteriaCategory
  } = useApp();

  const [confirmSubmissionModal, setConfirmSubmissionModal] = useState<boolean>(false);
  const [confirmEvaluationModal, setConfirmEvaluationModal] = useState<boolean>(false);

  // ----------------------------------------------------
  // DATASET 1: ACADEMIC YEARS
  // ----------------------------------------------------
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [newYearInput, setNewYearInput] = useState('');

  // Synchronize Academic Years from global AppContext
  useEffect(() => {
    if (globalYears && globalYears.length > 0) {
      setAcademicYears(
        globalYears.map((y) => ({
          year: y,
          status: y === globalActiveYear ? 'Active' : 'Inactive'
        }))
      );
    }
  }, [globalYears, globalActiveYear]);

  const handleAddYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYearInput.trim() || !/^\d{4}-\d{4}$/.test(newYearInput.trim())) {
      alert('Please enter year in YYYY-YYYY format (e.g. 2026-2027)');
      return;
    }
    const exists = academicYears.some((y) => y.year === newYearInput.trim());
    if (exists) {
      alert('This academic year already exists.');
      return;
    }
    const formatted = newYearInput.trim();
    addAcademicYearGlobal(formatted);
    setActiveAcademicYearGlobal(formatted, true);
    setNewYearInput('');
  };

  const handleToggleYearStatus = (targetYear: string, isActive: boolean) => {
    setActiveAcademicYearGlobal(targetYear, isActive);
  };

  const handleDeleteYear = (targetYear: string) => {
    if (window.confirm(`Are you sure you want to delete academic year "${targetYear}"?`)) {
      deleteAcademicYearGlobal(targetYear);
    }
  };

  // ----------------------------------------------------
  // DATASET 2: CRITERIA MANAGEMENT
  // ----------------------------------------------------
  const [selectedYear, setSelectedYear] = useState('2025-2026');

  // Criteria Items detailed view states
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemType, setNewItemType] = useState('Count Based');
  const [newItemMarks, setNewItemMarks] = useState(5);
  const [newItemDetails, setNewItemDetails] = useState('');

  // State to hold pending teacher selections before confirmation
  const [pendingClassTeachers, setPendingClassTeachers] = useState<Record<string, string>>({});

  interface CriteriaItemDetail {
    id: string;
    title: string;
    type: string;
    marks: number;
    details: string;
  }

  const handleAddCategory = () => {
    const title = prompt('Enter Category Name:');
    if (!title) return;
    const desc = prompt('Enter Category Description:') || 'Custom category description.';
    const id = (criteriaCatalog.length + 1).toString();
    addCriteriaCategory({ code: `cat-${Date.now()}`, category: title, accessLevel: 'all_students' });
  };

  const handleCreateCriteriaItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !newItemTitle.trim()) return;

    addCriteriaItem(selectedCategory.id, {
      title: newItemTitle.trim(),
      type: newItemType as any,
      marks: newItemMarks,
      details: newItemDetails.trim()
    });

    setNewItemTitle('');
    setNewItemDetails('');
    setShowAddItemForm(false);
  };

  const handleDeleteCriteriaItem = (catId: string, itemId: string) => {
    if (window.confirm('Are you sure you want to delete this evaluation item?')) {
      deleteCriteriaItem(catId, parseInt(itemId, 10));
    }
  };

  const handleEditCriteriaItemPrompt = (catId: string, itemId: string) => {
    const cat = criteriaCatalog.find(c => String(c.id) === String(catId));
    if (!cat) return;
    const item = cat.items.find((i: any) => String(i.id) === String(itemId));
    if (!item) return;

    const newTitle = prompt('Edit Title:', item.title);
    if (newTitle === null) return;
    const newMarksStr = prompt('Edit Marks:', item.marks.toString());
    if (newMarksStr === null) return;
    const newDetails = prompt('Edit Details:', item.details);
    if (newDetails === null) return;

    updateCriteriaItem(catId, parseInt(itemId, 10), { title: newTitle || item.title, marks: Number(newMarksStr) || 0, details: newDetails || item.details });
  };

  // ----------------------------------------------------
  // DATASET 3: USER MANAGEMENT
  // ----------------------------------------------------
  const [usersList, setUsersList] = useState<AdminUser[]>([]);

  // Synchronize Users list from global AppContext
  useEffect(() => {
    if (users && users.length > 0) {
      setUsersList(
        users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          department: u.department || 'General',
          className: u.className || 'General',
          approval: u.isApproved ? 'Approved' : 'Pending'
        }))
      );
    }
  }, [users]);

  const [userSearch, setUserSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [classFilter, setClassFilter] = useState('All Classes');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [userPage, setUserPage] = useState(1);
  const userPageSize = 5;

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesDept = deptFilter === 'All Departments' || u.department === deptFilter;
    const matchesClass = classFilter === 'All Classes' || u.className === classFilter;
    const matchesRole = roleFilter === 'All Roles' || u.role.toLowerCase() === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All Statuses' || u.approval === statusFilter;

    return matchesSearch && matchesDept && matchesClass && matchesRole && matchesStatus;
  });

  const totalUserPages = Math.ceil(filteredUsers.length / userPageSize) || 1;
  const paginatedUsers = filteredUsers.slice((userPage - 1) * userPageSize, userPage * userPageSize);

  const handleAddUserPrompt = () => {
    const name = prompt('Enter User Name:');
    if (!name) return;
    const email = prompt('Enter User Email:');
    if (!email) return;
    const role = prompt('Enter Role (Student / Faculty / Evaluation / Admin):') || 'Student';
    const department = prompt('Enter Department Code (e.g. CS, MCA):') || 'CS';
    const className = prompt('Enter Class Name (e.g. BCA A, MCA):') || 'BCA A';

    addUserGlobal(email, role.toLowerCase(), name, department, className);
  };

  // ----------------------------------------------------
  // DATASET 4: DEPARTMENT MANAGEMENT
  // ----------------------------------------------------
  const [deptsList, setDeptsList] = useState<AdminDept[]>([]);

  // Synchronize Departments & Classes from global AppContext
  useEffect(() => {
    if (departments) {
      setDeptsList(
        departments.map((d) => {
          const deptClasses = (classes || []).filter((c) => {
            if (!c || !c.name) return false;
            const cDept = (c.department || '').toLowerCase().trim();
            const cCode = (c.department_code || '').toLowerCase().trim();
            const dName = (d.name || '').toLowerCase().trim();
            const dCode = (d.code || '').toLowerCase().trim();

            return (
              (cCode && dCode && cCode === dCode) ||
              (cDept && dName && cDept === dName) ||
              (cDept && dCode && cDept === dCode) ||
              (cCode && dName && cCode === dName)
            );
          });
          return {
            name: d.name,
            code: d.code,
            classes: deptClasses.map((c) => c.name)
          };
        })
      );
    }
  }, [departments, classes]);

  const [newDeptInput, setNewDeptInput] = useState('');
  const [newClassInputs, setNewClassInputs] = useState<Record<string, string>>({});

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptInput.trim()) return;
    const code = newDeptInput.trim().toUpperCase().split(' ').map(w => w[0]).join('').substring(0, 5);
    addDepartmentGlobal(newDeptInput.trim(), code);
    setNewDeptInput('');
  };

  const handleDeleteDept = (deptName: string) => {
    // Find department code by name
    const dept = departments?.find(d => d.name === deptName || d.code === deptName);
    const code = dept ? dept.code : deptName;
    if (window.confirm(`Are you sure you want to delete department ${code}?`)) {
      deleteDepartmentGlobal(code);
    }
  };

  const handleAddClass = (deptName: string) => {
    const classVal = newClassInputs[deptName]?.trim();
    if (!classVal) return;
    const dept = departments?.find(d => d.name === deptName || d.code === deptName);
    const code = dept ? dept.code : deptName;
    addClassGlobal(classVal, code);
    setNewClassInputs(prev => ({ ...prev, [deptName]: '' }));
  };

  // ----------------------------------------------------
  // DATASET 5: SETTINGS
  // ----------------------------------------------------
  const [startTimeWindow, setStartTimeWindow] = useState(submissionWindowStart || '');
  const [endTimeWindow, setEndTimeWindow] = useState(submissionWindowEnd || '');

  React.useEffect(() => {
    setStartTimeWindow(submissionWindowStart || '');
    setEndTimeWindow(submissionWindowEnd || '');
  }, [submissionWindowStart, submissionWindowEnd]);


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
        {/* TAB 1: ACADEMIC YEARS                                */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'years' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Section Intro */}
            <div>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>Academic Year Management</h1>
              <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#6B7280', marginTop: '4px', margin: 0 }}>Add new academic years and activate the current session.</p>
            </div>

            {/* Card 1 — Create / Add Section */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #E5E7EB',
              padding: '28px',
              boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.04)'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', marginTop: 0, marginBottom: '20px' }}>Add Academic Year</h3>
              <form onSubmit={handleAddYear} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '480px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#9CA3AF',
                    marginBottom: '8px'
                  }}>
                    YEAR FORMAT (E.G. 2026-2027)
                  </label>
                  <input
                    type="text"
                    placeholder="YYYY-YYYY"
                    value={newYearInput}
                    onChange={(e) => setNewYearInput(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      borderRadius: '9999px',
                      padding: '12px 22px',
                      border: '1px solid #E5E7EB',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: '#1F2937',
                      background: '#F9FAFB',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    style={{
                      background: '#FF6B2C',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      borderRadius: '9999px',
                      padding: '12px 30px',
                      fontSize: '0.88rem',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(255, 107, 44, 0.25)',
                      transition: 'all 0.2s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>+</span> Add Year
                  </button>
                </div>
              </form>
            </div>

            {/* Card 2 — Data Table Section */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #E5E7EB',
              padding: '28px',
              boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.04)'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', marginTop: 0, marginBottom: '20px' }}>Academic Years List</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <th style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', paddingBottom: '16px' }}>ACADEMIC YEAR</th>
                      <th style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', paddingBottom: '16px' }}>STATUS</th>
                      <th style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', paddingBottom: '16px', textAlign: 'right' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {academicYears.map((y) => (
                      <tr key={y.year} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '16px 0', fontWeight: 700, color: '#111827', fontSize: '0.92rem' }}>{y.year}</td>
                        <td style={{ padding: '16px 0' }}>
                          {y.status === 'Active' ? (
                            <span style={{
                              background: '#DCFCE7',
                              color: '#15803D',
                              borderRadius: '9999px',
                              padding: '5px 16px',
                              fontSize: '0.76rem',
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#15803D' }} />
                              Active
                            </span>
                          ) : (
                            <span style={{
                              background: '#FFEDD5',
                              color: '#C2410C',
                              borderRadius: '9999px',
                              padding: '5px 16px',
                              fontSize: '0.76rem',
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C2410C' }} />
                              Inactive
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '16px 0', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', justifyContent: 'flex-end' }}>
                            {y.status === 'Active' ? (
                              <button
                                style={{
                                  border: '1px solid #EF4444',
                                  color: '#EF4444',
                                  background: 'transparent',
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  padding: '8px 18px',
                                  borderRadius: '9999px',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                                onClick={() => handleToggleYearStatus(y.year, false)}
                              >
                                Set Inactive
                              </button>
                            ) : (
                              <button
                                style={{
                                  background: '#10B981',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  padding: '8px 18px',
                                  borderRadius: '9999px',
                                  cursor: 'pointer',
                                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)',
                                  transition: 'all 0.2s ease'
                                }}
                                onClick={() => handleToggleYearStatus(y.year, true)}
                              >
                                Set Active
                              </button>
                            )}
                            <button
                              style={{
                                background: '#EF4444',
                                color: '#FFFFFF',
                                border: 'none',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                padding: '8px 18px',
                                borderRadius: '9999px',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2)',
                                transition: 'all 0.2s ease'
                              }}
                              onClick={() => handleDeleteYear(y.year)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: CRITERIA MANAGEMENT                           */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'criteria' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {selectedCategory ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Back & Add Item Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    className="btn"
                    style={{
                      background: '#ffffff',
                      color: '#ea580c',
                      border: '1.5px solid #ea580c',
                      fontWeight: 700,
                      padding: '8px 20px',
                      borderRadius: '10px',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setSelectedCategory(null);
                      setShowAddItemForm(false);
                    }}
                  >
                    ← Back to Modules
                  </button>

                  <button
                    className="btn"
                    style={{
                      background: '#ea580c',
                      color: '#ffffff',
                      fontWeight: 700,
                      padding: '10px 22px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      border: 'none'
                    }}
                    onClick={() => setShowAddItemForm(!showAddItemForm)}
                  >
                    + Add Item
                  </button>
                </div>

                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>{selectedCategory.title}</h1>
                  <p className="muted" style={{ fontSize: '0.88rem', margin: 0 }}>Detailed view of evaluation items for this module.</p>
                </div>

                {/* Add Item form */}
                {showAddItemForm && (
                  <div className="card" style={{ border: '1.5px solid var(--primary)', background: '#ffffff' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px' }}>Add Criteria Item to {selectedCategory.category}</h3>
                    <form onSubmit={handleCreateCriteriaItem} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div className="form-group">
                        <label className="form-label">Item Title</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="e.g. Workshop Organized"
                          value={newItemTitle}
                          onChange={(e) => setNewItemTitle(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Type</label>
                        <select
                          className="select"
                          value={newItemType}
                          onChange={(e) => setNewItemType(e.target.value)}
                        >
                          <option value="Count Based">Count Based</option>
                          <option value="Fixed">Fixed</option>
                          <option value="Range Based">Range Based</option>
                          <option value="Negative Marks">Negative Marks</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Marks / Value</label>
                        <input
                          type="number"
                          className="input"
                          value={newItemMarks}
                          onChange={(e) => setNewItemMarks(Number(e.target.value))}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Description Details (e.g. penalty per count x -2)</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="e.g. per count x 5"
                          value={newItemDetails}
                          onChange={(e) => setNewItemDetails(e.target.value)}
                          required
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" className="btn btn-primary btn-sm">Save Item</button>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddItemForm(false)}>Cancel</button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Items list card */}
                <div className="card">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {((criteriaCatalog.find(c => c.id === selectedCategory.id)?.items) || []).map((item: any) => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingBottom: '16px',
                          borderBottom: '1px solid var(--glass-border)'
                        }}
                      >
                        <div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>{item.title}</h3>
                          <p className="muted" style={{ fontSize: '0.8rem', margin: '0 0 4px 0' }}>
                            Type: {item.type} | Marks: {item.marks} {item.type === 'Count Based' ? '/ count' : ''}
                          </p>
                          <p className="muted" style={{ fontSize: '0.78rem', margin: 0, fontWeight: 600 }}>{item.details}</p>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ fontWeight: 700 }}
                            onClick={() => handleEditCriteriaItemPrompt(selectedCategory.id, item.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm"
                            style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', fontWeight: 700 }}
                            onClick={() => handleDeleteCriteriaItem(selectedCategory.id, item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                    {((criteriaCatalog.find(c => c.id === selectedCategory.id)?.items) || []).length === 0 && (
                      <p className="muted" style={{ fontSize: '0.88rem', textAlign: 'center', padding: '20px' }}>No evaluation items added to this module yet.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="admin-header-row">
                  <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Criteria Categories</h1>
                    <p className="muted" style={{ fontSize: '0.88rem' }}>Manage and organize evaluation criteria hierarchies.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <select
                      className="select"
                      style={{ width: '150px' }}
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                    >
                      <option value="2025-2026">2025-2026</option>
                      <option value="2024-2025">2024-2025</option>
                    </select>
                    <button
                      className="btn"
                      style={{ background: '#f97316', color: '#ffffff', fontWeight: 700 }}
                      onClick={handleAddCategory}
                    >
                      + Add Category
                    </button>
                  </div>
                </div>

                {/* Criteria Grid */}
                <div className="criteria-grid-wrapper">
                  {criteriaCatalog.map((c) => (
                    <div
                      key={c.id}
                      className="card"
                      style={{
                        padding: '20px 24px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        border: '1.5px solid var(--glass-border)',
                        boxShadow: 'none',
                        borderRadius: '14px',
                        minHeight: '140px',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedCategory(c)}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '1.5rem' }}>⚡</span>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                className="btn btn-sm"
                                style={{ background: 'transparent', color: '#ef4444', border: 'none', padding: 0 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm('Delete this category?')) {
                                    deleteCriteriaCategory(c.id);
                                  }
                                }}
                            >
                                Delete
                            </button>
                            <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}>&rarr;</span>
                          </div>
                        </div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 6px 0', color: '#0f172a' }}>{c.category}</h3>
                        <p className="muted" style={{ fontSize: '0.8rem', margin: 0, lineHeight: 1.4 }}>{(c as any).desc || 'No description provided.'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: USER MANAGEMENT                               */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>User Management</h1>
              <p className="muted" style={{ fontSize: '0.88rem' }}>Manage users, approvals, and quick CSV upload.</p>
            </div>

            {/* Action Buttons Top Bar */}
            <div className="admin-actions-bar">
              <button
                className="btn"
                style={{ background: '#f97316', color: '#ffffff', fontWeight: 700 }}
                onClick={handleAddUserPrompt}
              >
                Add User
              </button>
              <button className="btn btn-secondary" onClick={() => alert('Simulated CSV import file picker')}>
                Upload CSV
              </button>
              <button className="btn btn-secondary" onClick={() => alert('Downloading user template CSV...')}>
                Download Sample
              </button>
            </div>

            {/* User Filters List */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>Hierarchy View</h3>
              <div className="filters-grid">
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>Search</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Search name, category"
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setUserPage(1);
                    }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>Department</label>
                  <select
                    className="select"
                    value={deptFilter}
                    onChange={(e) => {
                      setDeptFilter(e.target.value);
                      setUserPage(1);
                    }}
                  >
                    <option value="All Departments">All Departments</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Commerce">Commerce</option>
                    <option value="The Under-Graduate Department of Computer Applications">The Under-Graduate Department of Computer Applications</option>
                    <option value="The Post-Graduate Department of Computer Applications">The Post-Graduate Department of Computer Applications</option>
                    <option value="Business Administration">Business Administration</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>Class</label>
                  <select
                    className="select"
                    value={classFilter}
                    onChange={(e) => {
                      setClassFilter(e.target.value);
                      setUserPage(1);
                    }}
                  >
                    <option value="All Classes">All Classes</option>
                    <option value="BSc Math B">BSc Math B</option>
                    <option value="BCom A">BCom A</option>
                    <option value="BCom B">BCom B</option>
                    <option value="BCom C">BCom C</option>
                    <option value="BCA A">BCA A</option>
                    <option value="BBA A">BBA A</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>Role</label>
                  <select
                    className="select"
                    value={roleFilter}
                    onChange={(e) => {
                      setRoleFilter(e.target.value);
                      setUserPage(1);
                    }}
                  >
                    <option value="All Roles">All Roles</option>
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                    <option value="IQAC">IQAC</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>Status</label>
                  <select
                    className="select"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setUserPage(1);
                    }}
                  >
                    <option value="All Statuses">All Statuses</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Department</th>
                      <th>Class</th>
                      <th>Approval</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((u) => (
                      <tr key={u.id}>
                        <td style={{ fontWeight: 700 }}>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.role}</td>
                        <td>{u.department}</td>
                        <td>{u.className}</td>
                        <td>
                          <span className="badge badge-verified">{u.approval}</span>
                        </td>
                        <td style={{ display: 'flex', gap: '6px' }}>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => alert(`Editing user: ${u.name}`)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm"
                            style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', fontWeight: 700 }}
                            onClick={() => alert('Role delete action is currently blocked.')}
                          >
                            Delete Blocked
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* User Pagination */}
              <div className="pagination-container">
                <button
                  className="pagination-btn"
                  disabled={userPage <= 1}
                  onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </button>
                {Array.from({ length: totalUserPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`pagination-num ${userPage === pageNum ? 'active' : ''}`}
                    onClick={() => setUserPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  className="pagination-btn"
                  disabled={userPage >= totalUserPages}
                  onClick={() => setUserPage((p) => Math.min(totalUserPages, p + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 4: DEPARTMENT MANAGEMENT                         */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'departments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Department Management</h1>
              <p className="muted" style={{ fontSize: '0.88rem' }}>Manage departments and their associated classes.</p>
            </div>

            {/* Add Department Form */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>Add Department</h3>
              <form onSubmit={handleAddDept} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Department Name</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Computer Science"
                    value={newDeptInput}
                    onChange={(e) => setNewDeptInput(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn" style={{ background: '#f97316', color: '#ffffff', fontWeight: 700, width: 'fit-content' }}>
                  Add Department
                </button>
              </form>
            </div>

            {/* Departments & Classes List */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>Departments & Classes</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {deptsList.map((d) => (
                  <div
                    key={d.name}
                    style={{
                      padding: '20px',
                      border: '1.5px solid var(--glass-border)',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{d.name}</h4>
                      <button
                        className="btn btn-sm"
                        style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', fontWeight: 700 }}
                        onClick={() => handleDeleteDept(d.name)}
                      >
                        Delete Dept
                      </button>
                    </div>

                     {/* Classes & Roles Mappings List */}
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                       {d.classes.map((className) => {
                         const classObj = classes.find((c) => c.name === className);

                         const classTeachersGroup = (userGroups || []).find(
                           (g) => g.name === 'Class Teachers Council' || g.id === 'grp-class-teachers'
                         );
                         const studentRepsGroup = (userGroups || []).find(
                           (g) => g.name === 'Student Representatives' || g.id === 'grp-student-reps'
                         );

                         // All Faculty/Teacher Users (Excluding those assigned to ANOTHER class)
                         const availableFaculty = users.filter((u) => {
                           const isTeacherRole = u.role === 'teacher' || u.role === 'faculty';
                           if (!isTeacherRole) return false;

                           // Exclusivity constraint: allow current assigned advisor for this class, exclude assigned to another class
                           const isAssignedToOtherClass = classes.some(
                             (c) => c.name !== className && c.classTeacher?.toLowerCase().trim() === u.email.toLowerCase().trim()
                           );
                           return !isAssignedToOtherClass;
                         }).sort((a, b) => {
                           const aInGroup = classTeachersGroup?.emails.some((e) => e.toLowerCase().trim() === a.email.toLowerCase().trim());
                           const bInGroup = classTeachersGroup?.emails.some((e) => e.toLowerCase().trim() === b.email.toLowerCase().trim());
                           if (aInGroup && !bInGroup) return -1;
                           if (!aInGroup && bInGroup) return 1;
                           return a.name.localeCompare(b.name);
                         });

                         // All Students belonging to class (Excluding those assigned as DQC Rep to ANOTHER class)
                         const availableStudentReps = users.filter((u) => {
                           const isStudentRole = u.role === 'student';
                           if (!isStudentRole) return false;

                           // Exclusivity constraint: allow current assigned DQC rep for this class, exclude assigned to another class
                           const isAssignedToOtherClass = classes.some(
                             (c) => c.name !== className && c.dqcMember?.toLowerCase().trim() === u.email.toLowerCase().trim()
                           );
                           if (isAssignedToOtherClass) return false;

                           // Class Match OR Email Series Verification
                           if (u.className && u.className.toLowerCase().trim() === className.toLowerCase().trim()) {
                             return true;
                           }

                           const email = (u.email || '').toLowerCase().trim();
                           const localPart = email.split('@')[0] || '';
                           const cleanClass = className.toLowerCase().trim();

                           if (cleanClass.includes('mca')) return localPart.includes('pmc') || localPart.includes('mc') || localPart.includes('mca');
                           if (cleanClass.includes('bca')) return localPart.includes('ubc') || localPart.includes('bc') || localPart.includes('bca');
                           if (cleanClass.includes('bsc') || cleanClass.includes('cs')) return localPart.includes('bsc') || localPart.includes('cs');

                           return true;
                         }).sort((a, b) => {
                           const aInGroup = studentRepsGroup?.emails.some((e) => e.toLowerCase().trim() === a.email.toLowerCase().trim()) || a.isStudentRep;
                           const bInGroup = studentRepsGroup?.emails.some((e) => e.toLowerCase().trim() === b.email.toLowerCase().trim()) || b.isStudentRep;
                           if (aInGroup && !bInGroup) return -1;
                           if (!aInGroup && bInGroup) return 1;
                           return a.name.localeCompare(b.name);
                         });

                         return (
                           <div
                             key={className}
                             className="class-advisor-mapping-row"
                           >
                             <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e293b' }}>{className}</span>

                             {/* Class Teacher Select */}
                             <div className="mapping-select-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                               <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b' }}>CLASS ADVISOR (FACULTY)</span>
                               <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                 <select
                                   value={pendingClassTeachers[className] !== undefined ? pendingClassTeachers[className] : (classObj?.classTeacher || '')}
                                   onChange={(e) => setPendingClassTeachers(prev => ({ ...prev, [className]: e.target.value }))}
                                   style={{
                                     padding: '6px 10px',
                                     fontSize: '0.8rem',
                                     borderRadius: '6px',
                                     border: '1px solid #cbd5e1',
                                     background: '#ffffff',
                                     color: '#334155',
                                     fontWeight: 600,
                                     flex: 1
                                   }}
                                 >
                                   <option value="">Select Teacher (Class Advisor)</option>
                                   {availableFaculty.map((u) => {
                                     const isCouncilMember = classTeachersGroup?.emails.some((e) => e.toLowerCase().trim() === u.email.toLowerCase().trim());
                                     return (
                                       <option key={u.email} value={u.email}>
                                         {isCouncilMember ? '⭐ [Council] ' : ''}{u.name} ({u.email})
                                       </option>
                                     );
                                   })}
                                 </select>
                                 
                                 {pendingClassTeachers[className] !== undefined && pendingClassTeachers[className] !== (classObj?.classTeacher || '') && (
                                   <button
                                     className="btn btn-sm btn-primary"
                                     onClick={() => {
                                       updateClassMapping(className, pendingClassTeachers[className], classObj?.dqcMember || '');
                                       setPendingClassTeachers(prev => {
                                         const next = { ...prev };
                                         delete next[className];
                                         return next;
                                       });
                                     }}
                                   >
                                     Confirm
                                   </button>
                                 )}
                               </div>
                             </div>
                           </div>
                         );
                       })}
                       {d.classes.length === 0 && (
                         <span className="muted" style={{ fontSize: '0.8rem' }}>No classes associated yet.</span>
                       )}
                     </div>

                    {/* Add Class Inner Form */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                      <input
                        type="text"
                        className="input"
                        style={{ maxWidth: '200px', height: '36px', padding: '0 12px' }}
                        placeholder="New Class"
                        value={newClassInputs[d.name] || ''}
                        onChange={(e) =>
                          setNewClassInputs((prev) => ({
                            ...prev,
                            [d.name]: e.target.value
                          }))
                        }
                      />
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleAddClass(d.name)}
                      >
                        Add Class
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 5: SETTINGS                                      */}
        {/* ---------------------------------------------------- */}
        {/* TAB 5: SYSTEM SETTINGS                               */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Settings</h1>
              <p className="muted" style={{ fontSize: '0.88rem' }}>Manage submission status, evaluation access, time windows, and active academic year.</p>
            </div>

            {/* Split Status Toggles row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 6px 0' }}>Submission Status</h3>
                  <p className="muted" style={{ fontSize: '0.8rem', margin: 0 }}>Accept new claims from students system-wide.</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  {submissionOpen ? (
                    <span className="badge badge-verified">ON</span>
                  ) : (
                    <span className="badge badge-correction">OFF</span>
                  )}
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setConfirmSubmissionModal(true)}
                  >
                    Toggle Submission ({submissionOpen ? 'ON' : 'OFF'})
                  </button>
                </div>
              </div>

              <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 6px 0' }}>Evaluation Status</h3>
                  <p className="muted" style={{ fontSize: '0.8rem', margin: 0 }}>Permit class advisors and evaluators to score claims.</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  {evaluationOpen ? (
                    <span className="badge badge-verified">ON</span>
                  ) : (
                    <span className="badge badge-correction">OFF</span>
                  )}
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setConfirmEvaluationModal(true)}
                  >
                    Toggle Evaluation ({evaluationOpen ? 'ON' : 'OFF'})
                  </button>
                </div>
              </div>
            </div>

            {/* Submission Time Window Card */}
            <div className="card">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px' }}>📅 Submission Time Window</h3>
              <p className="muted" style={{ fontSize: '0.82rem', marginBottom: '20px' }}>
                Set the start and end date/time for the submission period. Students can only submit claims within this window.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    className="input"
                    value={startTimeWindow}
                    onChange={(e) => setStartTimeWindow(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date & Time</label>
                  <input
                    type="datetime-local"
                    className="input"
                    value={endTimeWindow}
                    onChange={(e) => setEndTimeWindow(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="btn"
                  style={{ background: '#f97316', color: '#ffffff', fontWeight: 700 }}
                  onClick={() => {
                    setSubmissionWindow(startTimeWindow, endTimeWindow);
                    alert(`Submission window saved: ${startTimeWindow || 'Immediately'} to ${endTimeWindow || 'Open'}`);
                  }}
                >
                  Save Time Window
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setStartTimeWindow('');
                    setEndTimeWindow('');
                    setSubmissionWindow('', '');
                    alert('Submission time window cleared.');
                  }}
                >
                  Clear Time Window
                </button>
              </div>
            </div>

            {/* Bottom Row Academic Year Info */}
            <div className="card">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px' }}>Academic Year</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700, margin: '0 0 6px 0' }}>
                Active Year: {globalActiveYear || '2025-2026'}
              </p>
              <p className="muted" style={{ fontSize: '0.8rem', margin: 0 }}>
                Manage academic years in the Academic Years module. Changing the active academic year updates the active year system-wide.
              </p>
            </div>
            {/* Confirmation Modal for Submission Status */}
            {confirmSubmissionModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(4px)',
                zIndex: 99999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}>
                <div className="card" style={{
                  maxWidth: '480px',
                  width: '100%',
                  padding: '28px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
                  borderRadius: '16px',
                  background: '#ffffff',
                  border: '1px solid rgba(15, 23, 42, 0.12)',
                  animation: 'fadeIn 0.2s ease-out'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: submissionOpen ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: submissionOpen ? '#ef4444' : '#16a34a',
                      fontWeight: 800,
                      fontSize: '1.2rem'
                    }}>
                      ⚠️
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                        Confirm Submission Status Change
                      </h3>
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                        Admin authorization required
                      </p>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.5, marginBottom: '20px' }}>
                    {submissionOpen ? (
                      <>Are you sure you want to turn <strong style={{ color: '#ef4444' }}>OFF</strong> system-wide submissions? Students will be blocked from submitting new activity claims until re-opened.</>
                    ) : (
                      <>Are you sure you want to turn <strong style={{ color: '#16a34a' }}>ON</strong> system-wide submissions? Students will be able to submit new activity claims.</>
                    )}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#f8fafc',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    marginBottom: '24px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Status Transition:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge ${submissionOpen ? 'badge-verified' : 'badge-correction'}`}>
                        {submissionOpen ? 'ON' : 'OFF'}
                      </span>
                      <span style={{ color: '#94a3b8', fontWeight: 700 }}>➔</span>
                      <span className={`badge ${!submissionOpen ? 'badge-verified' : 'badge-correction'}`}>
                        {!submissionOpen ? 'ON' : 'OFF'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setConfirmSubmissionModal(false)}
                      style={{ fontWeight: 600 }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn"
                      style={{
                        background: submissionOpen ? '#dc2626' : '#16a34a',
                        color: '#ffffff',
                        fontWeight: 700
                      }}
                      onClick={() => {
                        toggleSubmissionOpen();
                        setConfirmSubmissionModal(false);
                      }}
                    >
                      Confirm & Update Status
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation Modal for Evaluation Status */}
            {confirmEvaluationModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(4px)',
                zIndex: 99999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}>
                <div className="card" style={{
                  maxWidth: '480px',
                  width: '100%',
                  padding: '28px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
                  borderRadius: '16px',
                  background: '#ffffff',
                  border: '1px solid rgba(15, 23, 42, 0.12)',
                  animation: 'fadeIn 0.2s ease-out'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: evaluationOpen ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: evaluationOpen ? '#ef4444' : '#16a34a',
                      fontWeight: 800,
                      fontSize: '1.2rem'
                    }}>
                      ⚠️
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                        Confirm Evaluation Status Change
                      </h3>
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                        Admin authorization required
                      </p>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.5, marginBottom: '20px' }}>
                    {evaluationOpen ? (
                      <>Are you sure you want to turn <strong style={{ color: '#ef4444' }}>OFF</strong> evaluation access? Class advisors and evaluators will be restricted from scoring claims.</>
                    ) : (
                      <>Are you sure you want to turn <strong style={{ color: '#16a34a' }}>ON</strong> evaluation access? Class advisors and evaluators will be allowed to score student claims.</>
                    )}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#f8fafc',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    marginBottom: '24px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Status Transition:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge ${evaluationOpen ? 'badge-verified' : 'badge-correction'}`}>
                        {evaluationOpen ? 'ON' : 'OFF'}
                      </span>
                      <span style={{ color: '#94a3b8', fontWeight: 700 }}>➔</span>
                      <span className={`badge ${!evaluationOpen ? 'badge-verified' : 'badge-correction'}`}>
                        {!evaluationOpen ? 'ON' : 'OFF'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setConfirmEvaluationModal(false)}
                      style={{ fontWeight: 600 }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn"
                      style={{
                        background: evaluationOpen ? '#dc2626' : '#16a34a',
                        color: '#ffffff',
                        fontWeight: 700
                      }}
                      onClick={() => {
                        toggleEvaluationOpen();
                        setConfirmEvaluationModal(false);
                      }}
                    >
                      Confirm & Update Status
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
