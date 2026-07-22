'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';

interface AdminWorkspaceProps {
  view?: 'years' | 'criteria' | 'users' | 'departments' | 'settings';
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

  // ----------------------------------------------------
  // DATASET 1: ACADEMIC YEARS
  // ----------------------------------------------------
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([
    { year: '2025-2026', status: 'Active' },
    { year: '2024-2025', status: 'Inactive' },
    { year: '2023-2024', status: 'Inactive' }
  ]);
  const [newYearInput, setNewYearInput] = useState('');

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
    setAcademicYears((prev) => [...prev, { year: newYearInput.trim(), status: 'Inactive' }]);
    setNewYearInput('');
  };

  const handleSetActiveYear = (targetYear: string) => {
    setAcademicYears((prev) =>
      prev.map((y) => ({
        ...y,
        status: y.year === targetYear ? 'Active' : 'Inactive'
      }))
    );
  };

  // ----------------------------------------------------
  // DATASET 2: CRITERIA MANAGEMENT
  // ----------------------------------------------------
  const [criteriaCategories, setCriteriaCategories] = useState<CriteriaCategory[]>([
    { id: '1', title: 'Academics', desc: 'Criteria related to academic performance and coursework.', icon: '🎓' },
    { id: '2', title: 'Online Courses', desc: 'Certifications and modules from online learning platforms.', icon: '💻' },
    { id: '3', title: 'Internships', desc: 'Evaluations for external placements and practical experience.', icon: '💼' },
    { id: '4', title: 'Competitive Exams', desc: 'Performance in state, national, and international exams.', icon: '📝' },
    { id: '5', title: 'Scholarships', desc: 'Recognition and financial support for merit or need.', icon: '💰' },
    { id: '6', title: 'Research', desc: 'Criteria for methodology, publications, and lab work.', icon: '🧪' },
    { id: '7', title: 'Prizes', desc: 'Awards and honors won in various competitions.', icon: '🏆' },
    { id: '8', title: 'Leadership', desc: 'Roles in student bodies, clubs, and organizations.', icon: '🤝' },
    { id: '9', title: 'Programs Organized', desc: 'Management and coordination of various events.', icon: '📅' },
    { id: '10', title: 'Social Responsibility', desc: 'Participation in NSS, NCC, and community service.', icon: '🌏' },
    { id: '11', title: 'Career Advancement', desc: 'Placement success and higher studies preparation.', icon: '🚀' },
    { id: '12', title: 'Documentation', desc: 'Submission quality and verification proofs.', icon: '📁' }
  ]);

  const [selectedYear, setSelectedYear] = useState('2025-2026');

  // Criteria Items detailed view states
  const [selectedCategory, setSelectedCategory] = useState<CriteriaCategory | null>(null);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemType, setNewItemType] = useState('Count Based');
  const [newItemMarks, setNewItemMarks] = useState(5);
  const [newItemDetails, setNewItemDetails] = useState('');

  interface CriteriaItemDetail {
    id: string;
    title: string;
    type: string;
    marks: number;
    details: string;
  }

  const [criteriaItemsMap, setCriteriaItemsMap] = useState<Record<string, CriteriaItemDetail[]>>({
    '1': [ // Academics
      { id: '1-1', title: 'S Grade Course', type: 'Count Based', marks: 5, details: 'per count x 5' },
      { id: '1-2', title: 'A+ Grade Course', type: 'Count Based', marks: 3, details: 'per count x 3' },
      { id: '1-3', title: 'A Grade Course', type: 'Count Based', marks: 1, details: 'per count x 1' },
      { id: '1-4', title: 'Failed Course', type: 'Negative Marks', marks: 0, details: 'penalty per count x -2' },
      { id: '1-5', title: 'Class Pass Percentage', type: 'Range Based', marks: 20, details: '95-100:20, 90-94.99:15, 85-89.99:10, 80-84.99:5' }
    ],
    '2': [ // Online Courses
      { id: '2-1', title: 'NPTEL Course Completed', type: 'Count Based', marks: 10, details: 'per count x 10' },
      { id: '2-2', title: 'MOOC Course Completed', type: 'Count Based', marks: 5, details: 'per count x 5' },
      { id: '2-3', title: 'Other Recognized Online Course', type: 'Count Based', marks: 3, details: 'per count x 3' }
    ],
    '3': [ // Internships
      { id: '3-1', title: 'Offline Internship', type: 'Count Based', marks: 5, details: 'per count x 5' },
      { id: '3-2', title: 'Online Internship', type: 'Count Based', marks: 3, details: 'per count x 3' }
    ],
    '4': [ // Competitive Exams
      { id: '4-1', title: 'JRF Qualified', type: 'Fixed', marks: 20, details: 'fixed: 20' },
      { id: '4-2', title: 'NET Qualified', type: 'Fixed', marks: 10, details: 'fixed: 10' },
      { id: '4-3', title: 'SET Qualified', type: 'Fixed', marks: 5, details: 'fixed: 5' }
    ],
    '5': [ // Scholarships
      { id: '5-1', title: 'International Scholarship', type: 'Fixed', marks: 20, details: 'fixed: 20' },
      { id: '5-2', title: 'National Scholarship', type: 'Fixed', marks: 10, details: 'fixed: 10' },
      { id: '5-3', title: 'State Scholarship', type: 'Fixed', marks: 5, details: 'fixed: 5' }
    ],
    '6': [ // Research
      { id: '6-1', title: 'Research Publication', type: 'Count Based', marks: 15, details: 'per count x 15' },
      { id: '6-2', title: 'Patent Filed or Published', type: 'Count Based', marks: 20, details: 'per count x 20' },
      { id: '6-3', title: 'Funded or Approved Student Project', type: 'Count Based', marks: 10, details: 'per count x 10' }
    ],
    '7': [ // Prizes
      { id: '7-1', title: 'Outside College Individual First Prize', type: 'Count Based', marks: 10, details: 'per count x 10' },
      { id: '7-2', title: 'Outside College Individual Second Prize', type: 'Count Based', marks: 8, details: 'per count x 8' },
      { id: '7-3', title: 'Outside College Individual Third Prize', type: 'Count Based', marks: 5, details: 'per count x 5' },
      { id: '7-4', title: 'Outside College Group First Prize', type: 'Count Based', marks: 6, details: 'per count x 6' },
      { id: '7-5', title: 'Outside College Group Second Prize', type: 'Count Based', marks: 4, details: 'per count x 4' },
      { id: '7-6', title: 'Outside College Group Third Prize', type: 'Count Based', marks: 3, details: 'per count x 3' },
      { id: '7-7', title: 'Inside College Individual First Prize', type: 'Count Based', marks: 5, details: 'per count x 5' },
      { id: '7-8', title: 'Inside College Individual Second Prize', type: 'Count Based', marks: 3, details: 'per count x 3' },
      { id: '7-9', title: 'Inside College Individual Third Prize', type: 'Count Based', marks: 2, details: 'per count x 2' },
      { id: '7-10', title: 'Inside College Group First Prize', type: 'Count Based', marks: 3, details: 'per count x 3' },
      { id: '7-11', title: 'Inside College Group Second Prize', type: 'Count Based', marks: 2, details: 'per count x 2' },
      { id: '7-12', title: 'Inside College Group Third Prize', type: 'Count Based', marks: 1, details: 'per count x 1' }
    ],
    '8': [ // Leadership
      { id: '8-1', title: 'Class Representative', type: 'Fixed', marks: 10, details: 'fixed: 10' },
      { id: '8-2', title: 'Association or Club Office Bearer', type: 'Fixed', marks: 8, details: 'fixed: 8' },
      { id: '8-3', title: 'Event Coordinator Role', type: 'Count Based', marks: 5, details: 'per count x 5' }
    ],
    '9': [ // Programs Organized
      { id: '9-1', title: 'Department Level Program Organized', type: 'Count Based', marks: 5, details: 'per count x 5' },
      { id: '9-2', title: 'Interdepartment Program Organized', type: 'Count Based', marks: 8, details: 'per count x 8' },
      { id: '9-3', title: 'State or National Level Program Organized', type: 'Count Based', marks: 15, details: 'per count x 15' }
    ],
    '10': [ // Social Responsibility
      { id: '10-1', title: 'NSS/NCC/Service Activity Participation', type: 'Count Based', marks: 5, details: 'per count x 5' },
      { id: '10-2', title: 'Community Outreach Activity', type: 'Count Based', marks: 3, details: 'per count x 3' },
      { id: '10-3', title: 'Blood Donation or Health Camp Participation', type: 'Count Based', marks: 2, details: 'per count x 2' }
    ],
    '11': [ // Career Advancement
      { id: '11-1', title: 'Placement Offer Received', type: 'Fixed', marks: 20, details: 'fixed: 20' },
      { id: '11-2', title: 'Higher Studies Admission Secured', type: 'Fixed', marks: 15, details: 'fixed: 15' },
      { id: '11-3', title: 'Professional Certification Completed', type: 'Count Based', marks: 8, details: 'per count x 8' },
      { id: '11-4', title: 'Career Workshop Participation', type: 'Count Based', marks: 2, details: 'per count x 2' }
    ],
    '12': [ // Documentation
      { id: '12-1', title: 'Complete Best Class File Submitted', type: 'Fixed', marks: 10, details: 'fixed: 10' },
      { id: '12-2', title: 'Valid Proof Uploaded for All Claims', type: 'Fixed', marks: 5, details: 'fixed: 5' },
      { id: '12-3', title: 'Late or Incomplete Documentation', type: 'Negative Marks', marks: 0, details: 'penalty per count x -5' }
    ]
  });

  const handleAddCategory = () => {
    const title = prompt('Enter Category Name:');
    if (!title) return;
    const desc = prompt('Enter Category Description:') || 'Custom category description.';
    const id = (criteriaCategories.length + 1).toString();
    setCriteriaCategories((prev) => [...prev, { id, title, desc, icon: '⚡' }]);
  };

  const handleCreateCriteriaItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !newItemTitle.trim()) return;

    const newItem: CriteriaItemDetail = {
      id: `${selectedCategory.id}-${Date.now()}`,
      title: newItemTitle.trim(),
      type: newItemType,
      marks: newItemMarks,
      details: newItemDetails.trim()
    };

    setCriteriaItemsMap((prev) => ({
      ...prev,
      [selectedCategory.id]: [...(prev[selectedCategory.id] || []), newItem]
    }));

    setNewItemTitle('');
    setNewItemDetails('');
    setShowAddItemForm(false);
  };

  const handleDeleteCriteriaItem = (catId: string, itemId: string) => {
    if (window.confirm('Are you sure you want to delete this evaluation item?')) {
      setCriteriaItemsMap((prev) => ({
        ...prev,
        [catId]: (prev[catId] || []).filter((item) => item.id !== itemId)
      }));
    }
  };

  const handleEditCriteriaItemPrompt = (catId: string, itemId: string) => {
    const items = criteriaItemsMap[catId] || [];
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    const newTitle = prompt('Edit Title:', item.title);
    if (newTitle === null) return;
    const newMarksStr = prompt('Edit Marks:', item.marks.toString());
    if (newMarksStr === null) return;
    const newDetails = prompt('Edit Details:', item.details);
    if (newDetails === null) return;

    setCriteriaItemsMap((prev) => ({
      ...prev,
      [catId]: (prev[catId] || []).map((i) =>
        i.id === itemId
          ? { ...i, title: newTitle || i.title, marks: Number(newMarksStr) || 0, details: newDetails || i.details }
          : i
      )
    }));
  };

  // ----------------------------------------------------
  // DATASET 3: USER MANAGEMENT
  // ----------------------------------------------------
  const [usersList, setUsersList] = useState<AdminUser[]>([
    { id: 1, name: 'Aarav Bose', email: 'aarav.bose@college.edu', role: 'Student', department: 'Mathematics', className: 'BSc Math B', approval: 'Approved' },
    { id: 2, name: 'Aarav Chauhan', email: 'aarav.chauhan@college.edu', role: 'Student', department: 'Mathematics', className: 'BSc Math B', approval: 'Approved' },
    { id: 3, name: 'Aarav Das', email: 'aarav.das@college.edu', role: 'Student', department: 'Commerce', className: 'BCom A', approval: 'Approved' },
    { id: 4, name: 'Aarav Gupta', email: 'aarav.gupta@college.edu', role: 'Student', department: 'Commerce', className: 'BCom C', approval: 'Approved' },
    { id: 5, name: 'Aarav Iyer', email: 'aarav.iyer@college.edu', role: 'Student', department: 'Computer Applications', className: 'BCA A', approval: 'Approved' },
    { id: 6, name: 'Aarav Jain', email: 'aarav.jain@college.edu', role: 'Student', department: 'Business Administration', className: 'BBA A', approval: 'Approved' },
    { id: 7, name: 'Aarav Joseph', email: 'aarav.joseph@college.edu', role: 'Student', department: 'Commerce', className: 'BCom B', approval: 'Approved' }
  ]);

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
    const matchesRole = roleFilter === 'All Roles' || u.role === roleFilter;
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
    const role = prompt('Enter Role (Student / Teacher / HOD / IQAC / Admin):') || 'Student';
    const department = prompt('Enter Department:') || 'Computer Science';
    const className = prompt('Enter Class Name:') || 'BSc CS A';

    const newUser: AdminUser = {
      id: Date.now(),
      name,
      email,
      role,
      department,
      className,
      approval: 'Approved'
    };

    setUsersList((prev) => [...prev, newUser]);
  };

  // ----------------------------------------------------
  // DATASET 4: DEPARTMENT MANAGEMENT
  // ----------------------------------------------------
  const [deptsList, setDeptsList] = useState<AdminDept[]>([
    { name: 'Administration', classes: [] },
    { name: 'Business Administration', classes: ['BBA A', 'BBA B'] },
    { name: 'Commerce', classes: ['BCom A', 'BCom B', 'BCom C'] },
    { name: 'Computer Applications', classes: ['BCA A'] },
    { name: 'Computer Science', classes: ['BSc CS A', 'BSc CS B'] },
    { name: 'Economics', classes: ['BA Economics A'] }
  ]);

  const [newDeptInput, setNewDeptInput] = useState('');
  const [newClassInputs, setNewClassInputs] = useState<Record<string, string>>({});

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptInput.trim()) return;
    const exists = deptsList.some((d) => d.name.toLowerCase() === newDeptInput.trim().toLowerCase());
    if (exists) {
      alert('This department already exists.');
      return;
    }
    setDeptsList((prev) => [...prev, { name: newDeptInput.trim(), classes: [] }]);
    setNewDeptInput('');
  };

  const handleDeleteDept = (deptName: string) => {
    setDeptsList((prev) => prev.filter((d) => d.name !== deptName));
  };

  const handleAddClass = (deptName: string) => {
    const classVal = newClassInputs[deptName]?.trim();
    if (!classVal) return;

    setDeptsList((prev) =>
      prev.map((d) => {
        if (d.name === deptName) {
          const exists = d.classes.some((c) => c.toLowerCase() === classVal.toLowerCase());
          if (exists) {
            alert('Class already exists in this department.');
            return d;
          }
          return {
            ...d,
            classes: [...d.classes, classVal]
          };
        }
        return d;
      })
    );

    setNewClassInputs((prev) => ({
      ...prev,
      [deptName]: ''
    }));
  };

  // ----------------------------------------------------
  // DATASET 5: SETTINGS
  // ----------------------------------------------------
  const [submissionStatus, setSubmissionStatus] = useState(true);
  const [evaluationStatus, setEvaluationStatus] = useState(true);
  const [startTimeWindow, setStartTimeWindow] = useState('');
  const [endTimeWindow, setEndTimeWindow] = useState('');

  const handleResetDemoData = () => {
    if (window.confirm('Are you sure you want to restore all seed demo data?')) {
      alert('Demo data reset successfully.');
      window.location.reload();
    }
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
        {/* TAB 1: ACADEMIC YEARS                                */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'years' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Academic Year Management</h1>
              <p className="muted" style={{ fontSize: '0.88rem' }}>Add new academic years and activate the current session.</p>
            </div>

            {/* Add Academic Year Form Card */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>Add Academic Year</h3>
              <form onSubmit={handleAddYear} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Year Format (e.g. 2026-2027)</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="YYYY-YYYY"
                    value={newYearInput}
                    onChange={(e) => setNewYearInput(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn" style={{ background: '#f97316', color: '#ffffff', fontWeight: 700, width: 'fit-content' }}>
                  Add Year
                </button>
              </form>
            </div>

            {/* Academic Years List Card */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>Academic Years List</h3>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Academic Year</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {academicYears.map((y) => (
                      <tr key={y.year}>
                        <td style={{ fontWeight: 700 }}>{y.year}</td>
                        <td>
                          {y.status === 'Active' ? (
                            <span className="badge badge-verified">Active</span>
                          ) : (
                            <span className="badge badge-correction">Inactive</span>
                          )}
                        </td>
                        <td>
                          {y.status === 'Active' ? (
                            <button className="btn btn-secondary btn-sm" disabled style={{ opacity: 0.6 }}>
                              Currently Active
                            </button>
                          ) : (
                            <button
                              className="btn btn-sm"
                              style={{ background: '#f97316', color: '#ffffff', fontWeight: 700 }}
                              onClick={() => handleSetActiveYear(y.year)}
                            >
                              Set Active
                            </button>
                          )}
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
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px' }}>Add Criteria Item to {selectedCategory.title}</h3>
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
                    {(criteriaItemsMap[selectedCategory.id] || []).map((item) => (
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
                    {(criteriaItemsMap[selectedCategory.id] || []).length === 0 && (
                      <p className="muted" style={{ fontSize: '0.88rem', textAlign: 'center', padding: '20px' }}>No evaluation items added to this module yet.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {criteriaCategories.map((c) => (
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
                          <span style={{ fontSize: '1.5rem' }}>{c.icon}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}>&rarr;</span>
                        </div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 6px 0', color: '#0f172a' }}>{c.title}</h3>
                        <p className="muted" style={{ fontSize: '0.8rem', margin: 0, lineHeight: 1.4 }}>{c.desc}</p>
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
            <div style={{ display: 'flex', gap: '12px' }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
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
                    <option value="Computer Applications">Computer Applications</option>
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

                    {/* Classes Tag List */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {d.classes.map((c) => (
                        <span
                          key={c}
                          style={{
                            padding: '6px 12px',
                            background: '#f1f5f9',
                            color: '#334155',
                            borderRadius: '8px',
                            fontSize: '0.82rem',
                            fontWeight: 700
                          }}
                        >
                          {c}
                        </span>
                      ))}
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
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Settings</h1>
              <p className="muted" style={{ fontSize: '0.88rem' }}>Control submission, evaluation, year selection, and demo reset.</p>
            </div>

            {/* Split Status Toggles row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 6px 0' }}>Submission Status</h3>
                  <p className="muted" style={{ fontSize: '0.8rem', margin: 0 }}>Accept new claims from students.</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  {submissionStatus ? (
                    <span className="badge badge-verified">ON</span>
                  ) : (
                    <span className="badge badge-correction">OFF</span>
                  )}
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSubmissionStatus(!submissionStatus)}
                  >
                    Toggle Submission
                  </button>
                </div>
              </div>

              <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 6px 0' }}>Evaluation Status</h3>
                  <p className="muted" style={{ fontSize: '0.8rem', margin: 0 }}>Permit teachers to score claims.</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  {evaluationStatus ? (
                    <span className="badge badge-verified">ON</span>
                  ) : (
                    <span className="badge badge-correction">OFF</span>
                  )}
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setEvaluationStatus(!evaluationStatus)}
                  >
                    Toggle Evaluation
                  </button>
                </div>
              </div>
            </div>

            {/* Submission Time Window Card */}
            <div className="card">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px' }}>📅 Submission Time Window</h3>
              <p className="muted" style={{ fontSize: '0.82rem', marginBottom: '20px' }}>
                Set the start and end date/time for the submission period. Students can only submit within this window.
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
                  onClick={() => alert(`Saved time window: ${startTimeWindow} to ${endTimeWindow}`)}
                >
                  Save Time Window
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setStartTimeWindow('');
                    setEndTimeWindow('');
                    alert('Time window cleared.');
                  }}
                >
                  Clear Time Window
                </button>
              </div>
            </div>

            {/* Bottom Row Academic Year & Reset Data */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '20px' }}>
              <div className="card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px' }}>Academic Year</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700, margin: '0 0 6px 0' }}>Active Year: 2025-2026</p>
                <p className="muted" style={{ fontSize: '0.8rem', margin: 0 }}>
                  Manage academic years in the Academic Years module.
                </p>
              </div>

              <div className="card" style={{ border: '1px solid #fca5a5' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px', color: '#dc2626' }}>Reset Demo Data</h3>
                <p className="muted" style={{ fontSize: '0.8rem', marginBottom: '16px' }}>
                  This restores criteria, users, submissions, years, and status toggles to initial seed data.
                </p>
                <button
                  className="btn"
                  style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', fontWeight: 700 }}
                  onClick={handleResetDemoData}
                >
                  Reset Demo Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
