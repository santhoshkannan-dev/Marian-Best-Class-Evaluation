'use client';

import React from 'react';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { PolicyCarousel } from '@/components/PolicyCarousel';
import { EvaluationGrid } from '@/components/EvaluationGrid';
import { WorkflowTimeline } from '@/components/WorkflowTimeline';
import { ScoreCalculation } from '@/components/ScoreCalculation';
import { OutcomesGrid } from '@/components/OutcomesGrid';

export default function PolicyPage() {
  return (
    <main
      style={{
        maxWidth: '1200px',
        margin: '40px auto 80px',
        padding: '0 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '60px',
        animation: 'fadeUp 0.8s ease-out'
      }}
    >
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. 3D Card Carousel Section */}
      <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <PolicyCarousel />
      </section>

      {/* 3. Evaluation Grid Details */}
      <EvaluationGrid />

      {/* 4. Timeline Workflow */}
      <WorkflowTimeline />

      {/* 5. Score Formulation */}
      <ScoreCalculation />

      {/* 6. Expected Outcomes */}
      <OutcomesGrid />

      {/* Back button Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          borderTop: '1px solid var(--color-border)',
          paddingTop: '40px',
          marginTop: '20px'
        }}
      >
        <Link
          href="/"
          className="btn btn-primary"
          style={{
            padding: '14px 32px',
            borderRadius: '14px',
            fontSize: '1rem',
            boxShadow: '0 10px 25px rgba(79, 70, 229, 0.15)',
            textDecoration: 'none'
          }}
        >
          &larr; Return to Workspace
        </Link>
      </div>
    </main>
  );
}
