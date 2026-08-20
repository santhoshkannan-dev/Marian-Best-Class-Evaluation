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
      { id: 201, title: "Swayam / NPTEL Course", marks: 10, type: "count" },
      { id: 202, title: "MOOC Course", marks: 5, type: "count" }
    ]
  },
  {
    id: "cat-competitive-exams",
    category: "Competitive Exams",
    items: [
      { id: 401, title: "JRF Passed", marks: 20, type: "fixed" },
      { id: 402, title: "NET Passed", marks: 10, type: "fixed" },
      { id: 403, title: "Any Other Relevant Exam (IELTS, PET, Language Specific, etc.)", marks: 5, type: "fixed" },
      { id: 404, title: "Participation in Relevant Exam (UPSC / PSC Exams)", marks: 3, type: "count" }
    ]
  },
  {
    id: "cat-internships",
    category: "Internships",
    items: [
      { id: 301, title: "Offline Internship (Min. 1 month)", marks: 5, type: "count" },
      { id: 302, title: "Online Internship (Min. 1 month)", marks: 3, type: "count" }
    ]
  },
  {
    id: "cat-scholarships",
    category: "Scholarships",
    items: [
      { id: 501, title: "International Level Scholarship", marks: 20, type: "fixed" },
      { id: 502, title: "National Level Scholarship", marks: 10, type: "fixed" },
      { id: 503, title: "State Level Scholarship", marks: 5, type: "fixed" },
      { id: 504, title: "District Level Scholarship", marks: 3, type: "fixed" }
    ]
  },
  {
    id: "cat-research",
    category: "Research",
    items: [
      { id: 601, title: "Publications", marks: 15, type: "count" },
      { id: 602, title: "Paper Presentation", marks: 8, type: "count" },
      { id: 603, title: "Patents", marks: 20, type: "count" },
      { id: 604, title: "Books & Articles", marks: 15, type: "count" },
      { id: 605, title: "Funded Projects", marks: 20, type: "count" }
    ]
  },
  {
    id: "cat-startups",
    category: "Startups",
    items: [
      { id: 651, title: "Government-Registered Start-up", marks: 20, type: "count" }
    ]
  },
  {
    id: "cat-prizes",
    category: "Prizes",
    items: [
      { id: 701, title: "Marian College - 1st Prize (Individual)", marks: 10, type: "count" },
      { id: 703, title: "Marian College - 2nd Prize (Individual)", marks: 5, type: "count" },
      { id: 705, title: "Marian College - 3rd Prize (Individual)", marks: 3, type: "count" },
      { id: 702, title: "Marian College - 1st Prize (Group)", marks: 5, type: "count" },
      { id: 704, title: "Marian College - 2nd Prize (Group)", marks: 3, type: "count" },
      { id: 706, title: "Marian College - 3rd Prize (Group)", marks: 2, type: "count" },
      { id: 707, title: "Outside Marian - 1st Prize (Individual)", marks: 15, type: "count" },
      { id: 709, title: "Outside Marian - 2nd Prize (Individual)", marks: 10, type: "count" },
      { id: 711, title: "Outside Marian - 3rd Prize (Individual)", marks: 5, type: "count" },
      { id: 713, title: "Outside Marian - Participation (Individual)", marks: 3, type: "count" },
      { id: 708, title: "Outside Marian - 1st Prize (Group)", marks: 10, type: "count" },
      { id: 710, title: "Outside Marian - 2nd Prize (Group)", marks: 5, type: "count" },
      { id: 712, title: "Outside Marian - 3rd Prize (Group)", marks: 3, type: "count" },
      { id: 714, title: "Outside Marian - Participation (Group)", marks: 2, type: "count" }
    ]
  },
  {
    id: "cat-leadership",
    category: "Leaderships",
    items: [
      { id: 801, title: "MCSC Executive Body Position", marks: 10, type: "fixed" },
      { id: 802, title: "SAHYA Executive Body Position", marks: 10, type: "fixed" },
      { id: 803, title: "Clubs & Associations Leadership Position", marks: 8, type: "fixed" }
    ]
  },
  {
    id: "cat-social-responsibility",
    category: "Social Responsibilities",
    items: [
      { id: 1001, title: "Coordination of Event (Community Action / Outreach)", marks: 5, type: "count" },
      { id: 1002, title: "Participation in Event", marks: 3, type: "count" },
      { id: 1003, title: "News Media Coverage (Excluding Social Media)", marks: 5, type: "count" }
    ]
  },
  {
    id: "cat-career-advancement",
    category: "Career Advancement",
    items: [
      { id: 1101, title: "Library - Regular Footfall (Biometric / Entry)", marks: 5, type: "count" },
      { id: 1102, title: "Library - Academic & Career Books Issued/Read", marks: 5, type: "count" },
      { id: 1103, title: "LinkedIn - Profile Completion (Active Profile)", marks: 5, type: "fixed" },
      { id: 1104, title: "LinkedIn - Skill Badges Earned", marks: 5, type: "count" },
      { id: 1105, title: "LinkedIn - Micro-credentials / Learning Certifications", marks: 5, type: "count" },
      { id: 1106, title: "Repository Creation (Drive / GitHub / LMS / Website)", marks: 10, type: "fixed" }
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
