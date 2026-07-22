'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CriteriaCategory,
  CriteriaItem,
  Student,
  Submission,
  AppUser,
  defaultCriteriaCatalog,
  defaultStudents,
  defaultSubmissions,
  defaultUsers,
  defaultAcademicYears
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
  logout: () => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  deleteStudent: (id: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'bc_persistent_state';

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
          if (data.activeAcademicYear) {
            setActiveAcademicYear(data.activeAcademicYear);
            setSelectedAcademicYear(data.activeAcademicYear);
          }
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
          students
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
    students
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

  const logout = () => {
    setLoggedIn(false);
  };

  const setAcademicYear = (year: string) => {
    setSelectedAcademicYear(year);
    setActiveAcademicYear(year);
  };

  const addSubmission = (newSub: Omit<Submission, 'id'>) => {
    const nextId = submissions.reduce((max, s) => Math.max(max, s.id), 0) + 1;
    const item: Submission = {
      ...newSub,
      id: nextId,
      academicYear: selectedAcademicYear
    };
    setSubmissions((prev) => [item, ...prev]);
  };

  const updateSubmission = (id: number, updates: Partial<Submission>) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const deleteSubmission = (id: number) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
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
        logout,
        addStudent,
        deleteStudent
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
