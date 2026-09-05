'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import type { ClassIndexEntry } from '@/context/AppContext';

export default function ClassRankingsPage() {
  const {
    academicYears,
    selectedAcademicYear,
    classIndexData,
    fetchClassIndex,
    smallestClassSize,
  } = useApp();

  const [year, setYear] = useState(selectedAcademicYear || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleRecalculate(year || undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRecalculate = async (y?: string) => {
    setLoading(true);
    await fetchClassIndex(y || year || undefined);
    setLoading(false);
  };

  const ranked = (classIndexData || []).filter((e) => e.rank !== null) as (ClassIndexEntry & { rank: number })[];
  const unranked = (classIndexData || []).filter((e) => e.rank === null);

  const podiumColors: Record<number, { bg: string; border: string; emoji: string; label: string }> = {
    1: { bg: 'linear-gradient(135deg,#fef9c3,#fffbeb)', border: '#FCD34D', emoji: '🥇', label: 'Champion' },
    2: { bg: 'linear-gradient(135deg,#f1f5f9,#e2e8f0)', border: '#94A3B8', emoji: '🥈', label: '1st Runner-Up' },
    3: { bg: 'linear-gradient(135deg,#fff7ed,#ffedd5)', border: '#FDBA74', emoji: '🥉', label: '2nd Runner-Up' },
  };

  return (
    <div style={{ position: 'relative', minHeight: '85vh', padding: '10px 0' }}>
      <div
        style={{
          position: 'fixed', inset: 0,
          backgroundImage: 'url("/Assets/Images/Marian_College_Kuttikkanam.jpg")',
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.05, filter: 'blur(6px)', pointerEvents: 'none', zIndex: 0,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Header */}
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>
            Class Rankings
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#6B7280', marginTop: '4px', margin: 0 }}>
            Moderated class index based on evaluator-locked submissions.
          </p>
        </div>

        {/* Formula and Controls */}
        <div style={{ background: 'linear-gradient(135deg,#f0f4ff,#fafafe)', border: '1.5px solid #c7d2fe', borderRadius: '20px', padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#4338CA', margin: '0 0 8px 0' }}>
            Moderation Formula
          </h3>
          <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#3730a3', margin: '0 0 6px', fontFamily: 'monospace' }}>
            M = (S - P) / N^2  x  (1 + 100 x (N - n))
          </p>
          <p style={{ fontSize: '0.78rem', color: '#6366f1', margin: '0 0 18px' }}>
            S = Locked marks sum | P = Penalty pts | N = Class size | n = {smallestClassSize} (smallest class) | K = 100
          </p>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', marginBottom: '8px' }}>
                Academic Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                style={{ padding: '10px 16px', fontSize: '0.88rem', fontWeight: 600, borderRadius: '9999px', border: '1px solid #c7d2fe', background: '#fff', color: '#1F2937', cursor: 'pointer' }}
              >
                <option value="">All Years</option>
                {academicYears.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <button
              onClick={() => handleRecalculate(year || undefined)}
              disabled={loading}
              style={{
                background: loading ? '#818cf8' : 'linear-gradient(135deg,#4F46E5,#7C3AED)',
                color: '#fff', border: 'none', borderRadius: '9999px', padding: '11px 28px',
                fontWeight: 800, fontSize: '0.88rem', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(99,102,241,0.3)', transition: 'all 0.2s ease',
              }}
            >
              {loading ? 'Calculating...' : 'Recalculate'}
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && <div style={{ textAlign: 'center', padding: '48px', color: '#6366f1', fontWeight: 700 }}>Computing moderated index...</div>}

        {/* Empty state */}
        {!loading && classIndexData !== null && classIndexData.length === 0 && (
          <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E5E7EB', padding: '48px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>No data yet</div>
            <p style={{ color: '#6B7280', margin: 0, fontSize: '0.88rem' }}>Set N and P for classes in Department Management, then Recalculate.</p>
          </div>
        )}

        {/* Podium top 3 */}
        {!loading && ranked.length >= 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '16px' }}>
            {ranked.slice(0, 3).map((entry) => {
              const pod = podiumColors[entry.rank];
              return (
                <div key={entry.class_name} style={{ background: pod.bg, border: `2px solid ${pod.border}`, borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.8rem' }}>{pod.emoji}</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#78716c', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{pod.label}</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#111827', margin: '0 0 2px' }}>{entry.class_name}</h3>
                    <p style={{ fontSize: '0.78rem', color: '#6B7280', margin: 0, fontWeight: 600 }}>{entry.department}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                    <div><div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase' }}>Index M</div><div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#4F46E5' }}>{entry.M?.toFixed(2)}</div></div>
                    <div><div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase' }}>Sum S</div><div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#374151' }}>{entry.S}</div></div>
                    <div><div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase' }}>N</div><div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#374151' }}>{entry.N}</div></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full table */}
        {!loading && (ranked.length > 0 || unranked.length > 0) && (
          <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid #E5E7EB', padding: '28px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', marginTop: 0, marginBottom: '20px' }}>Full Class Rankings</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                    {['Rank', 'Class', 'Department', 'N (Students)', 'S (Locked Marks)', 'P (Penalty)', 'M (Index)'].map((h) => (
                      <th key={h} style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', paddingBottom: '14px', paddingRight: '16px', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ranked.map((entry) => (
                    <tr key={entry.class_name} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '14px 16px 14px 0', fontWeight: 900, fontSize: '1.1rem', color: entry.rank <= 3 ? '#4F46E5' : '#374151' }}>
                        {entry.rank <= 3 ? podiumColors[entry.rank].emoji : '#' + entry.rank}
                      </td>
                      <td style={{ padding: '14px 16px 14px 0', fontWeight: 700, color: '#111827' }}>{entry.class_name}</td>
                      <td style={{ padding: '14px 16px 14px 0', color: '#6B7280', fontSize: '0.88rem' }}>{entry.department}</td>
                      <td style={{ padding: '14px 16px 14px 0', fontWeight: 700, color: '#374151' }}>{entry.N}</td>
                      <td style={{ padding: '14px 16px 14px 0', fontWeight: 700, color: '#374151' }}>{entry.S}</td>
                      <td style={{ padding: '14px 16px 14px 0', fontWeight: 700, color: '#DC2626' }}>{entry.P}</td>
                      <td style={{ padding: '14px 16px 14px 0' }}>
                        <span style={{ background: '#EDE9FE', color: '#5B21B6', borderRadius: '9999px', padding: '4px 14px', fontSize: '0.9rem', fontWeight: 800 }}>
                          {entry.M?.toFixed(4)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {unranked.length > 0 && ranked.length > 0 && (
                    <tr><td colSpan={7} style={{ padding: '10px 0 6px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', borderTop: '2px dashed #E5E7EB' }}>Classes without N set (unranked)</td></tr>
                  )}
                  {unranked.map((entry) => (
                    <tr key={entry.class_name} style={{ borderBottom: '1px solid #F3F4F6', opacity: 0.6 }}>
                      <td style={{ padding: '12px 16px 12px 0', fontWeight: 700, color: '#9CA3AF' }}>-</td>
                      <td style={{ padding: '12px 16px 12px 0', fontWeight: 600, color: '#374151' }}>{entry.class_name}</td>
                      <td style={{ padding: '12px 16px 12px 0', color: '#6B7280', fontSize: '0.88rem' }}>{entry.department}</td>
                      <td style={{ padding: '12px 16px 12px 0', color: '#9CA3AF' }}>N/A</td>
                      <td style={{ padding: '12px 16px 12px 0', fontWeight: 600, color: '#374151' }}>{entry.S}</td>
                      <td style={{ padding: '12px 16px 12px 0', fontWeight: 600, color: '#DC2626' }}>{entry.P}</td>
                      <td style={{ padding: '12px 16px 12px 0', color: '#9CA3AF' }}>N/A</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ margin: '16px 0 0', fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 600 }}>
              {ranked.length} class{ranked.length !== 1 ? 'es' : ''} ranked | {unranked.length} without N set | n = {smallestClassSize}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
