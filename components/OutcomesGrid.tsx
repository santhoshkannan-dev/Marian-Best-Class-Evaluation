'use client';

import React from 'react';

interface OutcomeCard {
  title: string;
  desc: string;
  icon: string;
  color: string;
}

export const OutcomesGrid: React.FC = () => {
  const outcomes: OutcomeCard[] = [
    { title: 'Academic Excellence', desc: 'Promoting a culture of consistent grades and higher pass rates.', icon: '🎓', color: '#3b82f6' },
    { title: 'Leadership Development', desc: 'Fostering organization capabilities, representation, and public speaking.', icon: '👨‍💼', color: '#06b6d4' },
    { title: 'Library Usage', desc: 'Rewarding extensive book borrowings and self-study hours.', icon: '📚', color: '#8b5cf6' },
    { title: 'Teamwork & Synergy', desc: 'Supporting group competitions, projects, and collaborative seminars.', icon: '🤝', color: '#ec4899' },
    { title: 'Research & Innovation', desc: 'Inspiring conference publications, scientific research, and patents.', icon: '🔬', color: '#14b8a6' },
    { title: 'Institution Branding', desc: 'Spreading visibility through state, national, and external awards.', icon: '🏆', color: '#f43f5e' },
    { title: 'Faculty Collaboration', desc: 'Bridging teachers and students to streamline profile verifications.', icon: '📅', color: '#e11d48' },
    { title: 'Digital Repository', desc: 'Centralizing proof records and ABC credits in Digilocker.', icon: '📂', color: '#6b7280' },
    { title: 'Student Responsibility', desc: 'Encouraging self-discipline, NSS participation, and community camp values.', icon: '❤️', color: '#10b981' }
  ];

  return (
    <section style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>Expected Outcomes</h2>
        <p className="muted" style={{ fontSize: '0.96rem', marginTop: '6px' }}>What this evaluation system accomplishes for the student cohort.</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}
      >
        {outcomes.map((item, index) => (
          <div
            key={index}
            className="card"
            style={{
              background: 'rgba(255, 255, 255, 0.75)',
              border: '1.5px solid var(--glass-border)',
              borderRadius: '20px',
              padding: '24px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 10px 25px rgba(15, 23, 42, 0.04)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: `${item.color}15`,
                color: item.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                flexShrink: 0
              }}
            >
              {item.icon}
            </div>

            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>{item.title}</h3>
              <p className="muted" style={{ fontSize: '0.8rem', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
