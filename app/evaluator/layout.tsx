'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function EvaluatorLayout({ children }: { children: React.ReactNode }) {
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

  const evaluatorNav = [
    { id: 'dashboard', label: 'Dashboard', href: '/evaluator/dashboard' },
    { id: 'evaluation', label: 'Evaluation', href: '/evaluator/evaluation' },
  ];

  const currentNav = evaluatorNav.find((i) => pathname === i.href);
  const headerTitle = currentNav ? currentNav.label : 'Evaluator Dashboard';

  return (
    <div className="portal-shell-grid" style={{ minHeight: '100vh', background: '#faf6f0' }}>
      <aside className="portal-sidebar" style={{ background: '#361e12', color: '#ffffff' }}>
        <div>
          <div className="portal-brand">
            <div className="portal-brand-badge" style={{ background: '#ea580c', color: '#ffffff' }}>BC</div>
            <div>
              <h2 className="portal-brand-title" style={{ color: '#ffffff' }}>Best Class</h2>
              <p className="portal-brand-sub" style={{ color: '#fdba74' }}>Evaluation Panel</p>
            </div>
          </div>

          <nav>
            <ul className="portal-nav-list">
              {evaluatorNav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={`portal-nav-btn ${isActive ? 'active' : ''}`}
                      style={{
                        textDecoration: 'none',
                        color: isActive ? '#ffffff' : '#fed7aa',
                        background: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                        fontWeight: 700
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="portal-sidebar-footer" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', color: '#fdba74' }}>
          Evaluator
        </div>
      </aside>

      <div className="portal-content-area" style={{ background: '#faf6f0' }}>
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
            opacity: 0.04,
            filter: 'blur(3px)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        <header className="portal-topbar" style={{ background: '#ffffff', borderBottom: '1px solid #fed7aa' }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#361e12' }}>{headerTitle}</h1>
            <p className="muted" style={{ fontSize: '0.84rem' }}>Academic Year {selectedAcademicYear || '2025-2026'}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                background: '#ffedd5',
                color: '#ea580c',
                fontSize: '0.84rem',
                fontWeight: 700,
                textTransform: 'capitalize'
              }}
            >
              Evaluator
            </span>
            <button
              className="btn btn-secondary"
              style={{
                padding: '8px 18px',
                borderRadius: '10px',
                fontSize: '0.88rem',
                fontWeight: 700,
                border: '1px solid #fdba74',
                color: '#361e12'
              }}
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
