'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { LandingPage } from '@/components/LandingPage';

export default function HomePage() {
  const router = useRouter();
  const { loggedIn, currentRole } = useApp();

  useEffect(() => {
    if (loggedIn && currentRole) {
      const role = currentRole.toLowerCase();
      if (role === 'student') {
        router.push('/student/dashboard');
      } else if (role === 'teacher') {
        router.push('/teacher/dashboard');
      } else if (role === 'iqac') {
        router.push('/iqac/dashboard');
      } else if (role === 'admin') {
        router.push('/admin/academic-years');
      }
    }
  }, [loggedIn, currentRole, router]);

  return <LandingPage />;
}
