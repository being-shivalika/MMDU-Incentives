export const researchReviewMockData = [
  {
    id: "SUB-2024-001",
    applicant: {
      name: "Dr. Rajesh Kumar",
      type: "Faculty",
      id: "F1001",
    },
    department: "Computer Science & Engineering",
    type: "Publication",
    title: "Deep Learning Approaches in Healthcare",
    submittedDate: "2024-03-10",
    priority: "High",
    status: "pending_verification",
    journalName: "IEEE Transactions on Medical Imaging",
    impactFactor: "10.6",
    indexing: "SCI",
    comments: [],
    timeline: [
      { status: "submitted", date: "2024-03-10", by: "Applicant" },
      { status: "hod_approved", date: "2024-03-12", by: "Dr. Amit Singh (HOD)" }
    ]
  },
  {
    id: "SUB-2024-002",
    applicant: {
      name: "Anita Sharma",
      type: "Student",
      id: "S2001",
    },
    department: "Mechanical Engineering",
    type: "Patent",
    title: "Novel Cooling System for EVs",
    submittedDate: "2024-03-12",
    priority: "Medium",
    status: "verified",
    applicationNo: "20241012345",
    patentStatus: "Published",
    comments: [
      { text: "Verified patent publication details online.", by: "Review Cell", date: "2024-03-14" }
    ],
    timeline: [
      { status: "submitted", date: "2024-03-12", by: "Applicant" },
      { status: "hod_approved", date: "2024-03-13", by: "Dr. Vikram Seth (HOD)" },
      { status: "verified", date: "2024-03-14", by: "Research Review" }
    ]
  },
  {
    id: "SUB-2024-003",
    applicant: {
      name: "Dr. Priya Verma",
      type: "Faculty",
      id: "F1005",
    },
    department: "Electronics & Communication",
    type: "Project",
    title: "IoT based Smart Agriculture",
    submittedDate: "2024-03-14",
    priority: "High",
    status: "returned",
    fundingAgency: "DST",
    amount: "50,00,000 INR",
    comments: [
      { text: "Please attach the revised budget document.", by: "Research Review", date: "2024-03-16" }
    ],
    timeline: [
      { status: "submitted", date: "2024-03-14", by: "Applicant" },
      { status: "hod_approved", date: "2024-03-15", by: "Dr. R.K. Sharma (HOD)" },
      { status: "returned", date: "2024-03-16", by: "Research Review" }
    ]
  },
  {
    id: "SUB-2024-004",
    applicant: {
      name: "Dr. Anil Gupta",
      type: "Faculty",
      id: "F1012",
    },
    department: "Civil Engineering",
    type: "Consultancy",
    title: "Structural Audit of City Bridge",
    submittedDate: "2024-03-05",
    priority: "Low",
    status: "forwarded_accounts",
    client: "Municipal Corporation",
    revenue: "2,00,000 INR",
    comments: [
      { text: "All documents verified.", by: "Research Review", date: "2024-03-08" }
    ],
    timeline: [
      { status: "submitted", date: "2024-03-05", by: "Applicant" },
      { status: "hod_approved", date: "2024-03-06", by: "Dr. S. Patil (HOD)" },
      { status: "verified", date: "2024-03-08", by: "Research Review" },
      { status: "forwarded_accounts", date: "2024-03-09", by: "Research Review" }
    ]
  }
];
