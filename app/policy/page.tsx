'use client';

import React from 'react';
import Link from 'next/link';

export default function PolicyPage() {
  return (
    <main style={{ maxWidth: '960px', margin: '60px auto', padding: '0 24px' }}>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '20px' }}>
          <span className="eyebrow">Competition Policy & Rules</span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '8px' }}>
            Best Class Verification Workflow Guidelines
          </h1>
          <p className="muted" style={{ marginTop: '8px', fontSize: '1rem' }}>
            Official guidelines and scoring standards for Marian College Kuttikkanam Best Class Competition.
          </p>
        </div>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>1. Submission Standards</h2>
          <p style={{ color: 'var(--color-text-soft)', lineHeight: 1.6 }}>
            All claims made by students or class representatives must be supported by valid verification proof (such as official result spreadsheets, certificates, or letters signed by authority). Claims submitted without documentation will be placed under &quot;Correction Requested&quot; status.
          </p>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>2. Teacher Verification Process</h2>
          <p style={{ color: 'var(--color-text-soft)', lineHeight: 1.6 }}>
            Class Teachers review all submitted activities from their assigned class section. Teachers have the authority to Approve, Reject, or Request Correction on any submission. Once verified, submissions move forward to the Evaluation Team.
          </p>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>3. Evaluation Team Scoring & Fallbacks</h2>
          <p style={{ color: 'var(--color-text-soft)', lineHeight: 1.6 }}>
            The Central Evaluation Team conducts independent verification and assigns marks based on predefined criteria rules (e.g., S Grade Course: 5 pts, A+ Grade: 3 pts, NPTEL Course: 10 pts). Evaluators can utilize the single-step &quot;Verify & Save&quot; workflow or apply manual overrides when special conditions arise.
          </p>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>4. Leaderboard & IQAC Monitoring</h2>
          <p style={{ color: 'var(--color-text-soft)', lineHeight: 1.6 }}>
            Class totals are calculated dynamically across categories (Academics, Online Courses, Internships, Research, Leadership, etc.). IQAC and HODs monitor overall progress, providing remarks and analytical feedback before final academic year awards.
          </p>
        </section>

        <div style={{ marginTop: '12px', paddingTop: '20px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end' }}>
          <Link href="/" className="btn btn-primary">
            &larr; Back to Main Workspace
          </Link>
        </div>
      </div>
    </main>
  );
}
