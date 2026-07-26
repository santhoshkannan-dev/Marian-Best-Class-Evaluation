'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { loggedIn, logout, selectedAcademicYear } = useApp();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!loggedIn) {
      router.push('/login');
    }
  }, [loggedIn, router]);

  if (!loggedIn) {
    return null;
  }

  const teacherNav = [
    { id: 'dashboard', label: 'Dashboard', href: '/teacher/dashboard' },
    { id: 'verification', label: 'Verification', href: '/teacher/verification' },
    { id: 'student-management', label: 'Student Management', href: '/teacher/student-management' },
  ];

  const currentNav = teacherNav.find((i) => pathname === i.href);
  const headerTitle = currentNav ? currentNav.label : 'Teacher Dashboard';

  return (
    <div className="portal-shell-grid">
      <aside className="portal-sidebar">
        <div>
          <div className="portal-brand">
            <div className="portal-brand-badge">BC</div>
            <div>
              <h2 className="portal-brand-title">Best Class</h2>
              <p className="portal-brand-sub">Evaluation Panel</p>
            </div>
          </div>

          <nav>
            <ul className="portal-nav-list">
              {teacherNav.map((item) => {
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
          Class Teacher
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                background: '#dcfce7',
                color: '#15803d',
                fontSize: '0.84rem',
                fontWeight: 700,
                textTransform: 'capitalize'
              }}
            >
              Class Teacher
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
