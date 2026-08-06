'use client';

import React from 'react';

interface OutcomeItem {
  title: string;
  icon: string;
  color: string;
}

export const OutcomesGrid: React.FC = () => {
  const outcomes: OutcomeItem[] = [
    { title: 'Enhanced Academic Responsibility', icon: '🎓', color: '#3b82f6' },
    { title: 'Strengthened Teamwork and Collective Ownership', icon: '🤝', color: '#ec4899' },
    {
      title: 'Reduced behavioral issues and increased engagement in curricular and co-curricular activities',
      icon: '❤️',
      color: '#10b981'
    },
    { title: 'Increased Participation in Institutional Activities', icon: '🏆', color: '#f43f5e' },
    { title: 'Higher Library and Repository Engagement', icon: '📚', color: '#8b5cf6' },
    { title: 'Development of Leadership and Responsibility Roles', icon: '👨‍💼', color: '#06b6d4' },
    { title: 'Recognition of Quality Improvement Initiatives', icon: '💡', color: '#f59e0b' },
    { title: 'Strengthened Faculty–Student Collaboration', icon: '📅', color: '#14b8a6' },
    { title: 'Institutional Branding and Good Practices', icon: '🏢', color: '#6b7280' },
    { title: 'Enhanced overall academic reputation of the institution', icon: '📈', color: '#3b82f6' }
  ];

  return (
    <section style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>Expected Outcomes</h2>
        <p className="muted" style={{ fontSize: '0.96rem', marginTop: '6px' }}>Impact and benefits generated across the student cohort.</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '50px'
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
              alignItems: 'center'
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
              <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.4 }}>{item.title}</h3>
            </div>
          </div>
        ))}
      </div>    </section>
  );
};
