'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

interface StandingItem {
  className: string;
  department: string;
  totalScore: number;
  percentage: number;
  color: string;
}

const top11Departments = [
  { rank: 1, name: 'Department of Computer Applications', code: 'DCA', score: 3420, progress: 95.8, icon: '💻', color: '#00F2A9' },
  { rank: 2, name: 'Department of Commerce', code: 'COMMERCE', score: 3290, progress: 92.1, icon: '📊', color: '#00D2FF' },
  { rank: 3, name: 'Department of Business Administration', code: 'BBA_MBA', score: 3110, progress: 87.5, icon: '💼', color: '#8E52FF' },
  { rank: 4, name: 'Department of Social Work', code: 'SOCIAL_WORK', score: 2950, progress: 83.0, icon: '🤝', color: '#FF52A3' },
  { rank: 5, name: 'Department of Physics', code: 'PHYSICS', score: 2840, progress: 79.8, icon: '⚛️', color: '#FFD200' },
  { rank: 6, name: 'Department of Economics', code: 'ECONOMICS', score: 2710, progress: 76.2, icon: '📈', color: '#00F2A9' },
  { rank: 7, name: 'Department of Mathematics', code: 'MATHS', score: 2600, progress: 73.1, icon: '📐', color: '#00D2FF' },
  { rank: 8, name: 'Department of English / Communicative English', code: 'BACE', score: 2480, progress: 69.7, icon: '📚', color: '#8E52FF' },
  { rank: 9, name: 'Department of Communication & Media Studies', code: 'MCMS', score: 2390, progress: 67.2, icon: '🎬', color: '#FF52A3' },
  { rank: 10, name: 'Department of Hospitality & Tourism Management', code: 'MHTM', score: 2280, progress: 64.0, icon: '🏨', color: '#FFD200' },
  { rank: 11, name: 'Department of Psychology', code: 'PSYCHOLOGY', score: 2150, progress: 60.5, icon: '🧠', color: '#00F2A9' },
];

const top9ClassData: StandingItem[] = [
  { className: 'II MCA', department: 'Computer Applications', totalScore: 1350, percentage: 16.2, color: '#00F2A9' },
  { className: 'III BCOM A', department: 'Commerce', totalScore: 1280, percentage: 15.3, color: '#00D2FF' },
  { className: 'II BCA A', department: 'Computer Applications', totalScore: 1190, percentage: 14.2, color: '#8E52FF' },
  { className: 'II MBA A', department: 'Business Administration', totalScore: 1120, percentage: 13.4, color: '#FF52A3' },
  { className: 'II MSW', department: 'Social Work', totalScore: 1050, percentage: 12.5, color: '#FFD200' },
  { className: 'V MSC PHYSICS', department: 'Physics', totalScore: 980, percentage: 11.7, color: '#00F2A9' },
  { className: 'III ECONOMICS', department: 'Economics', totalScore: 910, percentage: 10.9, color: '#00D2FF' },
  { className: 'III MATHS', department: 'Mathematics', totalScore: 840, percentage: 10.0, color: '#8E52FF' },
  { className: 'III BACE', department: 'English', totalScore: 780, percentage: 9.3, color: '#FF52A3' },
];

const initialLiveFeed = [
  { id: 1, text: "II MCA uploaded Internship Verification Certificate", time: "1 min ago", pill: "MINT" },
  { id: 2, text: "III BCOM A added NPTEL Digital Honors Certification", time: "3 mins ago", pill: "CYAN" },
  { id: 3, text: "II BCA A submitted National Hackathon First Prize Proof", time: "5 mins ago", pill: "VIOLET" },
  { id: 4, text: "II MBA A verified State Level Management Fest Win", time: "10 mins ago", pill: "MINT" },
  { id: 5, text: "II MSW approved Community Service Project Evidence", time: "14 mins ago", pill: "CYAN" },
];

const activityPool = [
  { text: "V MSC PHYSICS uploaded Research Paper Publication Proof", pill: "VIOLET" },
  { text: "III ECONOMICS completed DigiLocker Academic Audit", pill: "MINT" },
  { text: "III MATHS verified Intercollegiate Quiz Competition Winner", pill: "CYAN" },
  { text: "III BACE added Campus News Publication Portfolio", pill: "VIOLET" },
  { text: "II MCMS uploaded Media Documentary Project File", pill: "MINT" },
];

export const LandingPage: React.FC = () => {
  const { submissionOpen, activeAcademicYear } = useApp();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedClass, setSelectedClass] = useState<StandingItem | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ type: string; title: string; subtitle: string; refItem: any }[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [activitiesList, setActivitiesList] = useState(initialLiveFeed);

  useEffect(() => {
    setIsLoaded(true);

    const ticker = setInterval(() => {
      const nextAct = activityPool[Math.floor(Math.random() * activityPool.length)];
      setActivitiesList((prev) => [
        { id: Date.now(), text: nextAct.text, time: "Just now", pill: nextAct.pill },
        ...prev.slice(0, 4)
      ]);
    }, 6000);

    return () => clearInterval(ticker);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const results: typeof searchResults = [];
    top9ClassData.forEach((c) => {
      if (c.className.toLowerCase().includes(query.toLowerCase()) || c.department.toLowerCase().includes(query.toLowerCase())) {
        results.push({ type: 'Class', title: c.className, subtitle: `${c.department} • ${c.totalScore} pts`, refItem: c });
      }
    });
    top11Departments.forEach((d) => {
      if (d.name.toLowerCase().includes(query.toLowerCase()) || d.code.toLowerCase().includes(query.toLowerCase())) {
        results.push({ type: 'Department', title: d.name, subtitle: `Rank #${d.rank} • ${d.score} pts`, refItem: d });
      }
    });
    setSearchResults(results.slice(0, 6));
  };

  const selectSearchResult = (item: any) => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchFocused(false);
    if (item.type === 'Class') {
      setSelectedClass(item.refItem);
    }
    document.getElementById('standings-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="ag-shell">
      {/* Ambient Floating Orbs */}
      <div className="ag-orb ag-orb-mint"></div>
      <div className="ag-orb ag-orb-violet"></div>
      <div className="ag-orb ag-orb-cyan"></div>

      {/* Floating Decor Pill Shapes */}
      <div className="ag-glass" style={{
        position: 'absolute',
        top: '120px',
        right: '5%',
        padding: '10px 20px',
        borderRadius: '9999px',
        animation: 'agFloatSlow 7s ease-in-out infinite',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.82rem',
        color: '#00F2A9',
        border: '1px solid rgba(0, 242, 169, 0.3)',
        boxShadow: '0 0 20px rgba(0, 242, 169, 0.2)',
        pointerEvents: 'none',
        zIndex: 2
      }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00F2A9', boxShadow: '0 0 8px #00F2A9' }}></span>
        Zero Gravity Active Analytics
      </div>

      <div className="ag-glass" style={{
        position: 'absolute',
        top: '420px',
        left: '3%',
        padding: '12px 22px',
        borderRadius: '9999px',
        animation: 'agFloatReverse 8.5s ease-in-out infinite',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.85rem',
        color: '#00D2FF',
        border: '1px solid rgba(0, 210, 255, 0.3)',
        boxShadow: '0 0 20px rgba(0, 210, 255, 0.2)',
        pointerEvents: 'none',
        zIndex: 2
      }}>
        <span style={{ fontSize: '1rem' }}>⚡</span>
        Marian College Autonomous (2025-2026)
      </div>

      {/* 1. STICKY FROSTED PILL NAVBAR */}
      <header className="ag-glass ag-navbar-sticky">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/Assets/Images/marian-best-logo-removebg-preview.png" alt="Marian Logo" style={{ height: '38px', objectFit: 'contain' }} />
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#FFFFFF', letterSpacing: '-0.02em' }}>EXCELLENCE</span>
            <span className="ag-neon-text" style={{ fontWeight: 800, fontSize: '1.15rem', marginLeft: '6px' }}>GRID</span>
          </div>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <a href="#hero-section" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', transition: 'color 0.2s' }}>Home</a>
          <a href="#features-bento" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', transition: 'color 0.2s' }}>Features</a>
          <a href="#standings-section" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', transition: 'color 0.2s' }}>Standings</a>
          <Link href="/policy" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', transition: 'color 0.2s' }}>Policy & Rubrics</Link>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '9999px',
                padding: '8px 16px',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                outline: 'none',
                width: '180px'
              }}
            />
            {searchFocused && searchResults.length > 0 && (
              <div className="ag-glass" style={{
                position: 'absolute',
                top: '46px',
                right: 0,
                width: '280px',
                padding: '12px',
                zIndex: 200
              }}>
                {searchResults.map((res, i) => (
                  <div
                    key={i}
                    onMouseDown={() => selectSearchResult(res)}
                    style={{ padding: '8px 10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>{res.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>{res.subtitle}</div>
                    </div>
                    <span className="ag-pill-tag ag-pill-mint" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>{res.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link href="/login" className="ag-btn-neon">
            Launch Portal &rarr;
          </Link>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section id="hero-section" style={{ maxWidth: '1200px', margin: '0 auto 80px auto', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '40px', alignItems: 'center' }}>
          <div>
            <div className="ag-pill-tag ag-pill-mint" style={{ marginBottom: '20px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00F2A9', boxShadow: '0 0 10px #00F2A9' }}></span>
              ANTIGRAVITY EVALUATION ENGINE • AY {activeAcademicYear}
            </div>

            <h1 className="ag-title-large" style={{ marginBottom: '24px' }}>
              Elevate Class Ranking with <span className="ag-neon-text">Antigravity Precision</span>
            </h1>

            <p style={{ fontSize: '1.1rem', color: 'rgba(248, 250, 252, 0.75)', lineHeight: 1.6, marginBottom: '36px', maxWidth: '560px' }}>
              A next-generation floating glassmorphic evaluation platform for Marian College Autonomous. Track academic performance, NPTEL certifications, research publications, and sports milestones in zero-gravity real-time.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/login" className="ag-btn-neon" style={{ fontSize: '1.05rem', padding: '16px 36px' }}>
                Explore Class Leaderboard &rarr;
              </Link>
              <Link href="/policy" className="ag-btn-glass" style={{ fontSize: '1.05rem', padding: '16px 32px' }}>
                View Scoring Matrix
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginTop: '48px' }}>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#00F2A9' }}>61+</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Classes</div>
              </div>
              <div style={{ height: '36px', width: '1px', background: 'rgba(255,255,255,0.15)' }}></div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#00D2FF' }}>11</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Academic Departments</div>
              </div>
              <div style={{ height: '36px', width: '1px', background: 'rgba(255,255,255,0.15)' }}></div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#8E52FF' }}>100%</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified Audit Trail</div>
              </div>
            </div>
          </div>

          {/* Interactive Floating Glass Showcase Control Card */}
          <div style={{ position: 'relative' }}>
            <div className="ag-glass ag-glass-interactive" style={{ padding: '32px', animation: 'agFloatSlow 6s ease-in-out infinite' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Live Showcase Module</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>II MCA • Computer Applications</div>
                </div>
                <span className="ag-pill-tag ag-pill-mint">Rank #1</span>
              </div>

              {/* Progress Metric Ring & Bar */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.8)' }}>Overall Best Class Index</span>
                  <span style={{ color: '#00F2A9', fontWeight: 800 }}>1,350 pts (95.8%)</span>
                </div>
                <div style={{ height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '95.8%', background: 'linear-gradient(90deg, #00F2A9, #00D2FF)', borderRadius: '5px' }}></div>
                </div>
              </div>

              {/* Real-time Submissions Ticker inside Glass Showcase */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Recent Verified Submissions</div>
                {activitiesList.slice(0, 3).map((act) => (
                  <div key={act.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontSize: '0.82rem'
                  }}>
                    <span style={{ color: '#F8FAFC' }}>{act.text}</span>
                    <span style={{ fontSize: '0.72rem', color: '#00F2A9', fontWeight: 700 }}>{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BENTO-STYLE FEATURES GRID */}
      <section id="features-bento" style={{ maxWidth: '1200px', margin: '0 auto 100px auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div className="ag-pill-tag ag-pill-cyan" style={{ marginBottom: '14px' }}>
            BENTO CORE ENGINE
          </div>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#FFFFFF' }}>
            Built with <span className="ag-neon-text">Volumetric Precision</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', marginTop: '8px' }}>
            Architected specifically for departmental verification, faculty advisement, and IQAC auditing.
          </p>
        </div>

        <div className="ag-bento-grid">
          {/* Card 1: Real-time Evaluation */}
          <div className="ag-glass ag-glass-interactive ag-bento-span-8" style={{ padding: '32px' }}>
            <span className="ag-pill-tag ag-pill-mint" style={{ marginBottom: '16px' }}>01 • REAL-TIME EVALUATION</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>
              Multi-Criteria Scoring Matrix
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Instantly process Academic S/A+ Grades, NPTEL/MOOC certifications, offline/online internships, competitive exam qualifiers (JRF/NET/GATE), and research papers.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '1.4rem' }}>🎓</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#00F2A9', marginTop: '4px' }}>Academics</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Pass % & S Grades</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '1.4rem' }}>📜</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#00D2FF', marginTop: '4px' }}>Certifications</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>NPTEL & MOOCs</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '1.4rem' }}>💼</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#8E52FF', marginTop: '4px' }}>Internships</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Verified Placements</div>
              </div>
            </div>
          </div>

          {/* Card 2: AI Verification Engine */}
          <div className="ag-glass ag-glass-interactive ag-bento-span-4" style={{ padding: '32px' }}>
            <span className="ag-pill-tag ag-pill-cyan" style={{ marginBottom: '16px' }}>02 • VERIFICATION</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>
              Multi-Role Audit
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '20px' }}>
              Sequential verification flow by Student Rep, Class Advisor, Evaluation Team, and IQAC Moderator.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00F2A9' }}>✓ Student Rep Pre-Verification</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00D2FF' }}>✓ Faculty Advisor Validation</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8E52FF' }}>✓ Evaluation Committee Review</div>
            </div>
          </div>

          {/* Card 3: 11 Departmental Leaderboards */}
          <div className="ag-glass ag-glass-interactive ag-bento-span-6" style={{ padding: '32px' }}>
            <span className="ag-pill-tag ag-pill-violet" style={{ marginBottom: '16px' }}>03 • STANDINGS</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px' }}>
              11 Official Departments
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Real-time score updates across all Marian College Autonomous departments.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {top11Departments.slice(0, 3).map((d) => (
                <div key={d.code} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>{d.name}</span>
                  <span style={{ color: d.color, fontWeight: 800 }}>{d.score} pts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: DigiLocker & Audit Trail */}
          <div className="ag-glass ag-glass-interactive ag-bento-span-6" style={{ padding: '32px' }}>
            <span className="ag-pill-tag ag-pill-mint" style={{ marginBottom: '16px' }}>04 • SECURITY & AUDIT</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px' }}>
              DigiLocker & Audit Trail
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Tamper-proof record keeping with automated timestamping, document proof upload, and rejection remark loops.
            </p>
            <div style={{ padding: '14px', background: 'rgba(0, 242, 169, 0.08)', borderRadius: '14px', border: '1px solid rgba(0, 242, 169, 0.2)', color: '#00F2A9', fontSize: '0.85rem', fontWeight: 700 }}>
              🛡️ Encrypted Audit Trail Active • Zero Data Distortion
            </div>
          </div>
        </div>
      </section>

      {/* 4. DEPARTMENT STANDINGS & CLASS PROGRESS GAUGE */}
      <section id="standings-section" style={{ maxWidth: '1200px', margin: '0 auto 100px auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="ag-pill-tag ag-pill-mint" style={{ marginBottom: '14px' }}>
            OFFICIAL RANKING MATRIX
          </div>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#FFFFFF' }}>
            11 Official <span className="ag-neon-text">Departmental Standings</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }}>
          {/* Left: 11 Departmental Leaderboard */}
          <div className="ag-glass" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px', color: '#FFFFFF' }}>Department Rankings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {top11Departments.map((dept) => (
                <div key={dept.code} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  padding: '12px 18px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.2s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: dept.color, width: '28px' }}>#{dept.rank}</span>
                    <span style={{ fontSize: '1.2rem' }}>{dept.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFFFFF' }}>{dept.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '80px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${dept.progress}%`, background: dept.color, borderRadius: '3px' }}></div>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: dept.color }}>{dept.score} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Top 9 Class Standings */}
          <div className="ag-glass" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px', color: '#FFFFFF' }}>Top 9 Classes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {top9ClassData.map((cls, i) => (
                <div key={i} style={{
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#FFFFFF' }}>{cls.className}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>{cls.department}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: cls.color }}>{cls.totalScore} pts</div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>{cls.percentage}% share</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. FLOATING CALL TO ACTION BANNER */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 80px auto', position: 'relative' }}>
        <div className="ag-glass" style={{
          padding: '60px 40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderTop: '1px solid rgba(0, 242, 169, 0.5)'
        }}>
          <div className="ag-pill-tag ag-pill-mint" style={{ marginBottom: '16px' }}>
            READY TO EVALUATE?
          </div>
          <h2 style={{ fontSize: '2.6rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px' }}>
            Elevate Your Class Standing Today
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 36px auto' }}>
            Log in with your official Marian College email address (`@mariancollege.org`) to submit achievements and track your class ranking live.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <Link href="/login" className="ag-btn-neon" style={{ fontSize: '1.1rem', padding: '16px 40px' }}>
              Access Excellence Grid &rarr;
            </Link>
            <Link href="/policy" className="ag-btn-glass" style={{ fontSize: '1.1rem', padding: '16px 36px' }}>
              Scoring Policy Guide
            </Link>
          </div>
        </div>
      </section>

      {/* 6. MINIMAL FROSTED GLASS FOOTER */}
      <footer className="ag-glass" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/Assets/Images/marian-best-logo-removebg-preview.png" alt="Logo" style={{ height: '28px' }} />
          <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
            © 2026 Marian College Kuttikkanam (Autonomous). All Rights Reserved.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {['🌐 Website', '📜 Policy', '📧 Support', '🛡️ IQAC'].map((link, idx) => (
            <span key={idx} className="ag-glass" style={{ padding: '6px 14px', borderRadius: '9999px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.85)', cursor: 'pointer' }}>
              {link}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
};
