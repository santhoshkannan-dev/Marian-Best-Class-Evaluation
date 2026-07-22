'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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

  const adminNav = [
    { id: 'years', label: 'Academic Years', href: '/admin/academic-years' },
    { id: 'criteria', label: 'Criteria Management', href: '/admin/criteria' },
    { id: 'users', label: 'User Management', href: '/admin/users' },
    { id: 'departments', label: 'Department Management', href: '/admin/departments' },
    { id: 'settings', label: 'Settings', href: '/admin/settings' },
  ];

  const currentNav = adminNav.find((i) => pathname === i.href);
  const headerTitle = currentNav ? currentNav.label : 'Academic Years';

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
              {adminNav.map((item) => {
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
          Admin
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
                background: '#f3e8ff',
                color: '#7e22ce',
                fontSize: '0.84rem',
                fontWeight: 700,
                textTransform: 'capitalize'
              }}
            >
              Admin
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
