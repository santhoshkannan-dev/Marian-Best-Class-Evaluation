'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { loggedIn, logout, selectedAcademicYear, isStudentRep, toggleStudentRepMode } = useApp();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!loggedIn) {
      router.push('/login');
    }
  }, [loggedIn, router]);

  if (!loggedIn) {
    return null;
  }

  const studentNav = [
    { id: 'dashboard', label: 'Dashboard', href: '/student/dashboard' },
    { id: 'submit', label: 'Submit Activity', href: '/student/submit' },
    { id: 'submissions', label: 'My Submissions', href: '/student/submissions' },
    ...(isStudentRep
      ? [{ id: 'verification', label: 'Group Verification', href: '/student/verification' }]
      : []),
    { id: 'profile', label: 'My Profile', href: '/student/profile' },
  ];

  const currentNav = studentNav.find((i) => pathname === i.href);
  const headerTitle = currentNav ? currentNav.label : 'Student Dashboard';

  return (
    <div className="portal-shell-grid">
      <aside className="portal-sidebar">
        <div>
          <div className="portal-brand">
            <img src="/Assets/Images/marian-best-logo-removebg-preview.png" alt="Marian Logo" style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
            <div>
              <h2 className="portal-brand-title">Excellence Grid</h2>
              <p className="portal-brand-sub">Evaluation Panel</p>
            </div>
          </div>

          <nav>
            <ul className="portal-nav-list">
              {studentNav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={`portal-nav-btn ${isActive ? 'active' : ''}`}
                      style={{ textDecoration: 'none' }}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="portal-sidebar-footer">
          {isStudentRep ? 'Student Representative' : 'Student'}
        </div>
      </aside>

      <div className="portal-content-area">
        <div
          style={{
            position: 'fixed',
            bottom: '-10%',
            right: '-5%',
            width: '650px',
            height: '650px',
            backgroundImage: 'url("/Assets/Images/hands_logo.png")',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            opacity: 0.06,
            filter: 'blur(3px)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        <header className="portal-topbar">
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>{headerTitle}</h1>
            <p className="muted" style={{ fontSize: '0.84rem' }}>Academic Year {selectedAcademicYear || '2025-2026'}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                background: isStudentRep ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#e0e7ff',
                color: isStudentRep ? '#ffffff' : '#3730a3',
                fontSize: '0.84rem',
                fontWeight: 700,
                boxShadow: isStudentRep ? '0 2px 8px rgba(99, 102, 241, 0.3)' : 'none'
              }}
            >
              {isStudentRep ? '⭐ Student Rep Group Member' : 'Student'}
            </span>

            <button
              className="btn btn-secondary"
              style={{ padding: '8px 18px', borderRadius: '10px', fontSize: '0.88rem', fontWeight: 700 }}
              onClick={() => {
                logout();
                router.push('/login');
              }}
            >
              Logout
            </button>
          </div>
        </header>

        <main style={{ padding: '36px', flex: 1, position: 'relative', zIndex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
