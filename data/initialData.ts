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
  details?: string;
  rules?: CriteriaRule[];
}

export interface CriteriaCategory {
  id: string;
  category: string;
  code?: string;
  accessLevel?: string;
  items: CriteriaItem[];
}

export interface Student {
  id: number;
  name: string;
  className: string;
  email?: string;
}

export interface SubmissionEvidence {
  type: string;
  count?: number;
  value?: number;
  checked?: boolean;
  submissionType?: string;
  markBreakdown?: {
    count90Above?: number;
    count80to90?: number;
    count70to80?: number;
    count60to70?: number;
    count50to60?: number;
    count40to50?: number;
    failCount?: number;
    [key: string]: any;
  };
  grades?: {
    S?: number;
    APlus?: number;
    A?: number;
    Fail?: number;
    B?: number;
    C?: number;
    [key: string]: any;
  };
  classPassPercentage?: number;
  totalStudents?: number;
  [key: string]: any;
}

export interface Submission {
  id: number;
  studentId: number;
  criteriaId: number;
  academicYear?: string;
  description: string;
  status: 'Approved' | 'Pending' | 'Pending Verification' | 'Pending Rep Verification' | 'Student Rep Verified' | 'Verified by Student Rep' | 'Teacher Verified' | 'Correction Requested' | 'Rejected' | 'Draft' | 'Submitted' | 'Verified' | 'Evaluated' | 'Locked' | 'Correction';
  remarks?: string;
  marks?: number | null;
  proof?: string;
  eventId?: string;
  evaluatorVerified?: boolean;
  evidence?: SubmissionEvidence;
  verifiedByName?: string;
  user_email?: string;
  userEmail?: string;
  email?: string;
  user_name?: string;
  className?: string;
  class_name?: string;
  repVerifiedByName?: string;
  repRemarks?: string;
  teacherVerifiedByName?: string;
  teacherRemarks?: string;
  evaluatorVerifiedByName?: string;
  evaluatorRemarks?: string;
}

export interface AppUser {
  id: number;
  name: string;
  email: string;
  role: string;
  department?: string;
  className?: string;
  isApproved?: boolean;
  isStudentRep?: boolean;
}

export interface UserGroup {
  id: string;
  name: string;
  description: string;
  emails: string[];
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
      { id: 601, title: "Publication - Scopus / Web of Science", marks: 15, type: "count" },
      { id: 602, title: "Publication - Conference Proceedings / Peer-Reviewed Article", marks: 10, type: "count" },
      { id: 603, title: "Paper Presentation - Outside Marian College", marks: 8, type: "count" },
      { id: 604, title: "Paper Presentation - Inside Marian College", marks: 5, type: "count" },
      { id: 605, title: "Patent - Utility", marks: 20, type: "count" },
      { id: 606, title: "Patent - Design", marks: 15, type: "count" },
      { id: 607, title: "Book Published", marks: 15, type: "count" },
      { id: 608, title: "Book Chapter Published", marks: 8, type: "count" },
      { id: 609, title: "Article Published", marks: 5, type: "count" },
      { id: 610, title: "Funded Project - International Level", marks: 20, type: "count" },
      { id: 611, title: "Funded Project - National Level", marks: 15, type: "count" },
      { id: 612, title: "Funded Project - State Level", marks: 10, type: "count" },
      { id: 613, title: "Funded Project - Other", marks: 5, type: "count" }
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
      { id: 701, title: "Marian College - 1st Prize (Individual)", marks: 5, type: "count" },
      { id: 702, title: "Marian College - 1st Prize (Group)", marks: 3, type: "count" },
      { id: 703, title: "Marian College - 2nd Prize (Individual)", marks: 3, type: "count" },
      { id: 704, title: "Marian College - 2nd Prize (Group)", marks: 2, type: "count" },
      { id: 705, title: "Marian College - 3rd Prize (Individual)", marks: 2, type: "count" },
      { id: 706, title: "Marian College - 3rd Prize (Group)", marks: 1, type: "count" },
      { id: 707, title: "Outside Marian - 1st Prize (Individual)", marks: 10, type: "count" },
      { id: 708, title: "Outside Marian - 1st Prize (Group)", marks: 6, type: "count" },
      { id: 709, title: "Outside Marian - 2nd Prize (Individual)", marks: 8, type: "count" },
      { id: 710, title: "Outside Marian - 2nd Prize (Group)", marks: 4, type: "count" },
      { id: 711, title: "Outside Marian - 3rd Prize (Individual)", marks: 5, type: "count" },
      { id: 712, title: "Outside Marian - 3rd Prize (Group)", marks: 3, type: "count" },
      { id: 713, title: "Outside Marian - Participation (Individual)", marks: 2, type: "count" },
      { id: 714, title: "Outside Marian - Participation (Group)", marks: 1, type: "count" }
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

export const defaultStudents: Student[] = [
  { id: 101, name: "Amal Thomas", className: "II MCA" },
  { id: 102, name: "Santhosh Kannan", className: "II MCA" },
  { id: 103, name: "Santhosh Kannan", className: "II BCA A" }
];

export const defaultSubmissions: Submission[] = [];

export const defaultUsers: AppUser[] = [
  { id: 101, name: "Amal Thomas", email: "amal.25pmc114@mariancollege.org", role: "student", className: "II MCA", department: "The Post-Graduate Department of Computer Applications", isApproved: true },
  { id: 102, name: "Santhosh Kannan", email: "santhosh.25pmc152@mariancollege.org", role: "student", className: "II MCA", department: "The Post-Graduate Department of Computer Applications", isApproved: true, isStudentRep: true },
  { id: 103, name: "Santhosh Kannan", email: "santhosh.25ubc154@mariancollege.org", role: "student", className: "II BCA A", department: "The Under-Graduate Department of Computer Applications", isApproved: true },
  { id: 104, name: "Prof. Kochumol Abraham", email: "kochumol.abraham@mariancollege.org", role: "teacher", className: "II MCA", department: "The Post-Graduate Department of Computer Applications", isApproved: true },
  { id: 105, name: "Allen George", email: "allen.george@mariancollege.org", role: "evaluator", department: "Computer Science", isApproved: true },
  { id: 106, name: "IQAC Coordinator", email: "iqac@mariancollege.org", role: "iqac", department: "Internal Quality Assurance Cell", isApproved: true },
  { id: 107, name: "System Administrator", email: "admin@mariancollege.org", role: "admin", department: "Administration", isApproved: true }
];

export const defaultAcademicYears = ["2025-2026", "2024-2025", "2023-2024"];

export const defaultUserGroups: UserGroup[] = [
  {
    id: "grp-evaluation-committee",
    name: "Evaluation Committee",
    description: "Evaluator members assigned to review activity submissions.",
    emails: ["allen.george@mariancollege.org"]
  },
  {
    id: "grp-class-teachers",
    name: "Class Teachers Council",
    description: "Faculty members acting as class advisors.",
    emails: ["kochumol.abraham@mariancollege.org"]
  },
  {
    id: "grp-student-reps",
    name: "Student Representatives",
    description: "Student council and DQC lead members.",
    emails: ["santhosh.25pmc152@mariancollege.org", "amal.25pmc114@mariancollege.org"]
  }
];
