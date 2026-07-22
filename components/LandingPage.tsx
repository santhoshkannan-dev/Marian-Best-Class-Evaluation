'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface StandingItem {
  className: string;
  department: string;
  totalScore: number;
  percentage: number;
  color: string;
}

interface Champion {
  rank: number;
  rankLabel: string;
  teamName: string;
  eventName: string;
  score: string;
  institution: string;
  image: string;
}

const championsData: Record<string, Champion[]> = {
  "2025": [
    {
      rank: 2,
      rankLabel: "RUNNER-UP",
      teamName: "BCom C",
      eventName: "Dept. of Commerce — Marian Best Class",
      score: "95.7",
      institution: "Dept. of Commerce",
      image: "/Assets/Images/team_vision.png"
    },
    {
      rank: 1,
      rankLabel: "👑 CHAMPION",
      teamName: "BSc CS B",
      eventName: "Dept. of Computer Science — Marian Best Class",
      score: "98.4",
      institution: "Dept. of Comp Science",
      image: "/Assets/Images/team_alpha.png"
    },
    {
      rank: 3,
      rankLabel: "2ND RUNNER-UP",
      teamName: "BCA A",
      eventName: "Dept. of Computer Applications — Marian Best Class",
      score: "94.2",
      institution: "Dept. of BCA",
      image: "/Assets/Images/team_nexus.png"
    },
    {
      rank: 4,
      rankLabel: "4TH PLACE",
      teamName: "BA English B",
      eventName: "Dept. of English — Marian Best Class",
      score: "91.5",
      institution: "Dept. of English",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80"
    },
    {
      rank: 5,
      rankLabel: "5TH PLACE",
      teamName: "BBA B",
      eventName: "Dept. of Business Admin — Marian Best Class",
      score: "89.0",
      institution: "Dept. of BBA",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=400&q=80"
    }
  ],
  "2024": [
    {
      rank: 2,
      rankLabel: "RUNNER-UP",
      teamName: "BSc CS A",
      eventName: "Dept. of Computer Science — Marian Best Class",
      score: "96.3",
      institution: "Dept. of Comp Science",
      image: "/Assets/Images/team_vision.png"
    },
    {
      rank: 1,
      rankLabel: "👑 CHAMPION",
      teamName: "BCA A",
      eventName: "Dept. of Computer Applications — Marian Best Class",
      score: "99.1",
      institution: "Dept. of BCA",
      image: "/Assets/Images/team_nexus.png"
    },
    {
      rank: 3,
      rankLabel: "2ND RUNNER-UP",
      teamName: "BCom B",
      eventName: "Dept. of Commerce — Marian Best Class",
      score: "93.8",
      institution: "Dept. of Commerce",
      image: "/Assets/Images/team_alpha.png"
    }
  ],
  "2023": [
    {
      rank: 1,
      rankLabel: "👑 CHAMPION",
      teamName: "BA English A",
      eventName: "Dept. of English — Marian Best Class",
      score: "97.5",
      institution: "Dept. of English",
      image: "/Assets/Images/team_alpha.png"
    },
    {
      rank: 2,
      rankLabel: "RUNNER-UP",
      teamName: "BBA A",
      eventName: "Dept. of Business Admin — Marian Best Class",
      score: "94.9",
      institution: "Dept. of BBA",
      image: "/Assets/Images/team_vision.png"
    }
  ]
};

const top9Data: StandingItem[] = [
  { className: 'BSc CS B', department: 'Computer Science', totalScore: 1272, percentage: 15.7, color: '#cc2200' },
  { className: 'BCom C', department: 'Commerce', totalScore: 978, percentage: 12.1, color: '#aa1a00' },
  { className: 'BSc CS A', department: 'Computer Science', totalScore: 966, percentage: 11.9, color: '#991500' },
  { className: 'BA English B', department: 'English', totalScore: 930, percentage: 11.5, color: '#880f00' },
  { className: 'BA English A', department: 'English', totalScore: 876, percentage: 10.8, color: '#770a00' },
  { className: 'BBA B', department: 'Business Admin', totalScore: 850, percentage: 10.5, color: '#660600' },
  { className: 'BSc Physics A', department: 'Physics', totalScore: 754, percentage: 9.3, color: '#5a0300' },
  { className: 'BCA A', department: 'Computer Applications', totalScore: 750, percentage: 9.2, color: '#550000' },
  { className: 'BBA A', department: 'Business Admin', totalScore: 730, percentage: 9.0, color: '#3d0000' },
];

export const LandingPage: React.FC = () => {
  const [activeYear, setActiveYear] = useState('2025');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedClass, setSelectedClass] = useState<StandingItem | null>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);

  const currentChampions = championsData[activeYear] || championsData["2025"];

  const handleScrollLeft = () => {
    if (scrollTrackRef.current) {
      scrollTrackRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollTrackRef.current) {
      scrollTrackRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  // SVG Gauge rendering params
  const cx = 250;
  const cy = 310;
  const maxRadius = 220;
  const radiusStep = 17;
  const topScore = top9Data[0].totalScore;

  return (
    <div className="landing-shell">
      <div className="home-layout">
        {/* Header Title */}
        <header className="home-header">
          <h1 className="home-title">Marian Best Class</h1>
          <p className="home-subtitle">Competition Standings & Real-Time Performance Analytics</p>
        </header>

        {/* Submissions Stats Summary Card */}
        <div className="total-submissions-card">
          <div className="submissions-info">
            <div className="submissions-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div className="submissions-details">
              <h3>TOTAL SUBMISSION COUNT</h3>
              <div className="submissions-count">2,954</div>
            </div>
          </div>
          <div className="submissions-stats">
            <div className="stat-item">
              <div className="stat-label">APPROVED CLAIMS</div>
              <div className="stat-val approved">697</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">PENDING REVIEW</div>
              <div className="stat-val pending">791</div>
            </div>
          </div>
        </div>

        {/* Core Analytics Card */}
        <div className="dashboard-core-card">
          <div className="dashboard-grid">
            {/* Left Panel: Class Progress Gauge */}
            <div className="chart-section">
              <div className="chart-heading-container">
                <h2 className="chart-title">Class Progress Gauge</h2>
              </div>

              <div className="svg-container">
                <svg viewBox="-10 0 520 325" width="100%" height="100%">
                  <defs>
                    {top9Data.map((_, idx) => (
                      <linearGradient id={`arc-grad-${idx}`} key={idx} x1="100%" y1="0%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#ff4422" />
                        <stop offset="100%" stopColor="#550000" />
                      </linearGradient>
                    ))}
                  </defs>

                  {/* Scale Ticks & Percentage Labels */}
                  {[
                    { tick: 0, label: '0%' },
                    { tick: 0.25, label: '25%' },
                    { tick: 0.5, label: '50%' },
                    { tick: 0.75, label: '75%' },
                    { tick: 1, label: '100%' }
                  ].map((item, i) => {
                    const theta = item.tick * Math.PI;
                    const rStart = 234;
                    const rEnd = 246;
                    const rLabel = 260;
                    const x1 = cx + rStart * Math.cos(theta);
                    const y1 = cy - rStart * Math.sin(theta);
                    const x2 = cx + rEnd * Math.cos(theta);
                    const y2 = cy - rEnd * Math.sin(theta);
                    const lx = cx + rLabel * Math.cos(theta);
                    const ly = cy - rLabel * Math.sin(theta) + 4;
                    return (
                      <g key={i}>
                        <line x1={x1} y1={y1} x2={x2} y2={y2} className="scale-tick-line" />
                        <text x={lx} y={ly} className="scale-tick-label">{item.label}</text>
                      </g>
                    );
                  })}

                  {/* Concentric Semi-Circle Arcs */}
                  {top9Data.map((item, idx) => {
                    const r = maxRadius - idx * radiusStep;
                    const dPath = `M ${cx + r} ${cy} A ${r} ${r} 0 0 0 ${cx - r} ${cy}`;
                    const pathLen = Math.PI * r;
                    const ratio = item.totalScore / topScore;
                    const progress = Math.max(0.02, ratio * 0.95);
                    const dashOffset = pathLen * (1 - progress);

                    const theta = progress * Math.PI;
                    const labelX = cx + r * Math.cos(theta);
                    const labelY = cy - r * Math.sin(theta) - 5;

                    const isDimmed = hoveredIndex !== null && hoveredIndex !== idx;
                    const isHighlighted = hoveredIndex === idx;

                    return (
                      <g key={idx} style={{ opacity: isDimmed ? 0.25 : 1, transition: 'opacity 0.3s' }}>
                        {/* Background track */}
                        <path d={dPath} className="gauge-track" />
                        {/* Filled Arc */}
                        <path
                          d={dPath}
                          className={`gauge-arc ${isHighlighted ? 'highlighted' : ''}`}
                          stroke={`url(#arc-grad-${idx})`}
                          strokeDasharray={pathLen}
                          strokeDashoffset={dashOffset}
                          style={{ cursor: 'pointer' }}
                          onMouseEnter={() => setHoveredIndex(idx)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          onClick={() => setSelectedClass(item)}
                        />
                        {/* Score Label at tip */}
                        <text
                          x={labelX}
                          y={labelY}
                          className={`arc-tip-label ${isHighlighted ? 'highlighted' : ''}`}
                          textAnchor="middle"
                        >
                          {item.totalScore.toLocaleString()}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Right Panel: Standings or Class Detail View */}
            <div className="leaderboard-section">
              {selectedClass ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{selectedClass.className}</h2>
                      <p className="muted" style={{ fontSize: '0.85rem' }}>{selectedClass.department} Department</p>
                    </div>
                    <button
                      onClick={() => setSelectedClass(null)}
                      style={{ border: 'none', background: '#e2e8f0', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 800 }}
                    >
                      &times;
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', background: '#ffffff', padding: '16px', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <div className="muted" style={{ fontSize: '0.78rem', fontWeight: 600 }}>Total Score</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>{selectedClass.totalScore} pts</div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <div className="muted" style={{ fontSize: '0.78rem', fontWeight: 600 }}>Standing Share</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>{selectedClass.percentage}%</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>📊 Scorecard Breakdown</h3>
                    <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Academics & Grades</span>
                        <span style={{ fontWeight: 700 }}>45.0 pts</span>
                      </div>
                      <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
                        <div style={{ height: '100%', width: '85%', background: 'linear-gradient(90deg, #4f46e5, #3b82f6)', borderRadius: '3px' }}></div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                        <span>NPTEL & MOOC Certifications</span>
                        <span style={{ fontWeight: 700 }}>30.0 pts</span>
                      </div>
                      <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
                        <div style={{ height: '100%', width: '70%', background: 'linear-gradient(90deg, #4f46e5, #3b82f6)', borderRadius: '3px' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="leaderboard-header">
                    <div>
                      <h2 className="chart-title">Top 9 Standings</h2>
                    </div>
                    <div className="total-score-badge">
                      <div className="total-score-val">8,106 pts</div>
                      <div className="total-score-label">TOTAL POINTS • TOP 9</div>
                    </div>
                  </div>

                  <div className="leaderboard-list">
                    {top9Data.map((item, idx) => {
                      const initials = item.className.split(' ').map((n) => n[0]).join('').toUpperCase();
                      const isDimmed = hoveredIndex !== null && hoveredIndex !== idx;
                      const isHighlighted = hoveredIndex === idx;

                      return (
                        <div
                          key={idx}
                          className={`leaderboard-row ${isHighlighted ? 'highlighted' : ''}`}
                          style={{ opacity: isDimmed ? 0.35 : 1 }}
                          onMouseEnter={() => setHoveredIndex(idx)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          onClick={() => setSelectedClass(item)}
                        >
                          <div className="row-left">
                            <div className="row-bullet" style={{ backgroundColor: item.color }}></div>
                            <div className="row-avatar">{initials}</div>
                            <div className="row-class-name">{item.className}</div>
                          </div>
                          <div className="row-right">
                            <div className="row-percent">{item.percentage.toFixed(1)}%</div>
                            <div className="row-score">{item.totalScore.toLocaleString()} pts</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Previous Year Champions Section */}
        <div className="champions-section-card">
          <div className="champions-header">
            <div className="champions-header-left">
              <h2>PREVIOUS YEAR CHAMPIONS</h2>
              <p>Celebrating the best minds and outstanding achievements.</p>
            </div>

            <div className="champions-header-right">
              <select
                className="champions-year-select"
                value={activeYear}
                onChange={(e) => setActiveYear(e.target.value)}
              >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
              <button className="nav-arrow-btn" onClick={handleScrollLeft} aria-label="Previous">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <button className="nav-arrow-btn" onClick={handleScrollRight} aria-label="Next">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="champions-carousel-wrapper">
            <button className="carousel-floating-btn prev-btn" onClick={handleScrollLeft} aria-label="Scroll left">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>

            <div className="champions-scroll-track" ref={scrollTrackRef}>
              {currentChampions.map((champ, idx) => (
                <div key={idx} className={`champion-card rank-${champ.rank}`}>
                  <div className="card-top-row">
                    <div className={`medal-badge rank-${champ.rank}`}>
                      <div className="medal-circle">{champ.rank}</div>
                    </div>
                    <div className={`rank-pill rank-${champ.rank}`}>
                      {champ.rankLabel}
                    </div>
                  </div>

                  <div className="champion-avatar-frame">
                    <img src={champ.image} alt={champ.teamName} className="champion-avatar-img" />
                  </div>

                  <h3 className="champion-team-name">{champ.teamName}</h3>
                  <div className="champion-event-name">{champ.eventName}</div>

                  <div className={`champion-score-row rank-${champ.rank}`}>
                    <span className="star-icon">★</span>
                    <span>{champ.score}</span>
                    <span className="score-max">/ 100</span>
                  </div>

                  <div className="champion-footer-pill">
                    <div className="pill-item">
                      <span>🏫 {champ.institution}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="carousel-floating-btn next-btn" onClick={handleScrollRight} aria-label="Scroll right">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>

          {/* Dots */}
          <div className="champions-dots">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>

          {/* Bottom Bar */}
          <div className="champions-bottom-bar">
            <div className="bottom-left-info">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>Explore more champions</span>
            </div>

            <div className="bottom-center-text">
              Swipe or scroll to view champions from other years
            </div>

            <button className="view-all-years-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                <path d="M4 22h16"/>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
              </svg>
              View All Years
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
