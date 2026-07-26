export interface PolicyCategory {
  id: string;
  title: string;
  description: string;
  badge: string;
  icon: string;
  maxMarks: string;
  highlights: string[];
  gradient: string;
}

export const policyCategories: PolicyCategory[] = [
  {
    id: '1',
    title: 'Academics',
    description: 'Semester grades and class pass percentage metrics.',
    badge: '🎓 Academics',
    icon: '📚',
    maxMarks: '5.0 / 20.0',
    highlights: [
      'S Grade = 5 Marks | A+ = 4 | A = 3',
      'Failed Course = -2 penalty',
      'Pass %: 90-100 = 5, 80-90 = 4, 70-80 = 3, 60-70 = 2, 50-60 = 1'
    ],
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
  },
  {
    id: '2',
    title: 'Online Courses',
    description: 'Certifications from NPTEL, SWAYAM, and MOOC platforms.',
    badge: '💻 Tech Certs',
    icon: '💻',
    maxMarks: '10.0 per course',
    highlights: [
      'Maximum 3 courses evaluated',
      'Requires DigiLocker Verified Certificate',
      'ABC credits matching timeframe (June-February)'
    ],
    gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)'
  },
  {
    id: '3',
    title: 'Competitive Exams',
    description: 'Performance in state, national, and international qualifying tests.',
    badge: '📝 Entrance Tests',
    icon: '🏆',
    maxMarks: '20.0 maximum',
    highlights: [
      'JRF Qualified = 20 Marks',
      'NET Qualified = 10 Marks',
      'IELTS / PET / Languages = 3 Marks | Participation = 1 Mark'
    ],
    gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)'
  },
  {
    id: '4',
    title: 'Internships',
    description: 'External placements and professional syllabus internships.',
    badge: '💼 Internships',
    icon: '💼',
    maxMarks: '5.0 per count',
    highlights: [
      'Offline Internship = 5 Marks',
      'Online Internship = 3 Marks',
      'Minimum duration: 1 Month (outside syllabus only)'
    ],
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)'
  },
  {
    id: '5',
    title: 'Scholarships',
    description: 'State, national, or international academic merit scholarships.',
    badge: '💰 Merit Aids',
    icon: '🎓',
    maxMarks: '20.0 maximum',
    highlights: [
      'International Scholarship = 20 Marks',
      'National Scholarship = 10 Marks',
      'State level = 5 Marks | District level = 2 Marks'
    ],
    gradient: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)'
  },
  {
    id: '6',
    title: 'Research',
    description: 'Scientific articles, publications, patents, and projects.',
    badge: '🔬 Innovations',
    icon: '🔬',
    maxMarks: '20.0 maximum',
    highlights: [
      'Scopus / UGC Care = 10 Marks | Patent = 10 Marks | Book = 10',
      'Conference Presentation = 5 Marks | Article publication = 2',
      'Funded Projects: Intl = 20 Marks | Natl = 10 | State = 5'
    ],
    gradient: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)'
  },
  {
    id: '7',
    title: 'Startups',
    description: 'Government registered student startups and ventures.',
    badge: '🚀 Entrepreneurship',
    icon: '🚀',
    maxMarks: '10.0 maximum',
    highlights: [
      'Government Registered Startup = 10 Marks',
      'Evaluated per Startup unit (Not per student)',
      'Valid registration proof required'
    ],
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)'
  },
  {
    id: '8',
    title: 'Prizes',
    description: 'Recognition and wins in outside and inside college contests.',
    badge: '🥇 Achievements',
    icon: '🥇',
    maxMarks: '15.0 per count',
    highlights: [
      'Outside: 1st = 15 Marks | 2nd = 10 | 3rd = 5',
      'Inside Marian: 1st = 10 Marks | 2nd = 5 | 3rd = 3',
      'Contest Participation = 3 Marks'
    ],
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)'
  },
  {
    id: '9',
    title: 'Leadership',
    description: 'Student Union, executive bodies, and club leadership roles.',
    badge: '👨‍💼 Leadership',
    icon: '👨‍💼',
    maxMarks: '10.0 maximum',
    highlights: [
      'Student Union MCSC = 10 Marks',
      'SAHYA Executive = 8 Marks',
      'Club Leaders / Office Bearer = 5 Marks'
    ],
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
  },
  {
    id: '10',
    title: 'Programs Organized',
    description: 'Event coordination, seminar management, and editor roles.',
    badge: '🎉 Coordination',
    icon: '🎉',
    maxMarks: '5.0 per count',
    highlights: [
      'Inter-Collegiate Seminar = 5 Marks',
      'Intra-Collegiate / Department Seminar = 3 Marks',
      'College Magazine Editor = 5 Marks'
    ],
    gradient: 'linear-gradient(135deg, #e11d48 0%, #9f1239 100%)'
  },
  {
    id: '11',
    title: 'Social Responsibility',
    description: 'Community outreach, NSS/NCC camps, and discipline files.',
    badge: '❤️ Social Value',
    icon: '❤️',
    maxMarks: '5.0 / -10.0',
    highlights: [
      'NSS / NCC Coordinator = 5 Marks | Participation = 3',
      'Outreach / Media Coverage = 3 Marks',
      'Discipline infraction penalty = -10 Marks'
    ],
    gradient: 'linear-gradient(135deg, #10b981 0%, #065f46 100%)'
  },
  {
    id: '12',
    title: 'Career Advancement',
    description: 'Self-learning, library engagement, and public repositories.',
    badge: '📈 Professional',
    icon: '📈',
    maxMarks: '10.0 maximum',
    highlights: [
      'Active Library Hours and borrow logs',
      'LinkedIn and professional profiles',
      'Public GitHub / GitLab coding repositories'
    ],
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)'
  },
  {
    id: '13',
    title: 'Documentation',
    description: 'Verification proof compliance and file compliance quality.',
    badge: '📂 Auditing',
    icon: '📂',
    maxMarks: '25.0 maximum',
    highlights: [
      'Digital file submitted = 25 Marks',
      'Proof verification interactions audits',
      'Strictly zero oral presentations accepted'
    ],
    gradient: 'linear-gradient(135deg, #6b7280 0%, #374151 100%)'
  }
];
