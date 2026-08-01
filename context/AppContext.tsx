'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CriteriaCategory,
  CriteriaItem,
  Student,
  Submission,
  AppUser,
  UserGroup,
  defaultCriteriaCatalog,
  defaultStudents,
  defaultSubmissions,
  defaultUsers,
  defaultAcademicYears,
  defaultUserGroups
} from '@/data/initialData';

interface AppContextType {
  currentRole: string;
  activePage: string;
  loggedIn: boolean;
  currentUserId: number | null;
  currentStudentId: number;
  selectedAcademicYear: string;
  activeAcademicYear: string;
  academicYears: string[];
  submissionOpen: boolean;
  evaluationOpen: boolean;
  submissions: Submission[];
  criteriaCatalog: CriteriaCategory[];
  users: AppUser[];
  students: Student[];
  userGroups: UserGroup[];
  jwtToken: string | null;
  currentUserInfo: {
    id: number;
    email: string;
    name: string;
    role: string;
    department: string | null;
    department_code: string | null;
    class_name: string | null;
    picture?: string;
  } | null;
  setRole: (role: string) => void;
  setActivePage: (page: string) => void;
  setAcademicYear: (year: string) => void;
  addSubmission: (newSub: Omit<Submission, 'id'>) => void;
  updateSubmission: (id: number, updates: Partial<Submission>) => void;
  deleteSubmission: (id: number) => void;
  addCriteriaItem: (categoryId: string, item: Omit<CriteriaItem, 'id'>) => void;
  updateCriteriaItem: (categoryId: string, itemId: number, item: Partial<CriteriaItem>) => void;
  deleteCriteriaItem: (categoryId: string, itemId: number) => void;
  addUser: (user: Omit<AppUser, 'id'>) => void;
  toggleUserApproval: (userId: number) => void;
  toggleSubmissionOpen: () => void;
  toggleEvaluationOpen: () => void;
  loginAsRole: (role: string) => void;
  loginWithGoogleToken: (idToken: string) => Promise<{ success: boolean; error?: string }>;
  loginBypass: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  deleteStudent: (id: number) => void;
  addUserGroup: (group: Omit<UserGroup, 'id'>) => void;
  deleteUserGroup: (groupId: string) => void;
  isStudentRep: boolean;
  toggleStudentRepMode: () => void;
  addUserToGroup: (groupId: string, email: string) => boolean;
  removeUserFromGroup: (groupId: string, email: string) => void;
  updateUserProfile: (name: string, className: string) => Promise<{ success: boolean; error?: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'bc_persistent_state';

// Role helper to map Django backend roles to frontend route slugs
const mapBackendRoleToFrontend = (backendRole: string): string => {
  const role = backendRole.toLowerCase();
  if (role === 'faculty') return 'teacher';
  if (role === 'evaluation') return 'evaluator';
  return role; // student, iqac, admin
};

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<string>('');
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentStudentId, setCurrentStudentId] = useState<number>(1);

  const [academicYears, setAcademicYears] = useState<string[]>(defaultAcademicYears);
  const [activeAcademicYear, setActiveAcademicYear] = useState<string>(defaultAcademicYears[0]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>(defaultAcademicYears[0]);

  const [submissionOpen, setSubmissionOpen] = useState<boolean>(true);
  const [evaluationOpen, setEvaluationOpen] = useState<boolean>(true);

  const [submissions, setSubmissions] = useState<Submission[]>(defaultSubmissions);
  const [criteriaCatalog, setCriteriaCatalog] = useState<CriteriaCategory[]>(defaultCriteriaCatalog);
  const [users, setUsers] = useState<AppUser[]>(defaultUsers);
  const [students, setStudents] = useState<Student[]>(defaultStudents);
  const [userGroups, setUserGroups] = useState<UserGroup[]>(defaultUserGroups);

  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [currentUserInfo, setCurrentUserInfo] = useState<AppContextType['currentUserInfo']>(null);

  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const data = JSON.parse(saved);
          if (data.submissionOpen !== undefined) setSubmissionOpen(data.submissionOpen);
          if (data.evaluationOpen !== undefined) setEvaluationOpen(data.evaluationOpen);
          if (data.submissions) setSubmissions(data.submissions);
          if (data.users) setUsers(data.users);
          if (data.criteriaCatalog) setCriteriaCatalog(data.criteriaCatalog);
          if (data.academicYears) setAcademicYears(data.academicYears);
          if (data.students) setStudents(data.students);
          if (data.userGroups) setUserGroups(data.userGroups);
          if (data.activeAcademicYear) {
            setActiveAcademicYear(data.activeAcademicYear);
            setSelectedAcademicYear(data.activeAcademicYear);
          }
          if (data.loggedIn !== undefined) setLoggedIn(data.loggedIn);
          if (data.currentRole) setCurrentRole(data.currentRole);
          if (data.currentUserId) setCurrentUserId(data.currentUserId);
          if (data.jwtToken) setJwtToken(data.jwtToken);
          if (data.currentUserInfo) setCurrentUserInfo(data.currentUserInfo);
        }
      } catch (e) {
        console.error('Failed to load persisted state', e);
      } finally {
        setIsInitialized(true);
      }
    }
  }, []);

  // Sync state to localStorage whenever modified
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      try {
        const data = {
          submissionOpen,
          evaluationOpen,
          submissions,
          users,
          criteriaCatalog,
          academicYears,
          activeAcademicYear,
          students,
          loggedIn,
          currentRole,
          currentUserId,
          jwtToken,
          currentUserInfo
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error('Failed to persist state', e);
      }
    }
  }, [
    isInitialized,
    submissionOpen,
    evaluationOpen,
    submissions,
    users,
    criteriaCatalog,
    academicYears,
    activeAcademicYear,
    students,
    loggedIn,
    currentRole,
    currentUserId,
    jwtToken,
    currentUserInfo
  ]);

  const setRole = (role: string) => {
    setCurrentRole(role);
    setActivePage('dashboard');
    const matchingUser = users.find((u) => u.role === role);
    if (matchingUser) {
      setCurrentUserId(matchingUser.id);
    }
  };

  const loginAsRole = (role: string) => {
    setRole(role);
    setLoggedIn(true);
  };

  // Google Login Token Handler
  const loginWithGoogleToken = async (idToken: string) => {
    try {
      const res = await fetch('http://localhost:8000/api/auth/google/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Authentication failed' };
      }

      const feRole = mapBackendRoleToFrontend(data.user.role);
      setJwtToken(data.tokens.access);
      setCurrentUserInfo(data.user);
      setLoggedIn(true);
      setCurrentRole(feRole);
      setCurrentUserId(data.user.id);
      setActivePage('dashboard');
      
      // Update local storage explicitly
      localStorage.setItem('bc_access_token', data.tokens.access);
      localStorage.setItem('bc_refresh_token', data.tokens.refresh);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Connection to authentication server failed' };
    }
  };

  // Dev bypass login handler
  const loginBypass = async (email: string) => {
    try {
      const res = await fetch('http://localhost:8000/api/auth/bypass/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Bypass authentication failed' };
      }

      const feRole = mapBackendRoleToFrontend(data.user.role);
      setJwtToken(data.tokens.access);
      setCurrentUserInfo(data.user);
      setLoggedIn(true);
      setCurrentRole(feRole);
      setCurrentUserId(data.user.id);
      setActivePage('dashboard');

      // Update local storage explicitly
      localStorage.setItem('bc_access_token', data.tokens.access);
      localStorage.setItem('bc_refresh_token', data.tokens.refresh);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Connection to development authentication server failed' };
    }
  };

  const updateUserProfile = async (name: string, className: string) => {
    try {
      const token = jwtToken || localStorage.getItem('bc_access_token');
      const res = await fetch('http://localhost:8000/api/auth/profile/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, class_name: className }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to update profile' };
      }

      setCurrentUserInfo(data);

      setUsers((prev) =>
        prev.map((u) =>
          u.email.toLowerCase() === data.email.toLowerCase()
            ? { ...u, name: data.name, className: data.class_name, department: data.department }
            : u
        )
      );

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Server connection failed' };
    }
  };

  const fetchSubmissions = async () => {
    try {
      const token = jwtToken || localStorage.getItem('bc_access_token');
      if (!token) return;

      const res = await fetch('http://localhost:8000/api/submissions/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchSubmissions();
    }
  }, [loggedIn, jwtToken]);

  const logout = () => {
    setLoggedIn(false);
    setCurrentRole('');
    setCurrentUserId(null);
    setJwtToken(null);
    setCurrentUserInfo(null);
    setSubmissions(defaultSubmissions);
    localStorage.removeItem('bc_access_token');
    localStorage.removeItem('bc_refresh_token');
  };

  const setAcademicYear = (year: string) => {
    setSelectedAcademicYear(year);
    setActiveAcademicYear(year);
  };

  const addSubmission = async (newSub: Omit<Submission, 'id'>) => {
    try {
      const token = jwtToken || localStorage.getItem('bc_access_token');
      const res = await fetch('http://localhost:8000/api/submissions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          criteriaId: newSub.criteriaId,
          academicYear: selectedAcademicYear,
          description: newSub.description,
          status: newSub.status,
          remarks: newSub.remarks || '',
          marks: newSub.marks || null,
          proof: newSub.proof || '',
          eventId: newSub.eventId || '',
          evidence: newSub.evidence || null
        })
      });
      if (res.ok) {
        const createdSub = await res.json();
        setSubmissions((prev) => [createdSub, ...prev]);
      } else {
        const data = await res.json();
        console.error('Failed to create submission:', data.error);
      }
    } catch (err: any) {
      console.error('Server connection failed during submission creation:', err);
    }
  };

  const updateSubmission = async (id: number, updates: Partial<Submission>) => {
    try {
      const token = jwtToken || localStorage.getItem('bc_access_token');
      const res = await fetch(`http://localhost:8000/api/submissions/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          criteriaId: updates.criteriaId,
          academicYear: updates.academicYear,
          description: updates.description,
          status: updates.status,
          remarks: updates.remarks,
          marks: updates.marks,
          proof: updates.proof,
          eventId: updates.eventId,
          evidence: updates.evidence,
          evaluatorVerified: updates.evaluatorVerified
        })
      });
      if (res.ok) {
        const updatedSub = await res.json();
        setSubmissions((prev) =>
          prev.map((s) => (s.id === id ? updatedSub : s))
        );
      } else {
        const data = await res.json();
        console.error('Failed to update submission:', data.error);
      }
    } catch (err: any) {
      console.error('Server connection failed during submission update:', err);
    }
  };

  const deleteSubmission = async (id: number) => {
    try {
      const token = jwtToken || localStorage.getItem('bc_access_token');
      const res = await fetch(`http://localhost:8000/api/submissions/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
      } else {
        console.error('Failed to delete submission');
      }
    } catch (err: any) {
      console.error('Server connection failed during submission deletion:', err);
    }
  };

  const addCriteriaItem = (categoryId: string, item: Omit<CriteriaItem, 'id'>) => {
    const allItems = criteriaCatalog.flatMap((c) => c.items);
    const nextId = allItems.reduce((max, i) => Math.max(max, i.id), 0) + 1;
    setCriteriaCatalog((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            items: [...cat.items, { ...item, id: nextId }]
          };
        }
        return cat;
      })
    );
  };

  const updateCriteriaItem = (categoryId: string, itemId: number, updates: Partial<CriteriaItem>) => {
    setCriteriaCatalog((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            items: cat.items.map((i) => (i.id === itemId ? { ...i, ...updates } : i))
          };
        }
        return cat;
      })
    );
  };

  const deleteCriteriaItem = (categoryId: string, itemId: number) => {
    setCriteriaCatalog((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            items: cat.items.filter((i) => i.id !== itemId)
          };
        }
        return cat;
      })
    );
  };

  const addUser = (newUser: Omit<AppUser, 'id'>) => {
    const nextId = users.reduce((max, u) => Math.max(max, u.id), 0) + 1;
    const user: AppUser = { ...newUser, id: nextId, isApproved: true };
    setUsers((prev) => [...prev, user]);
  };

  const toggleUserApproval = (userId: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isApproved: !u.isApproved } : u))
    );
  };

  const toggleSubmissionOpen = () => setSubmissionOpen((prev) => !prev);
  const toggleEvaluationOpen = () => setEvaluationOpen((prev) => !prev);

  const addStudent = (newStud: Omit<Student, 'id'>) => {
    const nextId = students.reduce((max, s) => Math.max(max, s.id), 0) + 1;
    const student: Student = { ...newStud, id: nextId };
    setStudents((prev) => [...prev, student]);
  };

  const deleteStudent = (id: number) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const addUserGroup = (newGrp: Omit<UserGroup, 'id'>) => {
    const id = `grp-${Date.now()}`;
    const group: UserGroup = { ...newGrp, id, emails: newGrp.emails || [] };
    setUserGroups((prev) => [...prev, group]);
  };

  const deleteUserGroup = (groupId: string) => {
    setUserGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  const addUserToGroup = (groupId: string, email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return false;
    let added = false;
    setUserGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          if (!g.emails.includes(cleanEmail)) {
            added = true;
            return { ...g, emails: [...g.emails, cleanEmail] };
          }
        }
        return g;
      })
    );
    return added;
  };

  const currentUserEmail = currentUserInfo?.email || users.find((u) => u.id === currentUserId)?.email || '';

  const isStudentRep = React.useMemo(() => {
    if (!currentUserEmail) return false;
    const cleanEmail = currentUserEmail.trim().toLowerCase();
    const repGroup = userGroups.find(
      (g) => g.id === 'grp-student-reps' || g.name.toLowerCase().includes('student representative') || g.name.toLowerCase().includes('student rep')
    );
    if (!repGroup || !Array.isArray(repGroup.emails)) return false;
    return repGroup.emails.some((e) => e.trim().toLowerCase() === cleanEmail);
  }, [currentUserEmail, userGroups]);

  const toggleStudentRepMode = () => {
    if (!currentUserEmail) return;
    const cleanEmail = currentUserEmail.trim().toLowerCase();
    const repGroup = userGroups.find(
      (g) => g.id === 'grp-student-reps' || g.name.toLowerCase().includes('student representative') || g.name.toLowerCase().includes('student rep')
    );
    if (!repGroup) return;

    if (repGroup.emails.map(e => e.toLowerCase()).includes(cleanEmail)) {
      removeUserFromGroup(repGroup.id, currentUserEmail);
    } else {
      addUserToGroup(repGroup.id, currentUserEmail);
    }
  };

  const removeUserFromGroup = (groupId: string, email: string) => {
    setUserGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return { ...g, emails: g.emails.filter((e) => e.toLowerCase() !== email.toLowerCase()) };
        }
        return g;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        activePage,
        loggedIn,
        currentUserId,
        currentStudentId,
        selectedAcademicYear,
        activeAcademicYear,
        academicYears,
        submissionOpen,
        evaluationOpen,
        submissions,
        criteriaCatalog,
        users,
        students,
        userGroups,
        jwtToken,
        currentUserInfo,
        setRole,
        setActivePage,
        setAcademicYear,
        addSubmission,
        updateSubmission,
        deleteSubmission,
        addCriteriaItem,
        updateCriteriaItem,
        deleteCriteriaItem,
        addUser,
        toggleUserApproval,
        toggleSubmissionOpen,
        toggleEvaluationOpen,
        loginAsRole,
        loginWithGoogleToken,
        loginBypass,
        logout,
        addStudent,
        deleteStudent,
        addUserGroup,
        deleteUserGroup,
        isStudentRep,
        toggleStudentRepMode,
        addUserToGroup,
        removeUserFromGroup,
        updateUserProfile
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppContextProvider');
  }
  return context;
};
