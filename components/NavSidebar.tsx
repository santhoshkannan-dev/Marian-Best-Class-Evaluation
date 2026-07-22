'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export const NavSidebar: React.FC = () => {
  const pathname = usePathname();
  const { loggedIn } = useApp();

  // Hide floating sidebar inside portal workspaces to prevent double sidebar overlap
  const isPortalRoute = ['/student', '/teacher', '/admin', '/hod', '/evaluator', '/iqac'].some(
    (prefix) => pathname.startsWith(prefix)
  );

  if (isPortalRoute) {
    return null;
  }

  return (
    <aside className="nav-sidebar" aria-label="Quick Navigation">
      <div className="nav-line" aria-hidden="true"></div>

      {/* 1. Home */}
      <Link
        href="/"
        id="btn-nav-home"
        className={`nav-btn ${pathname === '/' ? 'active' : ''}`}
        data-tooltip="Home/Dashboard"
        aria-label="Home/Dashboard"
      >
        <img src="/Assets/Images/hands_logo.png" alt="Marian Logo" />
      </Link>

      {/* 2. Login */}
      <Link
        href="/login"
        className={`nav-btn ${pathname === '/login' ? 'active' : ''}`}
        data-tooltip="Login"
        aria-label="Login"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" x2="3" y1="12" y2="12" />
        </svg>
      </Link>

      {/* 3. Criteria */}
      <Link
        href="/policy"
        className={`nav-btn ${pathname === '/policy' ? 'active' : ''}`}
        data-tooltip="Policy Criteria"
        aria-label="Policy Criteria"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </Link>
    </aside>
  );
};