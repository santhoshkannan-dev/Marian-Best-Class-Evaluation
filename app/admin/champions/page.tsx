'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { toast } from 'react-toastify';

export default function ChampionsManagementPage() {
  const { championsData, fetchChampions, academicYears, classes } = useApp();
  const [year, setYear] = useState(academicYears?.[0] || '');
  const [rank, setRank] = useState(1);
  const [rankLabel, setRankLabel] = useState('👑 CHAMPION');
  const [teamName, setTeamName] = useState('');
  const [eventName, setEventName] = useState('');
  const [score, setScore] = useState('');
  const [institution, setInstitution] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchChampions();
  }, []);

  // Set default year if not set and academicYears is loaded
  useEffect(() => {
    if (!year && academicYears && academicYears.length > 0) {
      setYear(academicYears[0]);
    }
  }, [academicYears, year]);

  // Handle team name change and auto-fill department
  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTeamName(val);
    
    // Auto-detect department
    const foundClass = classes.find(c => c.name === val);
    if (foundClass && foundClass.department) {
      setInstitution(foundClass.department);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!year || !teamName || !score) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('year', year);
    formData.append('rank', rank.toString());
    formData.append('rankLabel', rankLabel);
    formData.append('teamName', teamName);
    formData.append('eventName', eventName);
    formData.append('score', score);
    formData.append('institution', institution);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const res = await fetch('http://localhost:8000/api/champions/', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        toast.success('Champion added successfully!');
        setTeamName('');
        setScore('');
        setImageFile(null);
        await fetchChampions();
      } else {
        toast.error('Failed to add champion.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error adding champion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this champion?')) return;
    
    try {
      const res = await fetch(`http://localhost:8000/api/champions/${id}/`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchChampions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Previous Champions Management</h1>
        <p className="muted" style={{ fontSize: '0.88rem' }}>Add and manage previous year champions displayed on the home screen.</p>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Add New Champion</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Academic Year</label>
              <input
                type="text"
                list="year-list"
                placeholder="e.g., 2023-2024"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
              <datalist id="year-list">
                {academicYears.map(ay => (
                  <option key={ay} value={ay} />
                ))}
              </datalist>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Rank</label>
              <input
                type="number"
                min="1"
                value={rank}
                onChange={(e) => setRank(parseInt(e.target.value))}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Rank Label</label>
              <input
                type="text"
                placeholder="e.g., 👑 CHAMPION"
                value={rankLabel}
                onChange={(e) => setRankLabel(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Team / Class Name</label>
              <input
                type="text"
                list="class-list"
                placeholder="Search or type class name"
                value={teamName}
                onChange={handleTeamNameChange}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
              <datalist id="class-list">
                {classes.map(c => (
                  <option key={c.id} value={c.name} />
                ))}
              </datalist>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Event Name (Optional)</label>
              <input
                type="text"
                placeholder="e.g., Dept. of Computer Science — Marian Excellence Grid"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Department / Institution</label>
              <input
                type="text"
                placeholder="e.g., Dept. of Comp Science"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Score</label>
              <input
                type="text"
                placeholder="e.g., 98.4"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Team Image (JPG/PNG)</label>
              <input
                type="file"
                accept="image/jpeg, image/png"
                onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '12px',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              marginTop: '8px'
            }}
          >
            {isSubmitting ? 'Adding...' : 'Add Champion'}
          </button>
        </form>
      </div>

      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Saved Champions</h2>
        
        {Object.keys(championsData).length === 0 ? (
          <p className="muted" style={{ fontStyle: 'italic' }}>No champions found.</p>
        ) : (
          Object.entries(championsData)
            .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA))
            .map(([yr, champs]) => (
            <div key={yr} style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '12px' }}>Year: {yr}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {champs.map((champ) => (
                  <div key={champ.id} className="card" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    {champ.image && (
                      <img 
                        src={`http://localhost:8000${champ.image}`} 
                        alt="Team" 
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} 
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80'; }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 800, fontSize: '1rem', margin: 0, color: 'var(--text-main)' }}>{champ.teamName}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--primary)', margin: '4px 0', fontWeight: 600 }}>{champ.rankLabel} (Rank {champ.rank})</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Score: {champ.score}</p>
                    </div>
                    <button
                      onClick={() => champ.id && handleDelete(champ.id)}
                      style={{
                        padding: '6px 12px',
                        background: '#fee2e2',
                        color: '#ef4444',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
