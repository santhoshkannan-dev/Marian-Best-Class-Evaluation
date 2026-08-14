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
    { id: 'groups', label: 'User Groups', href: '/admin/groups' },
    { id: 'departments', label: 'Department Management', href: '/admin/departments' },
    { id: 'settings', label: 'Settings', href: '/admin/settings' },
  ];

  const currentNav = adminNav.find((i) => pathname === i.href);
  const headerTitle = currentNav ? currentNav.label : 'Academic Years';

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex text-slate-800 relative font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Background Watermark Geometry */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40 z-0"
        style={{
          backgroundImage: 'radial-gradient(#CBD5E1 1.2px, transparent 1.2px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* Left Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-[#E5E7EB] z-40 flex flex-col justify-between p-6 transition-transform duration-300 ease-in-out md:translate-x-0 ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div>
          {/* Mobile Sidebar Close */}
          <button
            className="md:hidden absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close Navigation"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Logo / Header */}
          <div className="flex items-center gap-3.5 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center p-1.5 shadow-sm">
              <img src="/Assets/Images/marian-best-logo-removebg-preview.png" alt="Marian Emblem" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#111827] tracking-tight leading-tight">Excellence Grid</h2>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF]">Evaluation Panel</p>
            </div>
          </div>

          {/* Nav Menu */}
          <nav>
            <ul className="space-y-2">
              {adminNav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-5 py-3 rounded-full text-xs font-bold transition-all duration-200 ${
                        isActive
                          ? 'bg-[#4F46E5] text-white shadow-md shadow-indigo-500/20'
                          : 'text-[#4B5563] hover:bg-slate-100 hover:text-[#111827]'
                      }`}
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

        {/* Footer Item Role Badge */}
        <div className="border border-[#E5E7EB] bg-slate-50/70 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-extrabold text-slate-700 tracking-wide">Role: Admin</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full">Active</span>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 md:hidden"
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 md:pl-72 flex flex-col min-h-screen relative z-10">
        {/* Header Bar Area */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB] px-8 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-slate-600 hover:text-slate-900 p-1"
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
              <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight leading-none mb-1">{headerTitle}</h1>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF]">
                Academic Year {selectedAcademicYear || '2026-2027'}
              </p>
            </div>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3">
            <a
              href="http://localhost:8000/admin/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1B4332] hover:bg-[#123024] text-white text-xs font-extrabold px-5 py-2.5 rounded-full transition-all duration-200 shadow-sm active:scale-95 text-decoration-none"
            >
              <span>⚙</span> Open Django Administration
            </a>
            <span className="bg-[#F3E8FF] text-[#9333EA] text-xs font-extrabold px-4 py-1.5 rounded-full tracking-wide">
              Admin
            </span>
            <button
              className="border border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-slate-50 hover:text-slate-900 text-xs font-bold px-5 py-2 rounded-full transition-all duration-200 active:scale-95"
              onClick={() => {
                logout();
                router.push('/login');
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
