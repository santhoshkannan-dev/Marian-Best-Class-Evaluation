'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { policyCategories, PolicyCategory } from './policyData';

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
  { className: 'BSc CS B', department: 'Computer Science', totalScore: 1272, percentage: 15.7, color: '#4f46e5' },
  { className: 'BCom C', department: 'Commerce', totalScore: 978, percentage: 12.1, color: '#ec4899' },
  { className: 'BSc CS A', department: 'Computer Science', totalScore: 966, percentage: 11.9, color: '#8b5cf6' },
  { className: 'BA English B', department: 'English', totalScore: 930, percentage: 11.5, color: '#10b981' },
  { className: 'BA English A', department: 'English', totalScore: 876, percentage: 10.8, color: '#14b8a6' },
  { className: 'BBA B', department: 'Business Admin', totalScore: 850, percentage: 10.5, color: '#f59e0b' },
  { className: 'BSc Physics A', department: 'Physics', totalScore: 754, percentage: 9.3, color: '#ef4444' },
  { className: 'BCA A', department: 'Computer Applications', totalScore: 750, percentage: 9.2, color: '#06b6d4' },
  { className: 'BBA A', department: 'Business Admin', totalScore: 730, percentage: 9.0, color: '#3b82f6' },
];

const mockStudents = [
  { name: 'Rahul S', className: 'BCA A', department: 'Computer Applications' },
  { name: 'Sneha K', className: 'BSc CS B', department: 'Computer Science' },
  { name: 'Arjun Prasad', className: 'BCom C', department: 'Commerce' },
  { name: 'Maria Antony', className: 'BA English A', department: 'English' },
  { name: 'Gautham Krishna', className: 'BBA A', department: 'Business Admin' },
  { name: 'Anjali Ramesh', className: 'BSc Physics A', department: 'Physics' },
];

const mockDepartments = [
  { name: 'Computer Science', score: 2988, progress: 92 },
  { name: 'Commerce', score: 2650, progress: 84 },
  { name: 'Management', score: 2150, progress: 76 },
  { name: 'Languages', score: 1806, progress: 68 },
  { name: 'Physics', score: 1680, progress: 62 },
  { name: 'Chemistry', score: 1420, progress: 54 },
];



const achievements = [
  { id: 1, icon: "🏅", class: "BCA A", title: "Completed 150 NPTEL Courses", desc: "Highest digital certification submissions this term." },
  { id: 2, icon: "🏆", class: "BSc Physics", title: "Won National Hackathon", desc: "1st place in Smart India Innovators contest." },
  { id: 3, icon: "🎓", class: "BCom", title: "95% Semester Pass Percentage", desc: "Outstanding academic performance across all batches." },
  { id: 4, icon: "🚀", class: "BSc CS B", title: "Launched 2 Registered Startups", desc: "TBI backed student ventures initiated." }
];

const initialActivities = [
  { id: 1, text: "✓ BCA A uploaded Internship Proof", time: "1 min ago" },
  { id: 2, text: "✓ BSc CS B added NPTEL Certificate", time: "3 mins ago" },
  { id: 3, text: "✓ BCom C uploaded Research Publication", time: "5 mins ago" },
  { id: 4, text: "✓ BA English A verified State Scholarship", time: "10 mins ago" },
  { id: 5, text: "✓ BBA A received 15 Marks for Outreach", time: "15 mins ago" },
];

const activityPool = [
  { text: "✓ BSc Physics A uploaded Prize Certificate", time: "Just now" },
  { text: "✓ BCA A verified competitive exam record", time: "Just now" },
  { text: "✓ BCom A added library borrow logs", time: "Just now" },
  { text: "✓ BSc CS A submitted startup pitch deck", time: "Just now" },
  { text: "✓ BBA B verified online certificate", time: "Just now" },
];

// Helper Animated CountUp Component
const CountUp: React.FC<{ end: number; duration?: number; suffix?: string }> = ({ end, duration = 1200, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const step = (now: number) => {
      if (!startTime) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

export const LandingPage: React.FC = () => {
  const [activeYear, setActiveYear] = useState('2025');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedClass, setSelectedClass] = useState<StandingItem | null>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);

  // Animations & Search States
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ type: string; title: string; subtitle: string; refItem: any }[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);

  // Live Activity Feed
  const [activitiesList, setActivitiesList] = useState(initialActivities);

  // Categories Stacked Carousel Index
  const [activeCatIndex, setActiveCatIndex] = useState(0);

  // Achievements Auto Slide
  const [activeAchIndex, setActiveAchIndex] = useState(0);

  // Champions 3D Slide
  const [activeChampIdx, setActiveChampIdx] = useState(1); // Default to middle card

  const currentChampions = championsData[activeYear] || championsData["2025"];

  useEffect(() => {
    setIsLoaded(true);

    // Live Feed Auto Add Ticker
    const activityTimer = setInterval(() => {
      const randomActivity = activityPool[Math.floor(Math.random() * activityPool.length)];
      setActivitiesList((prev) => [
        { id: Date.now(), text: randomActivity.text, time: randomActivity.time },
        ...prev.slice(0, 5)
      ]);
    }, 7000);

    // Categories Stacked Auto Advance
    const catTimer = setInterval(() => {
      setActiveCatIndex((prev) => (prev + 1) % policyCategories.length);
    }, 4500);

    // Achievements Auto Slide
    const achTimer = setInterval(() => {
      setActiveAchIndex((prev) => (prev + 1) % achievements.length);
    }, 5000);

    // Champions Auto Slide
    const champTimer = setInterval(() => {
      setActiveChampIdx((prev) => (prev + 1) % currentChampions.length);
    }, 6000);

    return () => {
      clearInterval(activityTimer);
      clearInterval(catTimer);
      clearInterval(achTimer);
      clearInterval(champTimer);
    };
  }, [currentChampions.length]);

  const handleScrollLeft = () => {
    setActiveChampIdx((prev) => (prev - 1 + currentChampions.length) % currentChampions.length);
  };

  const handleScrollRight = () => {
    setActiveChampIdx((prev) => (prev + 1) % currentChampions.length);
  };

  // Search Logic
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered: typeof searchResults = [];

    // Filter Classes
    top9Data.forEach(c => {
      if (c.className.toLowerCase().includes(query.toLowerCase()) || c.department.toLowerCase().includes(query.toLowerCase())) {
        filtered.push({ type: 'Class', title: c.className, subtitle: `${c.department} Department • ${c.totalScore} pts`, refItem: c });
      }
    });

    // Filter Departments
    mockDepartments.forEach(d => {
      if (d.name.toLowerCase().includes(query.toLowerCase())) {
        filtered.push({ type: 'Department', title: d.name, subtitle: `Ranking List • ${d.score} pts`, refItem: d });
      }
    });

    // Filter Students
    mockStudents.forEach(s => {
      if (s.name.toLowerCase().includes(query.toLowerCase()) || s.className.toLowerCase().includes(query.toLowerCase())) {
        filtered.push({ type: 'Student', title: s.name, subtitle: `${s.className} (${s.department})`, refItem: s });
      }
    });

    setSearchResults(filtered.slice(0, 6));
  };

  // Render suggestion selection
  const selectSearchResult = (item: any) => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchFocused(false);

    if (item.type === 'Class') {
      setSelectedClass(item.refItem);
      // Scroll to core analytics section
      const coreSection = document.getElementById('core-analytics-section');
      if (coreSection) {
        coreSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Otherwise scroll to core section and reset selection to list top
      setSelectedClass(null);
      const coreSection = document.getElementById('core-analytics-section');
      if (coreSection) {
        coreSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // SVG Gauge calculations
  const cx = 250;
  const cy = 310;
  const maxRadius = 220;
  const radiusStep = 17;
  const topScore = top9Data[0].totalScore;

  // Categories Stacked layout styles
  const getCatStyle = (index: number) => {
    let offset = index - activeCatIndex;
    if (offset < -6) offset += policyCategories.length;
    if (offset > 6) offset -= policyCategories.length;

    const absOffset = Math.abs(offset);

    if (absOffset > 2) {
      return {
        transform: 'translateX(0px) scale(0.6) rotateY(0deg)',
        opacity: 0,
        zIndex: 0,
        pointerEvents: 'none' as const,
        visibility: 'hidden' as const
      };
    }

    const translateX = offset * 230;
    const scale = 1 - absOffset * 0.12;
    const rotateY = offset * -22;
    const zIndex = 20 - absOffset;
    const opacity = 1 - absOffset * 0.35;

    return {
      transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
      zIndex,
      opacity,
      transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s, zIndex 0.6s'
    };
  };

  // Champions fanning/blur styles
  const getChampCardStyle = (index: number) => {
    let offset = index - activeChampIdx;
    const len = currentChampions.length;
    if (offset < -len / 2) offset += len;
    if (offset > len / 2) offset -= len;

    const absOffset = Math.abs(offset);
    const isActive = absOffset === 0;

    // Show 3 cards side-by-side: active/center, left, right. Hide others to prevent overflow stacks.
    if (absOffset > 1 && len > 2) {
      return {
        transform: `translateX(${offset * 320}px) scale(0.7) rotateY(${offset * -15}deg)`,
        opacity: 0,
        zIndex: 0,
        pointerEvents: 'none' as const,
        visibility: 'hidden' as const,
        transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
      };
    }

    const scale = isActive ? 1.05 : 0.88;
    const rotateY = offset * -18;
    const zIndex = 15 - absOffset;
    const opacity = isActive ? 1 : 0.65;
    const blurVal = isActive ? 'none' : 'blur(2px)';
    const translateX = offset * 320; // 320px spacing fanned layout

    return {
      transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg) translateZ(${isActive ? 30 : -45}px)`,
      filter: blurVal,
      opacity,
      zIndex,
      transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
    };
  };

  return (
    <div className="landing-shell">
      {/* Background Blobs */}
      <div className="moving-blobs-bg">
        <div className="blob blob-purple"></div>
        <div className="blob blob-blue"></div>
        <div className="blob blob-pink"></div>
      </div>

      <div className="home-layout">

        {/* Top bar with Interactive Search (Feature 9) */}
        <div className="search-header-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.4rem' }}>📊</span>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>Marian Best Class Portal</span>
          </div>

          <div className="search-bar-wrapper">
            <svg className="search-icon-svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search Class, Student, Department..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            />

            {searchFocused && searchResults.length > 0 && (
              <div className="search-dropdown-overlay">
                <div className="search-result-group-title">Search Results</div>
                {searchResults.map((result, idx) => (
                  <div
                    key={idx}
                    className="search-result-item"
                    onMouseDown={() => selectSearchResult(result)}
                  >
                    <div>
                      <div className="search-result-title">{result.title}</div>
                      <div className="search-result-subtitle">{result.subtitle}</div>
                    </div>
                    <span className="search-result-badge">{result.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Competition Overview (Feature 2) */}
        <div className="overview-section-grid">
          <div className="premium-card overview-stat-card">
            <div className="overview-icon-container">🏫</div>
            <div className="overview-value">
              {isLoaded ? <CountUp end={14} /> : 0}
            </div>
            <div className="overview-label">Departments</div>
          </div>
          <div className="premium-card overview-stat-card">
            <div className="overview-icon-container">👥</div>
            <div className="overview-value">
              {isLoaded ? <CountUp end={52} /> : 0}
            </div>
            <div className="overview-label">Classes</div>
          </div>
          <div className="premium-card overview-stat-card">
            <div className="overview-icon-container">👨‍🎓</div>
            <div className="overview-value">
              {isLoaded ? <CountUp end={2450} /> : 0}
            </div>
            <div className="overview-label">Students</div>
          </div>
          <div className="premium-card overview-stat-card">
            <div className="overview-icon-container">📁</div>
            <div className="overview-value">
              {isLoaded ? <CountUp end={2954} /> : 0}
            </div>
            <div className="overview-label">Evidence Uploaded</div>
          </div>
          <div className="premium-card overview-stat-card">
            <div className="overview-icon-container">✅</div>
            <div className="overview-value">
              {isLoaded ? <CountUp end={2163} /> : 0}
            </div>
            <div className="overview-label">Verified</div>
          </div>
          <div className="premium-card overview-stat-card">
            <div className="overview-icon-container">⏳</div>
            <div className="overview-value">
              {isLoaded ? <CountUp end={791} /> : 0}
            </div>
            <div className="overview-label">Pending</div>
          </div>
        </div>

        {/* Core Analytics Card (Gauge + Standings + Activity + Trends + Achievements + notice) */}
        <div id="core-analytics-section" className="dashboard-core-card" style={{ marginTop: '16px' }}>

          <div className="dashboard-grid">

            {/* Left Panel: Class Progress Gauge */}
            <div className="chart-section">
              <div className="chart-heading-container">
                <h2 className="chart-title">Class Progress Gauge</h2>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                  Overall Class Index: <span style={{ fontSize: '1rem', fontWeight: 800 }}>94.3</span>
                </div>
              </div>

              <div className="svg-container">
                <svg viewBox="-10 0 520 325" width="100%" height="100%">
                  <defs>
                    {top9Data.map((_, idx) => (
                      <linearGradient id={`arc-grad-${idx}`} key={idx} x1="100%" y1="0%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#4f46e5" />
                        <stop offset="50%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#e0e7ff" />
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

                    // Loading Animation Dash Offset logic
                    const dashOffset = isLoaded ? (pathLen * (1 - progress)) : pathLen;

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
                          style={{ cursor: 'pointer', transition: 'stroke-dashoffset 1.5s cubic-bezier(0.25, 0.8, 0.25, 1)' }}
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

        {/* Secondary Widgets Row: Live Activity Feed (3) + Trends (6) + Achievements (7) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginTop: '12px' }}>

          {/* Live Activity Feed (Feature 3) */}
          <div className="premium-card activity-feed-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>Live Activity Feed</h3>
              <span className="eyebrow" style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="pulse" style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                Real-Time
              </span>
            </div>

            <div className="activity-feed-ticker">
              <div className="activity-feed-list">
                {activitiesList.map((item) => (
                  <div key={item.id} className="activity-item">
                    <span className="activity-badge">✓</span>
                    <div className="activity-text">
                      <strong>{item.text.split(' ')[1]}</strong> {item.text.split(' ').slice(2).join(' ')}
                      <span className="activity-time">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leaderboard Trends Chart (Feature 6) */}
          <div className="premium-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>Leaderboard Trends</h3>
            <p className="muted" style={{ fontSize: '0.8rem' }}>Current Score vs. Last Week index delta comparison</p>

            <div className="trends-list">
              <div className="trend-item">
                <div className="trend-meta">
                  <span className="trend-class-name">BSc CS B (Computer Science)</span>
                  <span className="trend-badge up">+4.5%</span>
                </div>
                <div className="trend-bar-container">
                  <div className="trend-bar-current" style={{ width: '88%' }}></div>
                  <div className="trend-bar-last" style={{ width: '83.5%' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  <span>Last Week: 1,217 pts</span>
                  <span>Current: 1,272 pts</span>
                </div>
              </div>

              <div className="trend-item">
                <div className="trend-meta">
                  <span className="trend-class-name">BCom C (Commerce)</span>
                  <span className="trend-badge up">+3.2%</span>
                </div>
                <div className="trend-bar-container">
                  <div className="trend-bar-current" style={{ width: '74%', background: 'linear-gradient(90deg, #ec4899 0%, #f472b6 100%)' }}></div>
                  <div className="trend-bar-last" style={{ width: '70.8%' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  <span>Last Week: 947 pts</span>
                  <span>Current: 978 pts</span>
                </div>
              </div>

              <div className="trend-item">
                <div className="trend-meta">
                  <span className="trend-class-name">BA English A (English)</span>
                  <span className="trend-badge up">+5.8%</span>
                </div>
                <div className="trend-bar-container">
                  <div className="trend-bar-current" style={{ width: '65%', background: 'linear-gradient(90deg, #14b8a6 0%, #2dd4bf 100%)' }}></div>
                  <div className="trend-bar-last" style={{ width: '59.2%' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  <span>Last Week: 825 pts</span>
                  <span>Current: 876 pts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Achievements Auto Carousel (Feature 7) */}
          <div className="premium-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '2px' }}>Recent Achievements</h3>
            <p className="muted" style={{ fontSize: '0.8rem' }}>Highlights and student highlights board</p>

            <div className="achievements-carousel-container">
              {achievements.map((item, idx) => {
                const isActive = idx === activeAchIndex;
                return (
                  <div
                    key={item.id}
                    className="achievement-slide"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: isActive ? 1 : 0,
                      transform: `translateX(${isActive ? 0 : 30}px)`,
                      pointerEvents: isActive ? 'auto' : 'none',
                      transition: 'all 0.5s ease-in-out'
                    }}
                  >
                    <div className="achievement-icon">{item.icon}</div>
                    <div className="achievement-details">
                      <h4>{item.class}</h4>
                      <p style={{ fontWeight: 800, color: 'var(--primary)' }}>{item.title}</p>
                      <p style={{ fontSize: '0.74rem' }}>{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Carousel indicator dots */}
            <div style={{ display: 'flex', gap: '5px', marginTop: '12px', justifyContent: 'center' }}>
              {achievements.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveAchIndex(idx)}
                  style={{
                    width: idx === activeAchIndex ? '16px' : '5px',
                    height: '5px',
                    borderRadius: '3px',
                    border: 'none',
                    background: idx === activeAchIndex ? 'var(--primary)' : '#cbd5e1',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Tertiary Widgets Row: Department Ranks (8) + Notice Board (11) + Quote Section (10) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginTop: '12px' }}>

          {/* Department Rankings (Feature 8) */}
          <div className="premium-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '2px' }}>Department Rankings</h3>
            <p className="muted" style={{ fontSize: '0.8rem' }}>Aggregate departmental index metrics</p>

            <div className="dept-rankings-list">
              {mockDepartments.map((dept, idx) => (
                <div key={idx} className="dept-row">
                  <div className="dept-info">
                    <span className="dept-position">#{idx + 1}</span>
                    <span className="dept-name">{dept.name}</span>
                  </div>
                  <span className="dept-score">{dept.score} pts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notice Board (Feature 11) */}
          <div className="premium-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '2px' }}>Notice Board</h3>
            <p className="muted" style={{ fontSize: '0.8rem' }}>Latest updates & scheduling guidelines</p>

            <div className="notice-list">
              <div className="notice-item">
                <div className="notice-date-badge">
                  <span className="notice-date-day">20</span>
                  <span className="notice-date-month">Aug</span>
                </div>
                <div className="notice-details">
                  <h4>Evidence Submission Deadline</h4>
                  <p>All student portlet uploads must lock for primary audits.</p>
                </div>
              </div>

              <div className="notice-item">
                <div className="notice-date-badge" style={{ backgroundColor: 'rgba(99, 102, 241, 0.06)', color: 'var(--primary)', borderColor: 'rgba(99, 102, 241, 0.15)' }}>
                  <span className="notice-date-day">25</span>
                  <span className="notice-date-month">Aug</span>
                </div>
                <div className="notice-details">
                  <h4>Teacher Verification Review</h4>
                  <p>Class tutors lock claim check boxes and correction reviews.</p>
                </div>
              </div>

              <div className="notice-item">
                <div className="notice-date-badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.06)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.15)' }}>
                  <span className="notice-date-day">01</span>
                  <span className="notice-date-month">Sep</span>
                </div>
                <div className="notice-details">
                  <h4>Central Evaluation Lock</h4>
                  <p>Best Class audit evaluation score sheets published.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quote Section (Feature 10) */}
          <div className="premium-card quote-section-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="quote-icon">&ldquo;</div>
            <p className="quote-text">
              &ldquo;Great classes are not built by individuals, they are built by collaboration, leadership and consistent excellence.&rdquo;
            </p>
          </div>

        </div>



        {/* Top Performers (Feature 12) */}
        <div style={{ marginTop: '24px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px', textAlign: 'center' }}>Top Performers</h2>
          <p className="muted" style={{ fontSize: '0.86rem', marginBottom: '20px', textAlign: 'center' }}>Outstanding contributors in the current standings cycle.</p>

          <div className="top-performers-grid">
            <div className="premium-card performer-card">
              <span className="performer-role-badge">Top Student</span>
              <div className="performer-avatar">🥇</div>
              <div className="performer-name">Rahul S</div>
              <div className="performer-context">BCA A • Applications</div>
              <span className="performer-score">5 MOOCs Completed</span>
            </div>

            <div className="premium-card performer-card">
              <span className="performer-role-badge">Best Mentor</span>
              <div className="performer-avatar">👔</div>
              <div className="performer-name">Dr. Jerome</div>
              <div className="performer-context">Dept. of Computer Science</div>
              <span className="performer-score" style={{ color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.06)' }}>Active Support</span>
            </div>

            <div className="premium-card performer-card">
              <span className="performer-role-badge">Most Active Class</span>
              <div className="performer-avatar">⚡</div>
              <div className="performer-name">BSc CS B</div>
              <div className="performer-context">Computer Science</div>
              <span className="performer-score" style={{ color: '#ec4899', background: 'rgba(236, 72, 153, 0.06)' }}>150+ Submissions</span>
            </div>

            <div className="premium-card performer-card">
              <span className="performer-role-badge">Highest Research</span>
              <div className="performer-avatar">🔬</div>
              <div className="performer-name">BCom C</div>
              <div className="performer-context">Commerce</div>
              <span className="performer-score">3 UGC Publications</span>
            </div>

            <div className="premium-card performer-card">
              <span className="performer-role-badge">Highest Internship</span>
              <div className="performer-avatar">💼</div>
              <div className="performer-name">BCA A</div>
              <div className="performer-context">Computer Applications</div>
              <span className="performer-score">24 Placements</span>
            </div>

            <div className="premium-card performer-card">
              <span className="performer-role-badge">Library Usage</span>
              <div className="performer-avatar">📖</div>
              <div className="performer-name">BA English A</div>
              <div className="performer-context">English</div>
              <span className="performer-score">180+ Borrows</span>
            </div>
          </div>
        </div>

        {/* Motivational Stats (Feature 14) */}
        <div style={{ marginTop: '24px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px', textAlign: 'center' }}>Participation Analytics</h2>
          <p className="muted" style={{ fontSize: '0.86rem', marginBottom: '20px', textAlign: 'center' }}>Dynamic stats highlighting student body participation rates.</p>

          <div className="motivational-stats-grid">
            <div className="premium-card m-stat-card">
              <div className="m-stat-circle-wrapper">
                <svg className="m-stat-circle-svg" viewBox="0 0 36 36">
                  <path className="m-stat-circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="m-stat-circle-fill" strokeDasharray="82, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="m-stat-circle-text">82%</div>
              </div>
              <span className="m-stat-label">Submissions</span>
              <span className="m-stat-sublabel">Students Uploaded Evidence</span>
            </div>

            <div className="premium-card m-stat-card">
              <div className="m-stat-circle-wrapper">
                <svg className="m-stat-circle-svg" viewBox="0 0 36 36">
                  <path className="m-stat-circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="m-stat-circle-fill" stroke="#10b981" strokeDasharray="95, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="m-stat-circle-text" style={{ color: '#10b981' }}>95%</div>
              </div>
              <span className="m-stat-label">Verification</span>
              <span className="m-stat-sublabel">Claims Verified</span>
            </div>

            <div className="premium-card m-stat-card">
              <div className="overview-icon-container" style={{ width: '54px', height: '54px', fontSize: '1.4rem' }}>📜</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0' }}>420</div>
              <span className="m-stat-label">Certifications</span>
              <span className="m-stat-sublabel">NPTEL / MOOC Courses</span>
            </div>

            <div className="premium-card m-stat-card">
              <div className="overview-icon-container" style={{ width: '54px', height: '54px', fontSize: '1.4rem', color: '#ec4899', background: 'rgba(236, 72, 153, 0.06)' }}>💼</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0' }}>250</div>
              <span className="m-stat-label">Placements</span>
              <span className="m-stat-sublabel">Completed Internships</span>
            </div>
          </div>
        </div>

        {/* Policy Preview (Feature 13) */}
        <div className="premium-card policy-preview-card" style={{ marginTop: '24px' }}>
          <div className="policy-preview-left">
            <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '1rem', color: 'var(--primary)' }}>Competition Policy Preview</h3>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', margin: '8px 0' }}>Understand the scoring rubrics</h2>
            <p>
              Get insights into grading matrices, DigiLocker proof checklists, auditing procedures, and department indexes. Access full documentation to plan your semester achievements.
            </p>
            <div className="policy-pillars">
              <div className="pillar-item">
                <div className="pillar-bullet"></div>
                <span className="pillar-text">Evaluation Rubrics</span>
              </div>
              <div className="pillar-item">
                <div className="pillar-bullet" style={{ background: '#ec4899' }}></div>
                <span className="pillar-text">Verification Guidelines</span>
              </div>
              <div className="pillar-item">
                <div className="pillar-bullet" style={{ background: '#10b981' }}></div>
                <span className="pillar-text">Scoring Formulation</span>
              </div>
              <div className="pillar-item">
                <div className="pillar-bullet" style={{ background: '#f59e0b' }}></div>
                <span className="pillar-text">IQAC Moderation</span>
              </div>
            </div>
          </div>
          <div className="policy-preview-right">
            <Link href="/policy" className="btn btn-primary" style={{ padding: '16px 36px', borderRadius: '14px', fontSize: '1rem', textDecoration: 'none' }}>
              View Full Policy &rarr;
            </Link>
          </div>
        </div>

        {/* Previous Year Champions Section */}
        <div className="champions-section-card" style={{ overflow: 'hidden' }}>
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
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button className="nav-arrow-btn" onClick={handleScrollRight} aria-label="Next">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>

          <div
            className="champions-carousel-wrapper"
            style={{
              perspective: '1200px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '420px',
              position: 'relative'
            }}
          >
            <div
              className="champions-scroll-track"
              style={{
                transformStyle: 'preserve-3d',
                width: '100%',
                maxWidth: '960px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                height: '100%'
              }}
            >
              {currentChampions.map((champ, idx) => {
                const cardStyle = getChampCardStyle(idx);
                return (
                  <div
                    key={idx}
                    className={`champion-card rank-${champ.rank}`}
                    style={{
                      position: 'absolute',
                      width: '280px',
                      ...cardStyle
                    }}
                  >
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
                );
              })}
            </div>
          </div>

          {/* Dots */}
          <div className="champions-dots">
            {currentChampions.map((_, idx) => (
              <span
                key={idx}
                className={`dot ${idx === activeChampIdx ? 'active' : ''}`}
                onClick={() => setActiveChampIdx(idx)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="champions-bottom-bar">
            <div className="bottom-left-info">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Explore more champions</span>
            </div>

            <div className="bottom-center-text">
              Auto-sliding champion history dashboard records
            </div>

            <button className="view-all-years-btn" onClick={() => {
              document.getElementById('core-analytics-section')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55 .47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
              </svg>
              View Active Standings
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
