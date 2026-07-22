'use client';

import React from 'react';
import { policyCategories } from './policyData';

export const EvaluationGrid: React.FC = () => {
  return (
    <section style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>Best Class Evaluation Criteria</h2>
        <p className="muted" style={{ fontSize: '0.96rem', marginTop: '6px' }}>Detailed breakdown of standards across thirteen categories.</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}
      >
        {policyCategories.map((c) => (
          <div
            key={c.id}
            className="card"
            style={{
              background: 'rgba(255, 255, 255, 0.75)',
              border: '1.5px solid var(--glass-border)',
              borderRadius: '20px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'none',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              minHeight: '220px',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(79, 70, 229, 0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '1.4rem' }}>{c.icon}</span>
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#4f46e5',
                    background: 'rgba(79, 70, 229, 0.06)',
                    padding: '4px 10px',
                    borderRadius: '12px'
                  }}
                >
                  Max: {c.maxMarks}
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>{c.title}</h3>
              <p className="muted" style={{ fontSize: '0.84rem', lineHeight: 1.5, margin: '0 0 16px 0' }}>{c.description}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '14px' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)' }}>Interactive Metrics</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#4f46e5', cursor: 'pointer' }}>View Details &rarr;</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
