export interface CriteriaRule {
  min?: number;
  max?: number;
  marks: number;
}

export interface CriteriaItem {
  id: number;
  title: string;
  category?: string;
  marks: number;
  type: 'count' | 'range' | 'fixed' | 'negative' | 'boolean';
  rules?: CriteriaRule[];
}

export interface CriteriaCategory {
  id: string;
  category: string;
  items: CriteriaItem[];
}

export interface Student {
  id: number;
  name: string;
  className: string;
}

export interface SubmissionEvidence {
  type: string;
  count?: number;
  value?: number;
  checked?: boolean;
}

export interface Submission {
  id: number;
  studentId: number;
  criteriaId: number;
  academicYear?: string;
  description: string;
  status: 'Approved' | 'Pending' | 'Correction Requested' | 'Rejected' | 'Draft' | 'Submitted' | 'Verified' | 'Evaluated' | 'Locked' | 'Correction';
  remarks?: string;
  marks?: number | null;
  proof?: string;
  evaluatorVerified?: boolean;
  evidence?: SubmissionEvidence;
}

export interface AppUser {
  id: number;
  name: string;
  email: string;
  role: string;
  department?: string;
  className?: string;
  isApproved?: boolean;
}

export const defaultCriteriaCatalog: CriteriaCategory[] = [
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

export const defaultStudents: Student[] = [
  { id: 1, name: "Anika Sharma", className: "BSc CS A" },
  { id: 2, name: "Rahul Menon", className: "BSc CS A" },
  { id: 3, name: "Sara Joseph", className: "BCom B" },
  { id: 4, name: "Arjun Das", className: "BCom B" },
  { id: 5, name: "Nisha Iyer", className: "BA English C" },
  { id: 6, name: "Vikram Patel", className: "BA English C" }
];

export const defaultSubmissions: Submission[] = [
  {
    id: 1,
    studentId: 1,
    criteriaId: 105,
    description: "Department result sheet shows 93.4% pass for BSc CS A.",
    status: "Approved",
    remarks: "Verified against semester result summary",
    marks: 15,
    proof: "bsc_cs_a_pass_percentage_2025.xlsx",
    evaluatorVerified: true,
    evidence: { type: "range", value: 93.4 }
  },
  {
    id: 2,
    studentId: 1,
    criteriaId: 101,
    description: "Five S grades secured across semester courses.",
    status: "Approved",
    remarks: "Grade cards checked",
    marks: 25,
    proof: "anika_s_grade_cards.pdf",
    evaluatorVerified: true,
    evidence: { type: "count", count: 5 }
  },
  {
    id: 3,
    studentId: 1,
    criteriaId: 201,
    description: "Completed two NPTEL courses with certificates.",
    status: "Approved",
    remarks: "Certificates valid",
    marks: 20,
    proof: "anika_nptel_certificates.zip",
    evaluatorVerified: false,
    evidence: { type: "count", count: 2 }
  },
  {
    id: 4,
    studentId: 1,
    criteriaId: 301,
    description: "Offline internship completed at TechNova Labs.",
    status: "Approved",
    remarks: "Completion letter verified",
    marks: 5,
    proof: "technova_internship_letter.pdf",
    evaluatorVerified: true,
    evidence: { type: "count", count: 1 }
  },
  {
    id: 5,
    studentId: 1,
    criteriaId: 601,
    description: "Research paper accepted in a peer-reviewed student journal.",
    status: "Pending",
    remarks: "Awaiting publication proof",
    marks: null,
    proof: "publication_acceptance_mail.pdf",
    evaluatorVerified: false,
    evidence: { type: "count", count: 1 }
  },
  {
    id: 6,
    studentId: 2,
    criteriaId: 102,
    description: "Six A+ grades secured in the latest semester.",
    status: "Approved",
    remarks: "Mark lists verified",
    marks: 18,
    proof: "rahul_a_plus_results.pdf",
    evaluatorVerified: true,
    evidence: { type: "count", count: 6 }
  },
  {
    id: 7,
    studentId: 2,
    criteriaId: 202,
    description: "Three MOOC courses completed through Coursera and SWAYAM.",
    status: "Approved",
    remarks: "Certificates checked",
    marks: 15,
    proof: "rahul_mooc_certificates.zip",
    evaluatorVerified: true,
    evidence: { type: "count", count: 3 }
  },
  {
    id: 8,
    studentId: 2,
    criteriaId: 402,
    description: "Qualified UGC NET in Computer Science.",
    status: "Approved",
    remarks: "NET score card verified",
    marks: 10,
    proof: "rahul_net_scorecard.pdf",
    evaluatorVerified: true,
    evidence: { type: "fixed" }
  }
];

export const defaultUsers: AppUser[] = [
  { id: 1, name: "Anika Sharma", email: "anika@marian.ac.in", role: "student", className: "BSc CS A", isApproved: true },
  { id: 2, name: "Prof. Rajesh Kumar", email: "rajesh@marian.ac.in", role: "teacher", className: "BSc CS A", department: "Computer Science", isApproved: true },
  { id: 3, name: "Dr. Elizabeth Varghese", email: "elizabeth@marian.ac.in", role: "evaluator", department: "Computer Science", isApproved: true },
  { id: 4, name: "Admin Officer", email: "admin@marian.ac.in", role: "admin", isApproved: true },
  { id: 5, name: "Dr. Thomas Philip", email: "hod.cs@marian.ac.in", role: "hod", department: "Computer Science", isApproved: true },
  { id: 6, name: "IQAC Coordinator", email: "iqac@marian.ac.in", role: "iqac", isApproved: true }
];

export const defaultAcademicYears = ["2025-2026", "2024-2025", "2023-2024"];
