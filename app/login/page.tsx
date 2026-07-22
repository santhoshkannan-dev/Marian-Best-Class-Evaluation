'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function LoginPage() {
  const router = useRouter();
  const { loginAsRole, loggedIn, currentRole } = useApp();
  const [selectedRole, setSelectedRole] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    if (loggedIn && currentRole) {
      const role = currentRole.toLowerCase();
      if (role === 'student') {
        router.push('/student/dashboard');
      } else if (role === 'teacher') {
        router.push('/teacher/dashboard');
      } else if (role === 'iqac') {
        router.push('/iqac/dashboard');
      } else if (role === 'admin') {
        router.push('/admin/academic-years');
      }
    }
  }, [loggedIn, currentRole, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      setErrorMsg('Please select a role to continue.');
      return;
    }
    loginAsRole(selectedRole);
    if (selectedRole.toLowerCase() === 'student') {
      router.push('/student/dashboard');
    } else if (selectedRole.toLowerCase() === 'teacher') {
      router.push('/teacher/dashboard');
    } else if (selectedRole.toLowerCase() === 'iqac') {
      router.push('/iqac/dashboard');
    } else if (selectedRole.toLowerCase() === 'admin') {
      router.push('/admin/academic-years');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="login-page-container">
      <main className="login-layout">
        {/* Left Visual Card */}
        <section className="login-visual">
          <div className="visual-copy">
            <p className="visual-kicker">MARIAN COLLEGE, KUTTIKKANAM</p>
            <h1 className="visual-title">Marian Best Class</h1>
            <p className="visual-lead">Recognize. Evaluate. Excel together.</p>
            <p className="visual-desc">
              A smart way to track, verify and celebrate class achievements across Marian College Kuttikkanam.
            </p>
            <p className="visual-tagline">SIMPLE. SMART. EFFECTIVE.</p>
          </div>
        </section>

        {/* Right Form Card */}
        <section className="login-panel">
          <div className="login-card">
            <img className="card-logo" src="/Assets/Images/College-logo.png" alt="Marian College Logo" />

            <div className="card-heading">
              <p>Select your role to continue</p>
            </div>

            {errorMsg && (
              <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#991b1b', borderRadius: '10px', marginBottom: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="role-select">SELECT ROLE</label>
                <div className="select-wrapper">
                  <select
                    id="role-select"
                    value={selectedRole}
                    onChange={(e) => {
                      setSelectedRole(e.target.value);
                      setErrorMsg('');
                    }}
                    required
                  >
                    <option value="" disabled>Select your role</option>
                    <option value="student">Student/DQC Member</option>
                    <option value="teacher">Class Teacher</option>
                    <option value="evaluator">Evaluator</option>
                    <option value="admin">Admin</option>
                    <option value="hod">HOD</option>
                    <option value="iqac">IQAC</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-continue">
                <span>Continue</span>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </form>

            <div className="card-accent">
              <span className="accent-line"></span>
              <span className="accent-diamond"></span>
              <span className="accent-line"></span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
