'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { loggedIn, logout, selectedAcademicYear } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    { id: 'groups', label: 'User Groups', href: '/admin/groups' },
    { id: 'departments', label: 'Department Management', href: '/admin/departments' },
    { id: 'settings', label: 'Settings', href: '/admin/settings' },
  ];

  const currentNav = adminNav.find((i) => pathname === i.href);
  const headerTitle = currentNav ? currentNav.label : 'Academic Years';

  return (
    <div className="portal-shell-grid">
      <aside className={`portal-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button
          className="mobile-sidebar-close"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close Navigation"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

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
              {adminNav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={`portal-nav-btn ${isActive ? 'active' : ''}`}
                      style={{ textDecoration: 'none' }}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="portal-sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>Admin</div>
          <button
            className="btn btn-secondary btn-sm mobile-logout-btn"
            style={{
              width: '100%',
              marginTop: '6px',
              padding: '6px',
              fontSize: '0.8rem',
              background: '#fee2e2',
              color: '#dc2626',
              border: '1px solid #fca5a5'
            }}
            onClick={() => {
              logout();
              router.push('/login');
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="portal-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="mobile-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle Navigation"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>{headerTitle}</h1>
              <p className="muted" style={{ fontSize: '0.84rem' }}>Academic Year {selectedAcademicYear || '2025-2026'}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <a
              href="http://localhost:8000/admin/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.86rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #092e20, #0f5132)',
                color: '#ffffff',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ⚙️ Open Django Administration
            </a>
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
