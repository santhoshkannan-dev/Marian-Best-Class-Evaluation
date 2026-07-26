'use client';

import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section
      style={{
        textAlign: 'center',
        padding: '60px 24px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        animation: 'fadeUp 1s ease-out'
      }}
    >
      <span
        style={{
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          fontSize: '0.84rem',
          fontWeight: 800,
          color: '#4f46e5',
          background: 'rgba(79, 70, 229, 0.08)',
          padding: '6px 16px',
          borderRadius: '20px'
        }}
      >
        Competition Policy & Rules
      </span>
      <h1
        style={{
          fontSize: '3rem',
          fontWeight: 800,
          lineHeight: 1.1,
          color: '#0f172a',
          maxWidth: '800px',
          margin: 0
        }}
      >
        Best Class Evaluation Policy
      </h1>
      <p
        style={{
          fontSize: '1.15rem',
          color: '#475569',
          lineHeight: 1.6,
          maxWidth: '700px',
          margin: 0
        }}
      >
        A transparent, evidence-based evaluation system that promotes academic excellence, leadership, innovation, social responsibility, and holistic student development.
      </p>
    </section>
  );
};
