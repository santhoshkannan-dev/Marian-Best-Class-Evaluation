'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Student, Submission } from '@/data/initialData';

interface TeacherWorkspaceProps {
  view?: 'dashboard' | 'verification' | 'student-management' | 'profile';
}

interface VerificationDocItem {
  id: number;
  fileName: string;
  studentName: string;
  activityTitle: string;
  category: string;
  description?: string;
  marks?: number;
  date?: string;
  eventId?: string;
  proofUrl?: string;
  subId?: number;
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
    currentUserInfo,
    classes
  } = useApp();

  const activeTab = view || activePage || 'dashboard';

  // ----------------------------------------------------
  // QUEUE, MODAL & TOAST STATE
  // ----------------------------------------------------
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [queueIndex, setQueueIndex] = useState(0);
  const [previewModalDoc, setPreviewModalDoc] = useState<VerificationDocItem | null>(null);
  const [modalRemarks, setModalRemarks] = useState('');
  const [submissionRemarksMap, setSubmissionRemarksMap] = useState<Record<number, string>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Verification Desk Search & Filter - DEFAULT TO 'pending'
  const [studentSearch, setStudentSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'completed' | 'all'>('pending');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [verificationPage, setVerificationPage] = useState(1);
  const verificationPageSize = 5;

  // Bulk Selection for Verification Desk
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);

  // Student Management Form States
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [studentManagementPage, setStudentManagementPage] = useState(1);
  const studentPageSize = 5;

  // CSV Bulk Upload
  const [csvFile, setCsvFile] = useState<string>('');

  // AI / Quick prompt search in student progress
  const [quickPrompt, setQuickPrompt] = useState('');
  const [activeInsight, setActiveInsight] = useState<string | null>(null);

  // ----------------------------------------------------
  // METRIC COUNTS
  // ----------------------------------------------------
  const totalSubmissionsDisplay = '1,248';
  const verifiedDisplay = '982';
  const pendingDisplay = Math.max(0, 266 - queueIndex).toString();
  
  const totalScoreVal = 966.0;
  const targetScoreVal = 971.0;
  const progressPercent = ((totalScoreVal / targetScoreVal) * 100).toFixed(1);

  // Helper function to get student status and styling
  const getProgressDetails = (percent: number) => {
    if (percent >= 75) {
      return {
        status: 'On Track',
        color: '#047857',
        badgeBg: '#dcfce7',
        badgeColor: '#15803d'
      };
    } else if (percent < 50) {
      return {
        status: 'Attention',
        color: '#dc2626',
        badgeBg: '#fee2e2',
        badgeColor: '#dc2626'
      };
    } else {
      return {
        status: 'In Progress',
        color: '#3730a3',
        badgeBg: '#ede9fe',
        badgeColor: '#6366f1'
      };
    }
  };

  // Recent Student Progress list with Recently Submitted Document
  const displayProgressStudents = [
    {
      id: 901,
      name: 'Anika Sharma',
      recentDoc: 'IEEE_Paper_Presentation.pdf',
      recentActivity: 'International Conference Paper',
      percent: 85,
      ...getProgressDetails(85)
    },
    {
      id: 902,
      name: 'Rahul Menon',
      recentDoc: 'Hackathon_Winner_Certificate.pdf',
      recentActivity: 'State Level TechFest 1st Prize',
      percent: 45,
      ...getProgressDetails(45)
    },
    {
      id: 903,
      name: 'Sara Joseph',
      recentDoc: 'Community_Camp_Report.pdf',
      recentActivity: 'NSS Outreach Leadership',
      percent: 60,
      ...getProgressDetails(60)
    }
  ];

  // Verification Queue Documents with real calendar dates
  const defaultQueueItems: VerificationDocItem[] = [
    {
      id: 1,
      fileName: 'Assignment_Final_v2.pdf',
      studentName: 'Arjun Das',
      activityTitle: 'NPTEL Cloud Computing Certification',
      category: 'Online Courses',
      description: 'Completed 12-week NPTEL course with Elite certificate score 88%',
      marks: 10,
      date: '11 Aug 2026, 02:45 PM'
    },
    {
      id: 2,
      fileName: 'IEEE_Paper_Presentation.pdf',
      studentName: 'Anika Sharma',
      activityTitle: 'International Conference Paper',
      category: 'Research',
      description: 'Presented research paper on NLP in IEEE Kerala Section conference.',
      marks: 15,
      date: '10 Aug 2026, 05:12 PM'
    },
    {
      id: 3,
      fileName: 'Hackathon_Winner_Certificate.pdf',
      studentName: 'Rahul Menon',
      activityTitle: 'State Level TechFest 1st Prize',
      category: 'Prizes',
      description: 'First prize in 24-hour Hackathon held at Marian College.',
      marks: 10,
      date: '14 Oct 2026, 11:30 AM'
    },
    {
      id: 4,
      fileName: 'Community_Camp_Report.pdf',
      studentName: 'Sara Joseph',
      activityTitle: 'NSS Outreach Leadership',
      category: 'Social Responsibility',
      description: 'Coordinated 7-day residential NSS Special Camp activities.',
      marks: 5,
      date: '12 Oct 2026, 04:20 PM'
    }
  ];

  // Merge pending submissions with friendly filenames
  const pendingSubs = submissions.filter((s) =>
    ['Pending', 'Submitted', 'Student Rep Verified', 'Pending Rep Verification'].includes(s.status)
  );

  const queueList: VerificationDocItem[] = pendingSubs.length > 0
    ? pendingSubs.map((s, idx) => {
        const student = students.find((st) => st.id === s.studentId);
        let nameToDisplay = s.proof && s.proof.includes('.') ? s.proof : `Assignment_Final_v${idx + 2}.pdf`;
        const criteriaItem = criteriaCatalog.flatMap((c) => c.items).find((it) => it.id === s.criteriaId);
        const categoryItem = criteriaCatalog.find((c) => c.items.some((it) => it.id === s.criteriaId));
        return {
          id: s.id,
          fileName: nameToDisplay,
          studentName: student ? student.name : 'Arjun Das',
          activityTitle: criteriaItem?.title || s.description || 'Verified Claim',
          category: categoryItem?.category || 'Academics',
          description: s.description || 'Verified class evaluation claim submitted with valid institutional proof.',
          marks: criteriaItem?.marks || 5,
          date: '11 Aug 2026, 02:45 PM',
          subId: s.id
        };
      })
    : defaultQueueItems;

  const currentQueueDoc = queueList[queueIndex % queueList.length] || defaultQueueItems[0];
  const teacherName = currentUserInfo?.name || 'Prof. Kochumol Abraham';

  // Quick Action Handlers
  const handleQuickApprove = () => {
    if (currentQueueDoc.subId) {
      updateSubmission(currentQueueDoc.subId, {
        status: 'Approved',
        verifiedByName: teacherName,
        remarks: 'Verified & Approved via Quick Verification Queue'
      });
    }
    showToast(`✓ Approved "${currentQueueDoc.fileName}" for ${currentQueueDoc.studentName}`);
    setQueueIndex((prev) => (prev + 1) % queueList.length);
  };

  // Open Document Preview Modal
  const handleOpenPreview = (doc?: VerificationDocItem) => {
    const target = doc || currentQueueDoc;
    setPreviewModalDoc(target);
    setModalRemarks('');
  };

  // Handle Modal Decision
  const handleModalAction = (status: 'Approved' | 'Rejected' | 'Correction Requested') => {
    if (!previewModalDoc) return;

    if (previewModalDoc.subId) {
      updateSubmission(previewModalDoc.subId, {
        status,
        verifiedByName: teacherName,
        remarks: modalRemarks || (status === 'Approved' ? 'Verified & Approved by Class Advisor' : status === 'Rejected' ? 'Rejected by Class Advisor' : 'Correction required by Class Advisor')
      });
    }

    if (status === 'Approved') {
      showToast(`✓ Approved "${previewModalDoc.fileName}" for ${previewModalDoc.studentName}`);
    } else if (status === 'Rejected') {
      showToast(`✗ Rejected "${previewModalDoc.fileName}"`);
    } else {
      showToast(`⚠️ Correction requested for "${previewModalDoc.fileName}"`);
    }

    setPreviewModalDoc(null);
    setQueueIndex((prev) => (prev + 1) % queueList.length);
  };

  // Helper to calculate student submission stats
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
    const pending = studentSubs.filter((s) => ['Student Rep Verified', 'Pending Rep Verification', 'Pending', 'Submitted'].includes(s.status)).length;
    
    let percent = 0;
    if (total > 0) {
      percent = Math.round((verified / total) * 100);
    }
    
    return { verified, total, pending, percent };
  };

  // Helper to retrieve latest submission date for student (Real calendar date format)
  const getStudentLastDate = (studentId: number) => {
    const studentSubs = submissions.filter((s) => s.studentId === studentId);
    if (studentSubs.length === 0) return '—';
    const latest = studentSubs[studentSubs.length - 1];
    
    if ((latest as any).date && !(latest as any).date.includes('Today') && !(latest as any).date.includes('Yesterday')) {
      return (latest as any).date;
    }

    const defaultDates: Record<number, string> = {
      1: '11 Aug 2026, 02:45 PM',
      2: '10 Aug 2026, 05:12 PM',
      3: '14 Oct 2026, 11:30 AM',
      4: '12 Oct 2026, 04:20 PM',
      5: '10 Oct 2026, 09:15 AM',
      901: '11 Aug 2026, 01:15 PM',
      902: '10 Aug 2026, 04:30 PM',
      903: '13 Oct 2026, 10:00 AM'
    };
    return defaultDates[studentId] || '11 Aug 2026, 02:30 PM';
  };

  // Helper to format clean file name
  const formatFileName = (sub: Submission) => {
    if (sub.proof && isNaN(Number(sub.proof)) && sub.proof.length > 2) {
      return sub.proof.endsWith('.pdf') ? sub.proof : `${sub.proof}.pdf`;
    }
    const criteriaItem = criteriaCatalog.flatMap((c) => c.items).find((it) => it.id === sub.criteriaId);
    if (criteriaItem?.title) {
      const cleanTitle = criteriaItem.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 22);
      return `${cleanTitle}_Proof.pdf`;
    }
    return `Institutional_Proof_${sub.id}.pdf`;
  };

  // Helper to format clean activity title
  const formatActivityTitle = (sub: Submission) => {
    const criteriaItem = criteriaCatalog.flatMap((c) => c.items).find((it) => it.id === sub.criteriaId);
    if (criteriaItem?.title) return criteriaItem.title;
    if (sub.description && isNaN(Number(sub.description)) && sub.description.length > 3) {
      return sub.description;
    }
    return 'Academic Excellence Claim';
  };

  // Helper to check if two class names match
  const isSameClass = (c1?: string, c2?: string) => {
    if (!c1 || !c2) return true;
    const norm1 = c1.toLowerCase().replace(/^(i|ii|iii|\d+)\s+/, '').trim();
    const norm2 = c2.toLowerCase().replace(/^(i|ii|iii|\d+)\s+/, '').trim();
    return norm1 === norm2 || c1.toLowerCase().trim() === c2.toLowerCase().trim();
  };

  const teacherClass = (currentUserInfo as any)?.className || (currentUserInfo as any)?.class_name || 'BSc CS A';
  const teacherClassObject = classes?.find((c: any) => c.name === teacherClass);
  const teacherDepartment = teacherClassObject?.department || currentUserInfo?.department || 'Computer Applications';

  // Base list of students belonging to this teacher's class
  const classStudents = students.filter((student) => {
    if (student.className && teacherClass && !isSameClass(student.className, teacherClass)) {
      return false;
    }
    return true;
  });

  // Calculate status counts for filter buttons
  const pendingCount = classStudents.filter((s) => getStudentStats(s.id).pending > 0).length;
  const completedCount = classStudents.filter((s) => {
    const stats = getStudentStats(s.id);
    return stats.pending === 0 && stats.verified > 0;
  }).length;
  const allCount = classStudents.length;

  // Filtered student list for verification desk
  const filteredStudents = classStudents.filter((student) => {
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

  const totalVerificationPages = Math.ceil(filteredStudents.length / verificationPageSize) || 1;
  const paginatedVerificationStudents = filteredStudents.slice(
    (verificationPage - 1) * verificationPageSize,
    verificationPage * verificationPageSize
  );

  // ----------------------------------------------------
  // BULK SELECTION & APPROVAL ACTIONS
  // ----------------------------------------------------
  const handleToggleSelectStudent = (studentId: number) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const handleToggleSelectAll = () => {
    const visibleIds = paginatedVerificationStudents.map((s) => s.id);
    const allSelected = visibleIds.every((id) => selectedStudentIds.includes(id));
    if (allSelected) {
      setSelectedStudentIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedStudentIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const handleSelectAllPending = () => {
    const pendingIds = filteredStudents
      .filter((s) => getStudentStats(s.id).pending > 0)
      .map((s) => s.id);
    setSelectedStudentIds(pendingIds);
    showToast(`Selected ${pendingIds.length} student(s) with pending submissions.`);
  };

  const handleBulkApproveSelected = () => {
    if (!evaluationOpen) {
      alert('Evaluation access is currently CLOSED by system administrator.');
      return;
    }
    if (selectedStudentIds.length === 0) return;

    let totalApproved = 0;
    selectedStudentIds.forEach((studentId) => {
      const studentSubs = submissions.filter(
        (s) => s.studentId === studentId &&
        ['Pending', 'Submitted', 'Student Rep Verified', 'Pending Rep Verification'].includes(s.status)
      );
      studentSubs.forEach((sub) => {
        updateSubmission(sub.id, {
          status: 'Approved',
          verifiedByName: teacherName,
          remarks: 'Bulk verified & approved by Class Advisor'
        });
        totalApproved++;
      });
    });

    if (totalApproved > 0) {
      showToast(`✓ Approved ${totalApproved} pending submission(s) for ${selectedStudentIds.length} student(s)!`);
    } else {
      showToast(`Selected student(s) have no pending submissions to approve.`);
    }
    setSelectedStudentIds([]);
  };

  const handleApproveAllPending = () => {
    if (!evaluationOpen) {
      alert('Evaluation access is currently CLOSED by system administrator.');
      return;
    }
    const pendingSubsToApprove = submissions.filter(
      (s) => ['Pending', 'Submitted', 'Student Rep Verified', 'Pending Rep Verification'].includes(s.status) &&
      filteredStudents.some((stud) => stud.id === s.studentId)
    );

    if (pendingSubsToApprove.length === 0) {
      showToast('No pending submissions found to approve.');
      return;
    }

    pendingSubsToApprove.forEach((sub) => {
      updateSubmission(sub.id, {
        status: 'Approved',
        verifiedByName: teacherName,
        remarks: 'Bulk approved by Class Advisor'
      });
    });

    showToast(`✓ Approved all ${pendingSubsToApprove.length} pending submission(s) across class!`);
    setSelectedStudentIds([]);
  };

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

  const handleVerifySubmission = (subId: number, status: 'Approved' | 'Rejected' | 'Correction Requested') => {
    if (!evaluationOpen) {
      alert('Evaluation access is currently CLOSED by system administrator.');
      return;
    }

    const customRemarks = submissionRemarksMap[subId] || (status === 'Approved' ? 'Verified and Approved by Class Advisor' : status === 'Rejected' ? 'Rejected by Class Advisor' : 'Correction required by Class Advisor');

    updateSubmission(subId, {
      status,
      verifiedByName: teacherName,
      remarks: customRemarks
    });
    
    if (status === 'Approved') {
      showToast('✓ Submission verified and approved successfully.');
    } else if (status === 'Rejected') {
      showToast('✗ Submission marked as rejected.');
    } else {
      showToast('⚠️ Correction requested from student.');
    }
  };

  const handleManualAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentEmail.trim()) return;

    addStudent({
      name: newStudentName,
      className: teacherClass || 'BSc CS A'
    });

    setNewStudentName('');
    setNewStudentEmail('');
    showToast(`Student ${newStudentName} added successfully.`);
  };

  const handleCSVUpload = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Simulated Import: 3 students parsed from CSV and added successfully!');
    addStudent({ name: 'Bhavya Sharma', className: 'BSc CS A' });
    addStudent({ name: 'Chitra Sharma', className: 'BSc CS A' });
    showToast('Students imported from CSV successfully.');
  };

  const totalStudentPages = Math.ceil(students.length / studentPageSize) || 1;
  const paginatedStudents = students.slice(
    (studentManagementPage - 1) * studentPageSize,
    studentManagementPage * studentPageSize
  );

  return (
    <div style={{ position: 'relative', minHeight: '85vh' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#0f172a',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '14px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
            fontSize: '0.9rem',
            fontWeight: 600,
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'fadeIn 0.25s ease'
          }}
        >
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* POPUP MODAL: SUBMISSION DETAILS & VERIFICATION       */}
      {/* ---------------------------------------------------- */}
      {previewModalDoc && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            padding: '20px',
            animation: 'fadeIn 0.2s ease'
          }}
          onClick={() => setPreviewModalDoc(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              maxWidth: '620px',
              width: '100%',
              boxShadow: '0 30px 70px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '90vh'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 26px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#f8fafc'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    background: '#e0e7ff',
                    color: '#4338ca',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </span>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Submission Details</h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0 0' }}>Review document and record evaluation decision</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewModalDoc(null)}
                style={{
                  background: '#e2e8f0',
                  border: 'none',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px 26px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Document Banner Box */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: '#fee2e2',
                      color: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase'
                    }}
                  >
                    PDF
                  </div>
                  <div>
                    <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                      {previewModalDoc.fileName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                      Submitted {previewModalDoc.date || '11 Aug 2026'} • Institutional Proof
                    </div>
                  </div>
                </div>

                <a
                  href={`/Assets/Proofs/${previewModalDoc.fileName}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: '#ffffff',
                    color: '#4f46e5',
                    border: '1px solid #c7d2fe',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>Open File</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>

              {/* Metadata Details Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '14px',
                  background: '#ffffff',
                  border: '1px solid #f1f5f9',
                  borderRadius: '16px',
                  padding: '16px'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                    Student
                  </span>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                    {previewModalDoc.studentName}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                    Assigned Class
                  </span>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                    {teacherClass || 'BSc CS A'}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                    Category
                  </span>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#047857', marginTop: '2px' }}>
                    {previewModalDoc.category}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                    Claimed Points
                  </span>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                    +{previewModalDoc.marks || 10} Points
                  </div>
                </div>
              </div>

              {/* Activity Description */}
              <div>
                <span style={{ fontSize: '0.76rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  Activity / Description
                </span>
                <div
                  style={{
                    background: '#f8fafc',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    fontSize: '0.88rem',
                    color: '#334155',
                    marginTop: '6px',
                    border: '1px solid #f1f5f9'
                  }}
                >
                  <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                    {previewModalDoc.activityTitle}
                  </strong>
                  {previewModalDoc.description || 'Valid institutional proof submitted for evaluation.'}
                </div>
              </div>

              {/* Feedback / Remarks input */}
              <div>
                <label style={{ fontSize: '0.76rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Remarks / Feedback (Optional)
                </label>
                <textarea
                  className="input"
                  rows={2}
                  placeholder="Enter remarks or correction instructions..."
                  value={modalRemarks}
                  onChange={(e) => setModalRemarks(e.target.value)}
                  style={{ borderRadius: '12px', padding: '10px 14px', width: '100%', fontSize: '0.88rem', resize: 'none' }}
                />
              </div>
            </div>

            {/* Modal Footer with 3 Action Buttons */}
            <div
              style={{
                padding: '18px 26px',
                borderTop: '1px solid #f1f5f9',
                background: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <button
                onClick={() => handleModalAction('Rejected')}
                style={{
                  background: '#fee2e2',
                  color: '#dc2626',
                  border: '1px solid #fca5a5',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                <span>✗</span> Reject
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleModalAction('Correction Requested')}
                  style={{
                    background: '#fef3c7',
                    color: '#b45309',
                    border: '1px solid #fcd34d',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <span>⚠️</span> Correction
                </button>

                <button
                  onClick={() => handleModalAction('Approved')}
                  style={{
                    background: '#047857',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 22px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(4, 120, 87, 0.25)',
                    transition: 'all 0.2s'
                  }}
                >
                  <span>✓</span> Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* RIGHT-SIDE SLIDE-OVER REVIEW DRAWER FOR STUDENT      */}
      {/* ---------------------------------------------------- */}
      {selectedStudent && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999998 }}>
          {/* Backdrop Overlay */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              animation: 'fadeIn 0.2s ease'
            }}
            onClick={() => setSelectedStudent(null)}
          />

          {/* Right Slide-over Panel */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '660px',
              maxWidth: '95vw',
              background: '#ffffff',
              zIndex: 999999,
              boxShadow: '-15px 0 50px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '24px 28px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#f8fafc'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #047857, #065f46)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    boxShadow: '0 4px 14px rgba(4, 120, 87, 0.25)'
                  }}
                >
                  {selectedStudent.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {selectedStudent.name}
                    </h2>
                    <span
                      style={{
                        background: '#dcfce7',
                        color: '#15803d',
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.74rem',
                        fontWeight: 700
                      }}
                    >
                      {teacherClass || 'BSc CS A'}
                    </span>
                  </div>
                  <p style={{ margin: '3px 0 0 0', fontSize: '0.84rem', color: '#64748b' }}>
                    {selectedStudent.name.toLowerCase().replace(/\s+/g, '.') + '@college.edu'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                style={{
                  background: '#e2e8f0',
                  border: 'none',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                title="Close review panel"
              >
                ✕
              </button>
            </div>

            {/* Drawer Sub-Header Stats Banner */}
            {(() => {
              const currentStats = getStudentStats(selectedStudent.id);
              return (
                <div
                  style={{
                    padding: '16px 28px',
                    background: '#f1f5f9',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#475569' }}>
                      Verification Progress:
                    </span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#047857' }}>
                      {currentStats.verified} / {currentStats.total} Verified ({currentStats.percent}%)
                    </span>
                  </div>
                  {currentStats.pending > 0 ? (
                    <span style={{ background: '#fef3c7', color: '#b45309', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.76rem', fontWeight: 700 }}>
                      {currentStats.pending} Pending Review
                    </span>
                  ) : (
                    <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.76rem', fontWeight: 700 }}>
                      All Verified
                    </span>
                  )}
                </div>
              );
            })()}

            {/* Drawer Submissions List (Scrollable) */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '22px'
              }}
            >
              {selectedStudentSubmissions.map((sub) => {
                const criteriaItem = criteriaCatalog.flatMap((c) => c.items).find((it) => it.id === sub.criteriaId);
                const categoryItem = criteriaCatalog.find((c) => c.items.some((it) => it.id === sub.criteriaId));
                const currentRemarks = submissionRemarksMap[sub.id] ?? (sub.remarks || '');
                const fileNameToDisplay = formatFileName(sub);
                const activityTitle = formatActivityTitle(sub);

                const getStatusBadgeStyle = (st: string) => {
                  if (['Approved', 'Verified', 'Evaluated', 'Locked'].includes(st)) {
                    return { bg: '#dcfce7', color: '#15803d', label: 'Approved' };
                  }
                  if (st === 'Rejected') {
                    return { bg: '#fee2e2', color: '#dc2626', label: 'Rejected' };
                  }
                  if (st === 'Correction Requested') {
                    return { bg: '#fef3c7', color: '#b45309', label: 'Correction Required' };
                  }
                  return { bg: '#ede9fe', color: '#6366f1', label: 'Pending Review' };
                };

                const statusStyle = getStatusBadgeStyle(sub.status);

                return (
                  <div
                    key={sub.id}
                    style={{
                      background: '#ffffff',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '20px',
                      padding: '22px',
                      boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      transition: 'border-color 0.2s'
                    }}
                  >
                    {/* Submission Card Top Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '12px',
                            background: '#fee2e2',
                            color: '#dc2626',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.72rem'
                          }}
                        >
                          PDF
                        </div>
                        <div>
                          <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a' }}>
                            {fileNameToDisplay}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                            {categoryItem?.category || 'Academics'} • <strong style={{ color: '#0f172a' }}>+{criteriaItem?.marks || 5} Points</strong>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            background: statusStyle.bg,
                            color: statusStyle.color,
                            padding: '4px 12px',
                            borderRadius: '9999px',
                            fontSize: '0.76rem',
                            fontWeight: 700
                          }}
                        >
                          {statusStyle.label}
                        </span>

                        <a
                          href={`/Assets/Proofs/${sub.proof || fileNameToDisplay}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            background: '#f8fafc',
                            color: '#4f46e5',
                            border: '1px solid #c7d2fe',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Open document proof in new tab"
                        >
                          <span>Open</span>
                          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </a>
                      </div>
                    </div>

                    {/* Activity Title & Description */}
                    <div
                      style={{
                        background: '#f8fafc',
                        padding: '14px 16px',
                        borderRadius: '14px',
                        fontSize: '0.86rem',
                        color: '#334155',
                        border: '1px solid #f1f5f9'
                      }}
                    >
                      <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px', fontSize: '0.92rem' }}>
                        {activityTitle}
                      </strong>
                      {sub.description && isNaN(Number(sub.description)) && sub.description.length > 3
                        ? sub.description
                        : 'Institutional certificate verified for class performance evaluation.'}
                    </div>

                    {/* Remarks Input */}
                    <div>
                      <input
                        type="text"
                        placeholder="Add remarks or correction instructions (optional)..."
                        value={currentRemarks}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSubmissionRemarksMap((prev) => ({ ...prev, [sub.id]: val }));
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.84rem',
                          outline: 'none',
                          background: '#ffffff'
                        }}
                      />
                    </div>

                    {/* 3 Action Buttons: Approve, Correction, Reject */}
                    <div style={{ display: 'flex', gap: '10px', paddingTop: '2px' }}>
                      <button
                        onClick={() => handleVerifySubmission(sub.id, 'Approved')}
                        style={{
                          flex: 1.3,
                          background: '#047857',
                          color: '#ffffff',
                          border: 'none',
                          padding: '10px 16px',
                          borderRadius: '12px',
                          fontSize: '0.86rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 8px rgba(4, 120, 87, 0.25)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span>✓</span> Approve
                      </button>

                      <button
                        onClick={() => handleVerifySubmission(sub.id, 'Correction Requested')}
                        style={{
                          flex: 1.2,
                          background: '#fef3c7',
                          color: '#b45309',
                          border: '1px solid #fcd34d',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          fontSize: '0.86rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span>⚠️</span> Correction
                      </button>

                      <button
                        onClick={() => handleVerifySubmission(sub.id, 'Rejected')}
                        style={{
                          flex: 1,
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: '1px solid #fca5a5',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          fontSize: '0.86rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span>✗</span> Reject
                      </button>
                    </div>
                  </div>
                );
              })}

              {selectedStudentSubmissions.length === 0 && (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '48px 20px',
                    color: '#64748b',
                    background: '#f8fafc',
                    borderRadius: '18px',
                    border: '1.5px dashed #cbd5e1'
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📂</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>
                    No Submissions Found
                  </div>
                  <div style={{ fontSize: '0.84rem', marginTop: '4px' }}>
                    This student hasn't submitted any claim documents for the selected category yet.
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div
              style={{
                padding: '18px 28px',
                borderTop: '1px solid #f1f5f9',
                background: '#f8fafc',
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <button
                onClick={() => setSelectedStudent(null)}
                style={{
                  background: '#e2e8f0',
                  color: '#334155',
                  border: 'none',
                  padding: '10px 22px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Done Reviewing
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* ---------------------------------------------------- */}
        {/* TAB 1: TEACHER DASHBOARD                            */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Header Section */}
            <div>
              <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '4px' }}>
                Teacher Dashboard
              </h1>
              <p style={{ fontSize: '1rem', color: '#475569', fontWeight: 500 }}>
                Class Performance: {teacherClass || 'BSc CS A'}
              </p>
            </div>

            {/* Four KPI Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: '18px'
              }}
            >
              {/* Card 1: TOTAL SUBMISSIONS */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  padding: '24px 26px',
                  border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '140px',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Total Submissions
                  </span>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#1e293b',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                      <line x1="8" y1="6" x2="16" y2="16" />
                      <line x1="8" y1="10" x2="16" y2="10" />
                      <line x1="8" y1="14" x2="12" y2="14" />
                    </svg>
                  </div>
                </div>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', marginTop: '14px', lineHeight: 1 }}>
                  {totalSubmissionsDisplay}
                </div>
              </div>

              {/* Card 2: VERIFIED */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  padding: '24px 26px',
                  border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '140px',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Verified
                  </span>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#ecfdf5',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                  </div>
                </div>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', marginTop: '14px', lineHeight: 1 }}>
                  {verifiedDisplay}
                </div>
              </div>

              {/* Card 3: PENDING REVIEW */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  padding: '24px 26px',
                  border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '140px',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Pending Review
                  </span>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#7c3aed'
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#7c3aed" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 22h14" />
                      <path d="M5 2h14" />
                      <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
                      <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
                    </svg>
                  </div>
                </div>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', marginTop: '14px', lineHeight: 1 }}>
                  {pendingDisplay}
                </div>
              </div>

              {/* Card 4: TOTAL SCORE */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  padding: '24px 26px',
                  border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '140px',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Total Score
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                      {totalScoreVal.toFixed(0)} / {targetScoreVal.toFixed(0)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, marginTop: '3px' }}>
                      {progressPercent}% completed
                    </div>
                  </div>
                  {/* Circular Grade Badge */}
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      border: '3.5px solid #0f766e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0f766e',
                      fontWeight: 800,
                      fontSize: '1.15rem'
                    }}
                  >
                    A+
                  </div>
                </div>
              </div>
            </div>

            {/* Lower Section Grid (2 Columns: Recent Student Progress + Verification Queue) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.25fr 1fr',
                gap: '24px',
                alignItems: 'start'
              }}
            >
              {/* Left Column: Recent Student Progress */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  padding: '28px 30px',
                  border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
                      Recent Student Progress
                    </h2>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                      Click on recent submitted document to view verification details
                    </p>
                  </div>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#4f46e5',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '8px'
                    }}
                    onClick={() => {
                      setActivePage('verification');
                      router.push('/teacher/verification');
                    }}
                  >
                    View All
                  </button>
                </div>

                {/* Student Progress List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {displayProgressStudents.map((s) => (
                    <div
                      key={s.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        padding: '6px 0'
                      }}
                    >
                      {/* Name + Recently Submitted Document */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: '150px' }}>
                        <span style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0f172a' }}>
                          {s.name}
                        </span>
                        <div
                          onClick={() => {
                            handleOpenPreview({
                              id: s.id,
                              fileName: s.recentDoc,
                              studentName: s.name,
                              activityTitle: s.recentActivity,
                              category: s.id === 901 ? 'Research' : s.id === 902 ? 'Prizes' : 'Social Responsibility',
                              description: `Recent submission of ${s.recentActivity} by ${s.name}`,
                              marks: s.id === 901 ? 15 : s.id === 902 ? 10 : 5,
                              date: s.id === 901 ? '11 Aug 2026, 01:15 PM' : s.id === 902 ? '10 Aug 2026, 04:30 PM' : '13 Oct 2026, 10:00 AM'
                            });
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.76rem',
                            color: '#4f46e5',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                          title="Click to view submission details"
                        >
                          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          <span style={{ textDecoration: 'underline', textUnderlineOffset: '2px', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {s.recentDoc}
                          </span>
                        </div>
                      </div>

                      {/* Progress Track */}
                      <div
                        style={{
                          flex: 1,
                          height: '10px',
                          background: '#e2e8f0',
                          borderRadius: '9999px',
                          overflow: 'hidden',
                          position: 'relative'
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${s.percent}%`,
                            background: s.color,
                            borderRadius: '9999px',
                            transition: 'width 0.6s ease'
                          }}
                        />
                      </div>

                      {/* Percentage */}
                      <span
                        style={{
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          color: '#334155',
                          minWidth: '42px',
                          textAlign: 'right'
                        }}
                      >
                        {s.percent}%
                      </span>

                      {/* Status Badge */}
                      <span
                        style={{
                          background: s.badgeBg,
                          color: s.badgeColor,
                          padding: '4px 14px',
                          borderRadius: '9999px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          minWidth: '94px',
                          textAlign: 'center'
                        }}
                      >
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom Quick Assistant / Grade Distribution bar matching screenshot */}
                <div
                  style={{
                    marginTop: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 14px',
                    borderRadius: '16px',
                    background: '#f8fafc',
                    border: '1.5px solid #e2e8f0'
                  }}
                >
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '8px',
                      background: '#e2e8f0',
                      color: '#64748b',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    1
                  </span>
                  <input
                    type="text"
                    placeholder="Show a detailed grade distribution c..."
                    value={quickPrompt}
                    onChange={(e) => setQuickPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setActiveInsight(quickPrompt || 'Grade distribution: 14 students (A+), 8 students (A), 3 pending.');
                        showToast('Class performance breakdown generated');
                      }
                    }}
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      outline: 'none',
                      fontSize: '0.88rem',
                      color: '#0f172a',
                      fontFamily: 'inherit'
                    }}
                  />
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '8px',
                      background: '#e2e8f0',
                      color: '#64748b',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setActiveInsight('Grade distribution: 14 students (A+), 8 students (A), 3 pending.');
                      showToast('Class performance breakdown generated');
                    }}
                  >
                    2
                  </span>
                </div>

                {activeInsight && (
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: '#eff6ff',
                      color: '#1e40af',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      border: '1px solid #bfdbfe',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>📊 {activeInsight}</span>
                    <button
                      onClick={() => setActiveInsight(null)}
                      style={{ background: 'none', border: 'none', color: '#1e40af', cursor: 'pointer', fontWeight: 700 }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Verification Queue */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  padding: '28px 30px',
                  border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}
              >
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
                    Verification Queue
                  </h2>
                  <p style={{ fontSize: '0.86rem', color: '#64748b', marginTop: '3px' }}>
                    {queueList.length} documents awaiting review
                  </p>
                </div>

                {/* Document Preview Box (Clickable to open full preview modal) */}
                <div
                  onClick={() => handleOpenPreview(currentQueueDoc)}
                  style={{
                    background: '#f1f5f9',
                    borderRadius: '16px',
                    padding: '36px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    border: '1.5px dashed #cbd5e1',
                    minHeight: '210px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  title="Click to view full preview and submission details"
                >
                  <div style={{ color: '#94a3b8', marginBottom: '14px' }}>
                    <svg viewBox="0 0 24 24" width="52" height="52" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.96rem', color: '#0f172a' }}>
                    {currentQueueDoc.fileName}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '3px' }}>
                    by {currentQueueDoc.studentName}
                  </div>
                </div>

                {/* Action Buttons: ✓ Approve + View Preview */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleQuickApprove}
                    style={{
                      flex: 1,
                      background: '#047857',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px 18px',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 8px rgba(4, 120, 87, 0.25)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>✓</span> Approve
                  </button>

                  <button
                    onClick={() => handleOpenPreview(currentQueueDoc)}
                    style={{
                      flex: 1,
                      background: '#e0e7ff',
                      color: '#4338ca',
                      border: '1px solid #c7d2fe',
                      borderRadius: '12px',
                      padding: '12px 18px',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    View Preview
                  </button>
                </div>
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
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>Verification Desk</h1>
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
                Select students to bulk approve or click individual rows to inspect submissions.
              </p>
            </div>

            {/* Filter Section: Search, Status Toggle Buttons, Category Dropdown */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '22px 28px',
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                display: 'grid',
                gridTemplateColumns: '1.4fr 1.6fr 1fr',
                gap: '18px',
                alignItems: 'flex-end'
              }}
            >
              {/* 1. Search */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem', color: '#475569' }}>Search Students</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Search name or email..."
                  value={studentSearch}
                  onChange={(e) => {
                    setStudentSearch(e.target.value);
                    setVerificationPage(1);
                  }}
                  style={{ borderRadius: '12px', padding: '10px 14px' }}
                />
              </div>

              {/* 2. Status Buttons: Pending Reviews, Completed, All */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontWeight: 700, fontSize: '0.82rem', color: '#475569' }}>Filter Status</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter('pending');
                      setVerificationPage(1);
                    }}
                    style={{
                      flex: 1.1,
                      padding: '10px 12px',
                      borderRadius: '12px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: statusFilter === 'pending' ? 'none' : '1px solid #e2e8f0',
                      background: statusFilter === 'pending' ? '#047857' : '#f8fafc',
                      color: statusFilter === 'pending' ? '#ffffff' : '#475569',
                      boxShadow: statusFilter === 'pending' ? '0 2px 8px rgba(4, 120, 87, 0.25)' : 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>Pending Reviews</span>
                    <span
                      style={{
                        padding: '1px 7px',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: statusFilter === 'pending' ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                        color: statusFilter === 'pending' ? '#ffffff' : '#475569'
                      }}
                    >
                      {pendingCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter('completed');
                      setVerificationPage(1);
                    }}
                    style={{
                      flex: 0.95,
                      padding: '10px 12px',
                      borderRadius: '12px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: statusFilter === 'completed' ? 'none' : '1px solid #e2e8f0',
                      background: statusFilter === 'completed' ? '#047857' : '#f8fafc',
                      color: statusFilter === 'completed' ? '#ffffff' : '#475569',
                      boxShadow: statusFilter === 'completed' ? '0 2px 8px rgba(4, 120, 87, 0.25)' : 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>Completed</span>
                    <span
                      style={{
                        padding: '1px 7px',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: statusFilter === 'completed' ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                        color: statusFilter === 'completed' ? '#ffffff' : '#475569'
                      }}
                    >
                      {completedCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter('all');
                      setVerificationPage(1);
                    }}
                    style={{
                      flex: 0.7,
                      padding: '10px 12px',
                      borderRadius: '12px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: statusFilter === 'all' ? 'none' : '1px solid #e2e8f0',
                      background: statusFilter === 'all' ? '#047857' : '#f8fafc',
                      color: statusFilter === 'all' ? '#ffffff' : '#475569',
                      boxShadow: statusFilter === 'all' ? '0 2px 8px rgba(4, 120, 87, 0.25)' : 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>All</span>
                    <span
                      style={{
                        padding: '1px 7px',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: statusFilter === 'all' ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                        color: statusFilter === 'all' ? '#ffffff' : '#475569'
                      }}
                    >
                      {allCount}
                    </span>
                  </button>
                </div>
              </div>

              {/* 3. Category Dropdown */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem', color: '#475569' }}>Filter Category</label>
                <select
                  className="select"
                  value={selectedCategoryFilter}
                  onChange={(e) => {
                    setSelectedCategoryFilter(e.target.value);
                    setVerificationPage(1);
                  }}
                  style={{ borderRadius: '12px', padding: '10px 14px' }}
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

            {/* Floating Selection Banner when items are checked */}
            {selectedStudentIds.length > 0 && (
              <div
                style={{
                  background: 'linear-gradient(135deg, #047857, #065f46)',
                  color: '#ffffff',
                  padding: '14px 24px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  boxShadow: '0 6px 24px rgba(4, 120, 87, 0.28)',
                  animation: 'fadeIn 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800
                    }}
                  >
                    ✓
                  </span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.98rem' }}>
                      {selectedStudentIds.length} student(s) selected
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                      Approve all pending document submissions for the selected students in a single action.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => setSelectedStudentIds([])}
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Clear Selection
                  </button>
                  <button
                    onClick={handleBulkApproveSelected}
                    style={{
                      background: '#ffffff',
                      color: '#047857',
                      border: 'none',
                      padding: '9px 20px',
                      borderRadius: '10px',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <span>✓</span> Approve Selected
                  </button>
                </div>
              </div>
            )}

            {/* Student Table */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '24px 28px',
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
              }}
            >
              <div className="table-container">
                <table className="table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      {/* Checkbox column with Select All */}
                      <th style={{ width: '42px', padding: '12px 12px', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={
                            paginatedVerificationStudents.length > 0 &&
                            paginatedVerificationStudents.every((s) => selectedStudentIds.includes(s.id))
                          }
                          onChange={handleToggleSelectAll}
                          style={{
                            width: '17px',
                            height: '17px',
                            cursor: 'pointer',
                            accentColor: '#047857',
                            borderRadius: '4px'
                          }}
                          title="Select all visible students on this page"
                        />
                      </th>
                      <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748b', fontWeight: 700, fontSize: '0.82rem' }}>Name</th>
                      <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748b', fontWeight: 700, fontSize: '0.82rem' }}>Email</th>
                      <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748b', fontWeight: 700, fontSize: '0.82rem' }}>Progress</th>
                      <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748b', fontWeight: 700, fontSize: '0.82rem' }}>Date</th>
                      <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748b', fontWeight: 700, fontSize: '0.82rem' }}>Status</th>
                      <th style={{ textAlign: 'right', padding: '12px 16px', color: '#64748b', fontWeight: 700, fontSize: '0.82rem' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedVerificationStudents.map((stud) => {
                      const stats = getStudentStats(stud.id);
                      const studentEmail = stud.name.toLowerCase().replace(/\s+/g, '.') + '@college.edu';
                      const lastDate = getStudentLastDate(stud.id);
                      const isSelectedDrawer = selectedStudent?.id === stud.id;
                      const isChecked = selectedStudentIds.includes(stud.id);

                      return (
                        <tr
                          key={stud.id}
                          style={{
                            borderBottom: '1px solid #f1f5f9',
                            background: isChecked ? '#ecfdf5' : isSelectedDrawer ? '#f0fdf4' : 'transparent',
                            transition: 'background 0.15s ease'
                          }}
                        >
                          <td style={{ width: '42px', padding: '14px 12px', textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleSelectStudent(stud.id)}
                              style={{
                                width: '17px',
                                height: '17px',
                                cursor: 'pointer',
                                accentColor: '#047857',
                                borderRadius: '4px'
                              }}
                            />
                          </td>
                          <td style={{ fontWeight: 700, padding: '14px 16px', color: '#0f172a' }}>
                            {stud.name}
                          </td>
                          <td style={{ padding: '14px 16px', color: '#64748b' }}>
                            {studentEmail}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '180px' }}>
                              <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${stats.percent}%`, background: '#047857', borderRadius: '3px' }} />
                              </div>
                              <span style={{ fontSize: '0.78rem', color: '#64748b', minWidth: '55px' }}>
                                {stats.verified}/{stats.total} ({stats.percent}%)
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px', color: '#475569', fontSize: '0.84rem', fontWeight: 600 }}>
                            {lastDate}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            {stats.pending > 0 ? (
                              <span style={{ background: '#fef3c7', color: '#b45309', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700 }}>
                                Pending ({stats.pending})
                              </span>
                            ) : (
                              <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700 }}>
                                Completed
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <button
                              onClick={() => setSelectedStudent(stud)}
                              style={{
                                background: isSelectedDrawer ? '#047857' : '#e0e7ff',
                                color: isSelectedDrawer ? '#ffffff' : '#4338ca',
                                border: isSelectedDrawer ? 'none' : '1px solid #c7d2fe',
                                borderRadius: '10px',
                                padding: '8px 16px',
                                fontSize: '0.84rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <span>Review Submissions</span>
                              <span>→</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {paginatedVerificationStudents.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b' }}>
                          <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>🔍</div>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>No students found</div>
                          <div style={{ fontSize: '0.82rem', marginTop: '2px' }}>
                            No students match the current status and category filters.
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="pagination-container" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <button
                  className="pagination-btn"
                  disabled={verificationPage <= 1}
                  onClick={() => setVerificationPage((p) => Math.max(1, p - 1))}
                  style={{ borderRadius: '8px', padding: '6px 14px' }}
                >
                  Prev
                </button>
                {Array.from({ length: totalVerificationPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`pagination-num ${verificationPage === pageNum ? 'active' : ''}`}
                    onClick={() => setVerificationPage(pageNum)}
                    style={{ borderRadius: '8px', width: '34px', height: '34px' }}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  className="pagination-btn"
                  disabled={verificationPage >= totalVerificationPages}
                  onClick={() => setVerificationPage((p) => Math.min(totalVerificationPages, p + 1))}
                  style={{ borderRadius: '8px', padding: '6px 14px' }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: STUDENT MANAGEMENT                           */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'student-management' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>Student Management</h1>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>View class list, add new students manually, or import from CSV files.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.9fr', gap: '24px', alignItems: 'flex-start' }}>
              {/* Class List Card */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  padding: '28px',
                  border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                }}
              >
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Class List</h2>
                <div className="table-container">
                  <table className="table" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b' }}>Name</th>
                        <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b' }}>Email</th>
                        <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b' }}>Class</th>
                        <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedStudents.map((s) => {
                        const studentEmail = s.name.toLowerCase().replace(/\s+/g, '.') + '@college.edu';
                        return (
                          <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ fontWeight: 700, padding: '12px 14px', color: '#0f172a' }}>{s.name}</td>
                            <td style={{ padding: '12px 14px', color: '#64748b' }}>{studentEmail}</td>
                            <td style={{ padding: '12px 14px', color: '#475569' }}>{s.className || 'BSc CS A'}</td>
                            <td style={{ padding: '12px 14px' }}>
                              <button
                                onClick={() => deleteStudent(s.id)}
                                style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '4px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
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

                {/* Pagination */}
                <div className="pagination-container" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  <button
                    className="pagination-btn"
                    disabled={studentManagementPage <= 1}
                    onClick={() => setStudentManagementPage((p) => Math.max(1, p - 1))}
                    style={{ borderRadius: '8px', padding: '6px 14px' }}
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalStudentPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      className={`pagination-num ${studentManagementPage === pageNum ? 'active' : ''}`}
                      onClick={() => setStudentManagementPage(pageNum)}
                      style={{ borderRadius: '8px', width: '34px', height: '34px' }}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    className="pagination-btn"
                    disabled={studentManagementPage >= totalStudentPages}
                    onClick={() => setStudentManagementPage((p) => Math.min(totalStudentPages, p + 1))}
                    style={{ borderRadius: '8px', padding: '6px 14px' }}
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* Add & CSV Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    padding: '28px',
                    border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                  }}
                >
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Manual Add Student</h3>
                  <form onSubmit={handleManualAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem', color: '#475569' }}>Name</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="Student Name"
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        required
                        style={{ borderRadius: '10px', padding: '10px 14px' }}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem', color: '#475569' }}>Email</label>
                      <input
                        type="email"
                        className="input"
                        placeholder="student@college.edu"
                        value={newStudentEmail}
                        onChange={(e) => setNewStudentEmail(e.target.value)}
                        required
                        style={{ borderRadius: '10px', padding: '10px 14px' }}
                      />
                    </div>
                    <button
                      type="submit"
                      style={{
                        background: '#047857',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '12px',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        marginTop: '6px'
                      }}
                    >
                      Add Student
                    </button>
                  </form>
                </div>

                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    padding: '28px',
                    border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                  }}
                >
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Bulk Upload Students (CSV)</h3>
                  <form onSubmit={handleCSVUpload} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem', color: '#475569' }}>CSV File</label>
                      <input
                        type="file"
                        className="input"
                        accept=".csv"
                        onChange={(e) => setCsvFile(e.target.value)}
                        style={{ borderRadius: '10px', padding: '10px 14px' }}
                      />
                    </div>
                    <button
                      type="submit"
                      style={{
                        background: '#e2e8f0',
                        color: '#334155',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '12px',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}
                    >
                      Upload CSV
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 4: MY PROFILE                                   */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>My Profile</h1>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                View your personal teacher profile details derived from your official institutional account.
              </p>
            </div>

            <div
              style={{
                background: '#ffffff',
                borderRadius: '24px',
                padding: '36px 40px',
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px'
              }}
            >
              <div
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #047857, #065f46)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.4rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 14px rgba(4, 120, 87, 0.25)',
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
                  <span>{(currentUserInfo?.name || currentUserInfo?.email || '?').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 4px 0', color: '#0f172a' }}>
                  {currentUserInfo?.name || 'Prof. Kochumol Abraham'}
                </h2>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
                  {currentUserInfo?.email || 'kochumol.abraham@mariancollege.org'}
                </p>
              </div>

              <div style={{ width: '100%', height: '1px', background: '#f1f5f9', margin: '8px 0' }} />

              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.88rem', color: '#64748b' }}>Role</span>
                  <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#047857', background: '#d1fae5', padding: '4px 12px', borderRadius: '9999px' }}>
                    Class Teacher
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.88rem', color: '#64748b' }}>Department</span>
                  <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                    {teacherDepartment}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.88rem', color: '#64748b' }}>Assigned Class</span>
                  <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                    {teacherClass || 'BSc CS A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
