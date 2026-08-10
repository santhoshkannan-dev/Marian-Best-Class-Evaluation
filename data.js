window.criteriaData = [
  {
    id: "cat-academics",
    category: "Academics",
    items: [
      { id: 101, title: "S Grade Course", marks: 5, type: "count" },
      { id: 102, title: "A+ Grade Course", marks: 3, type: "count" },
      { id: 103, title: "A Grade Course", marks: 1, type: "count" },
      { id: 104, title: "Failed Course", marks: -2, type: "negative" },
      {
        id: 105,
        title: "Class Pass Percentage",
        marks: 0,
        type: "range",
        rules: [
          { min: 95, max: 100, marks: 20 },
          { min: 90, max: 94.99, marks: 15 },
          { min: 85, max: 89.99, marks: 10 },
          { min: 80, max: 84.99, marks: 5 }
        ]
      }
    ]
  },
  {
    id: "cat-online-courses",
    category: "Online Courses",
    items: [
      { id: 201, title: "NPTEL Course Completed", marks: 10, type: "count" },
      { id: 202, title: "MOOC Course Completed", marks: 5, type: "count" },
      { id: 203, title: "Other Recognized Online Course", marks: 3, type: "count" }
    ]
  },
  {
    id: "cat-internships",
    category: "Internships",
    items: [
      { id: 301, title: "Offline Internship", marks: 5, type: "count" },
      { id: 302, title: "Online Internship", marks: 3, type: "count" }
    ]
  },
  {
    id: "cat-competitive-exams",
    category: "Competitive Exams",
    items: [
      { id: 401, title: "JRF Qualified", marks: 20, type: "fixed" },
      { id: 402, title: "NET Qualified", marks: 10, type: "fixed" },
      { id: 403, title: "SET Qualified", marks: 5, type: "fixed" }
    ]
  },
  {
    id: "cat-scholarships",
    category: "Scholarships",
    items: [
      { id: 501, title: "International Scholarship", marks: 20, type: "fixed" },
      { id: 502, title: "National Scholarship", marks: 10, type: "fixed" },
      { id: 503, title: "State Scholarship", marks: 5, type: "fixed" }
    ]
  },
  {
    id: "cat-research",
    category: "Research",
    items: [
      { id: 601, title: "Research Publication", marks: 15, type: "count" },
      { id: 602, title: "Patent Filed or Published", marks: 20, type: "count" },
      { id: 603, title: "Funded or Approved Student Project", marks: 10, type: "count" }
    ]
  },
  {
    id: "cat-prizes",
    category: "Prizes",
    items: [
      { id: 701, title: "Outside College Individual First Prize", marks: 10, type: "count" },
      { id: 702, title: "Outside College Individual Second Prize", marks: 8, type: "count" },
      { id: 703, title: "Outside College Individual Third Prize", marks: 5, type: "count" },
      { id: 704, title: "Outside College Group First Prize", marks: 6, type: "count" },
      { id: 705, title: "Outside College Group Second Prize", marks: 4, type: "count" },
      { id: 706, title: "Outside College Group Third Prize", marks: 3, type: "count" },
      { id: 707, title: "Inside College Individual First Prize", marks: 5, type: "count" },
      { id: 708, title: "Inside College Individual Second Prize", marks: 3, type: "count" },
      { id: 709, title: "Inside College Individual Third Prize", marks: 2, type: "count" },
      { id: 710, title: "Inside College Group First Prize", marks: 3, type: "count" },
      { id: 711, title: "Inside College Group Second Prize", marks: 2, type: "count" },
      { id: 712, title: "Inside College Group Third Prize", marks: 1, type: "count" }
    ]
  },
  {
    id: "cat-leadership",
    category: "Leadership",
    items: [
      { id: 801, title: "Class Representative", marks: 10, type: "fixed" },
      { id: 802, title: "Association or Club Office Bearer", marks: 8, type: "fixed" },
      { id: 803, title: "Event Coordinator Role", marks: 5, type: "count" }
    ]
  },
  {
    id: "cat-programs-organized",
    category: "Programs Organized",
    items: [
      { id: 901, title: "Department Level Program Organized", marks: 5, type: "count" },
      { id: 902, title: "Interdepartment Program Organized", marks: 8, type: "count" },
      { id: 903, title: "State or National Level Program Organized", marks: 15, type: "count" }
    ]
  },
  {
    id: "cat-social-responsibility",
    category: "Social Responsibility",
    items: [
      { id: 1001, title: "NSS/NCC/Service Activity Participation", marks: 5, type: "count" },
      { id: 1002, title: "Community Outreach Activity", marks: 3, type: "count" },
      { id: 1003, title: "Blood Donation or Health Camp Participation", marks: 2, type: "count" }
    ]
  },
  {
    id: "cat-career-advancement",
    category: "Career Advancement",
    items: [
      { id: 1101, title: "Placement Offer Received", marks: 20, type: "fixed" },
      { id: 1102, title: "Higher Studies Admission Secured", marks: 15, type: "fixed" },
      { id: 1103, title: "Professional Certification Completed", marks: 8, type: "count" },
      { id: 1104, title: "Career Workshop Participation", marks: 2, type: "count" }
    ]
  },
  {
    id: "cat-documentation",
    category: "Documentation",
    items: [
      { id: 1201, title: "Complete Best Class File Submitted", marks: 10, type: "fixed" },
      { id: 1202, title: "Valid Proof Uploaded for All Claims", marks: 5, type: "fixed" },
      { id: 1203, title: "Late or Incomplete Documentation", marks: -5, type: "negative" }
    ]
  }
];

window.seedStudents = [];

window.seedSubmissions = [];
