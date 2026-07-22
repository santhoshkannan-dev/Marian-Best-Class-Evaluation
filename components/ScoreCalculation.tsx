'use client';

import React from 'react';

export const ScoreCalculation: React.FC = () => {
  return (
    <section style={{ padding: '60px 24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>Score Calculation Section</h2>
        <p className="muted" style={{ fontSize: '0.96rem', marginTop: '6px' }}>Dynamic formulation used to rank student batches.</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          alignItems: 'center',
          gap: '20px',
          position: 'relative'
        }}
      >
        {/* Card 1: Obtained Marks */}
        <div
          className="card"
          style={{
            background: 'rgba(255, 255, 255, 0.75)',
            border: '1.5px solid var(--glass-border)',
            borderRadius: '20px',
            padding: '24px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📝</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>Obtained Marks</h3>
          <p className="muted" style={{ fontSize: '0.8rem', lineHeight: 1.4, margin: 0 }}>Sum of approved points from all 13 evaluation categories.</p>
        </div>

        {/* Plus Arrow */}
        <div style={{ textAlign: 'center', fontSize: '1.8rem', color: '#4f46e5', fontWeight: 800 }}>+</div>

        {/* Card 2: Moderation Marks */}
        <div
          className="card"
          style={{
            background: 'rgba(255, 255, 255, 0.75)',
            border: '1.5px solid var(--glass-border)',
            borderRadius: '20px',
            padding: '24px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚖</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>Moderation Marks</h3>
          <p className="muted" style={{ fontSize: '0.8rem', lineHeight: 1.4, margin: 0 }}>Special moderation or deduction offsets reviewed by IQAC.</p>
        </div>

        {/* Equals Arrow */}
        <div style={{ textAlign: 'center', fontSize: '1.8rem', color: '#ec4899', fontWeight: 800 }}>=</div>

        {/* Card 3: Total Score */}
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
            color: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            textAlign: 'center',
            boxShadow: '0 10px 25px rgba(79, 70, 229, 0.15)'
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📊</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 6px 0' }}>Total Score</h3>
          <p style={{ fontSize: '0.8rem', lineHeight: 1.4, opacity: 0.9, margin: 0 }}>Aggregate sum divided by the number of students to output the Index.</p>
        </div>
      </div>

      {/* Explanation Banner */}
      <div
        className="card"
        style={{
          marginTop: '30px',
          background: 'rgba(255, 255, 255, 0.85)',
          border: '1.5px solid var(--glass-border)',
          borderRadius: '16px',
          padding: '20px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>Class Index Calculation Formula:</h4>
          <code style={{ fontSize: '0.94rem', fontWeight: 700, color: '#4f46e5' }}>
            Class Index = (Obtained Marks + Moderation Marks) / Total Students
          </code>
        </div>
        <span
          style={{
            background: '#dcfce7',
            color: '#15803d',
            padding: '6px 14px',
            borderRadius: '12px',
            fontSize: '0.78rem',
            fontWeight: 800
          }}
        >
          Dynamic Indexing
        </span>
      </div>
    </section>
  );
};
