// Reusable mock data and local storage state coordinator for the Research Incentive Management Portal

const INITIAL_DEPARTMENTS = [
  "Computer Science & Engineering",
  "Electronics & Communication Engineering",
  "Mechanical Engineering",
  "Biotechnology",
  "Physics & Material Science",
  "Management Studies",
];

const INITIAL_USERS = [
  {
    id: "u-1",
    email: "faculty@university.edu",
    password: "password",
    name: "Dr. Arjit Thakur",
    role: "faculty",
    department: "Computer Science & Engineering",
    designation: "Professor",
    avatar: "AT",
  },
  {
    id: "u-2",
    email: "student@university.edu",
    password: "password",
    name: "Sarah Jenkins",
    role: "student",
    department: "Computer Science & Engineering",
    designation: "Research Scholar",
    avatar: "SJ",
  },
  {
    id: "u-3",
    email: "hod@university.edu",
    password: "password",
    name: "Dr. Marcus Vance",
    role: "hod",
    department: "Computer Science & Engineering",
    designation: "Head of Department",
    avatar: "MV",
  },
  {
    id: "u-4",
    email: "rpc@university.edu",
    password: "password",
    name: "Dr. Elena Rostova",
    role: "rpc",
    department: "Physics & Material Science",
    designation: "Dean of Research / RPC Chair",
    avatar: "ER",
  },
  {
    id: "u-5",
    email: "accounts@university.edu",
    password: "password",
    name: "Mr. Robert Sterling",
    role: "accounts",
    department: "Finance & Accounts Department",
    designation: "Senior Accounts Officer",
    avatar: "RS",
  },
  {
    id: "u-6",
    email: "admin@university.edu",
    password: "password",
    name: "Adminstrator",
    role: "admin",
    department: "Information Technology Cell",
    designation: "System Administrator",
    avatar: "AD",
  },
  {
    id: "u-7",
    email: "principal@university.edu",
    password: "password",
    name: "Dr. Arthur Pendelton",
    role: "principal",
    department: "Office of the Principal",
    designation: "Principal / Director",
    avatar: "AP",
  },
  {
    id: "u-8",
    email: "faculty2@university.edu",
    password: "password",
    name: "Dr. Clara Barton",
    role: "faculty",
    department: "Electronics & Communication Engineering",
    designation: "Associate Professor",
    avatar: "CB",
  },
];

const INTERNAL_FACULTY = [
  {
    employeeId: "EMP-101",
    name: "Dr. Arjit Thakur",
    department: "Computer Science & Engineering",
    designation: "Professor",
  },
  {
    employeeId: "EMP-102",
    name: "Dr. Clara Barton",
    department: "Electronics & Communication Engineering",
    designation: "Associate Professor",
  },
  {
    employeeId: "EMP-103",
    name: "Dr. Marcus Vance",
    department: "Computer Science & Engineering",
    designation: "Head of Department",
  },
  {
    employeeId: "EMP-104",
    name: "Dr. Elena Rostova",
    department: "Physics & Material Science",
    designation: "Dean of Research / RPC Chair",
  },
  {
    employeeId: "EMP-105",
    name: "Dr. Arthur Pendelton",
    department: "Office of the Principal",
    designation: "Principal",
  },
  {
    employeeId: "EMP-106",
    name: "Dr. Jonathan Reyes",
    department: "Biotechnology",
    designation: "Professor",
  },
  {
    employeeId: "EMP-107",
    name: "Dr. Emily Watson",
    department: "Management Studies",
    designation: "Associate Professor",
  },
  {
    employeeId: "EMP-108",
    name: "Dr. David Kael",
    department: "Physics & Material Science",
    designation: "Professor",
  },
  {
    employeeId: "EMP-109",
    name: "Dr. Sarah Jenkins",
    department: "Computer Science & Engineering",
    designation: "Assistant Professor",
  },
];

const INITIAL_CIRCULARS = [
  {
    id: "c-1",
    title: "Updated Research Incentive Guidelines 2026",
    date: "2026-07-15",
    category: "Policy",
    author: "RPC Cell",
    fileUrl: "#",
    isNew: true,
  },
  {
    id: "c-2",
    title: "Call for Proposals - Internal Seed Research Grant 2026-27",
    date: "2026-07-02",
    category: "Grants",
    author: "Dean Research",
    fileUrl: "#",
    isNew: false,
  },
  {
    id: "c-3",
    title: "Mandatory ORCID ID and Scopus ID integration on Directory",
    date: "2026-06-28",
    category: "Circular",
    author: "Academic Cell",
    fileUrl: "#",
    isNew: false,
  },
];

const INITIAL_SUBMISSIONS = [
  {
    id: "claim-101",
    title:
      "Deep Learning Architectures for Edge Computing in Smart Agriculture",
    category: "journal",
    status: "pending_hod",
    creatorId: "u-1",
    creatorName: "Dr. Aris Thorne",
    creatorDept: "Computer Science & Engineering",
    creatorRole: "faculty",
    dateSubmitted: "2026-07-18T10:30:00Z",
    fields: {
      researchDomain: "Artificial Intelligence",
      publicationType: "Journal Paper",
      journalName: "IEEE Transactions on Agriculture and Robotics",
      issn: "1939-1404",
      publisher: "IEEE",
      scopusIndexed: "Yes",
      sciIndexed: "Yes",
      scieIndexed: "Yes",
      ugcApproved: "Yes",
      quartile: "Q1",
      publicationDate: "2026-05-12",
      doi: "10.1109/TAR.2026.012345",
      volume: "14",
      issue: "3",
      pages: "245-259",
      impactFactor: "7.8",
      coAuthors: ["EMP-102", "EMP-109"], // Stored as internal employee IDs
      correspondingAuthor: "EMP-101",
      externalCollaborators: [
        { name: "Dr. Jane Doe", organization: "MIT", country: "United States" },
      ],
      // Verification Links
      scopusUrl:
        "https://www.scopus.com/record/display.uri?eid=2-s2.0-85192837192",
      publisherUrl: "https://ieeexplore.ieee.org/document/1012345",
      journalUrl: "https://www.ieee- robotics-agriculture.org",
      wosUrl:
        "https://www.webofscience.com/wos/woscc/full-record/WOS:001234567800001",
      ugcUrl:
        "https://ugccare.unipune.ac.in/apps1/User/WebSearch/SearchJournal?issn=1939-1404",
      orcidProfile: "https://orcid.org/0000-0002-1825-0097",
      remarks:
        "Verified publisher links. Requesting standard incentive for CSE.",
    },
    approvalHistory: [
      {
        step: "Submitted",
        status: "completed",
        actionBy: "u-1",
        actionByName: "Dr. Aris Thorne",
        remarks: "Claim submitted for review.",
        date: "2026-07-18T10:30:00Z",
      },
    ],
    incentiveAmount: 0,
    paymentDetails: null,
  },
  {
    id: "claim-102",
    title: "High-Efficiency Silicon Photovoltaic Cells with Graphene Overlays",
    category: "patent",
    status: "pending_rpc",
    creatorId: "u-8",
    creatorName: "Dr. Clara Barton",
    creatorDept: "Electronics & Communication Engineering",
    creatorRole: "faculty",
    dateSubmitted: "2026-07-10T14:20:00Z",
    fields: {
      patentNumber: "PAT/2026/99812",
      patentType: "Indian",
      patentStatus: "Granted",
      filedDate: "2024-03-12",
      grantedDate: "2026-06-30",
      patentOffice: "Indian Patent Office, New Delhi",
      inventors: ["EMP-102", "EMP-104"],
      technologyDomain: "Renewable Energy Systems",
      // Verification Links
      patentUrl:
        "https://ipindiaservices.gov.in/publicsearch/granted-patents/PAT202699812",
      remarks:
        "Patent officially granted after examination. Links to IPIndia portal attached.",
    },
    approvalHistory: [
      {
        step: "Submitted",
        status: "completed",
        actionBy: "u-8",
        actionByName: "Dr. Clara Barton",
        remarks: "Claim submitted.",
        date: "2026-07-10T14:20:00Z",
      },
      {
        step: "HOD Review",
        status: "approved",
        actionBy: "u-3",
        actionByName: "Dr. Marcus Vance",
        remarks:
          "Excellent milestone for ECE department. Recommended for final RPC approval.",
        date: "2026-07-12T09:15:00Z",
      },
    ],
    incentiveAmount: 0,
    paymentDetails: null,
  },
  {
    id: "claim-103",
    title: "EcoDrive: IoT-Enabled Electric Vehicle Smart Telemetry Startup",
    category: "startup",
    status: "pending_accounts",
    creatorId: "u-2",
    creatorName: "Sarah Jenkins",
    creatorDept: "Computer Science & Engineering",
    creatorRole: "student",
    dateSubmitted: "2026-07-05T09:00:00Z",
    fields: {
      startupName: "EcoDrive Telemetry Private Limited",
      registrationNumber: "U72900DL2026PTC392812",
      funding: "15,000 USD (Seed Grant)",
      incubation: "University Technology Business Incubator (TBI)",
      website: "https://ecodrive-telemetry.io",
      description:
        "Building smart telemetry boards for electric two-wheelers to optimize range.",
      startupUrl: "https://www.mca.gov.in/content/mca/global/en/home.html",
      remarks:
        "Startup registered and incubated in the university campus incubator.",
    },
    approvalHistory: [
      {
        step: "Submitted",
        status: "completed",
        actionBy: "u-2",
        actionByName: "Sarah Jenkins",
        remarks: "Submitted.",
        date: "2026-07-05T09:00:00Z",
      },
      {
        step: "HOD Review",
        status: "approved",
        actionBy: "u-3",
        actionByName: "Dr. Marcus Vance",
        remarks: "Outstanding student innovation. Approved.",
        date: "2026-07-06T11:00:00Z",
      },
      {
        step: "RPC Verification",
        status: "approved",
        actionBy: "u-4",
        actionByName: "Dr. Elena Rostova",
        remarks:
          "Qualifies under Section 8 of the Research Policy. Verified and forwarded to Accounts.",
        date: "2026-07-09T16:40:00Z",
      },
    ],
    incentiveAmount: 750, // USD
    paymentDetails: null,
  },
  {
    id: "claim-104",
    title: "Introduction to Quantum Information and Quantum Circuits",
    category: "book",
    status: "released",
    creatorId: "u-1",
    creatorName: "Dr. Aris Thorne",
    creatorDept: "Computer Science & Engineering",
    creatorRole: "faculty",
    dateSubmitted: "2026-06-01T11:00:00Z",
    fields: {
      bookTitle: "Introduction to Quantum Information and Quantum Circuits",
      publisher: "Springer Nature",
      isbn: "978-3-030-12345-6",
      publicationDate: "2026-04-15",
      coAuthors: ["EMP-104"],
      editors: "N/A",
      edition: "1st Edition",
      volume: "1",
      bookUrl: "https://link.springer.com/book/10.1007/978-3-030-12345-6",
      remarks: "Undergraduate level textbook published internationally.",
    },
    approvalHistory: [
      {
        step: "Submitted",
        status: "completed",
        actionBy: "u-1",
        actionByName: "Dr. Aris Thorne",
        remarks: "Submitted.",
        date: "2026-06-01T11:00:00Z",
      },
      {
        step: "HOD Review",
        status: "approved",
        actionBy: "u-3",
        actionByName: "Dr. Marcus Vance",
        remarks: "Excellent reference material. Approved.",
        date: "2026-06-03T10:00:00Z",
      },
      {
        step: "RPC Verification",
        status: "approved",
        actionBy: "u-4",
        actionByName: "Dr. Elena Rostova",
        remarks: "Verified. International publisher standards met.",
        date: "2026-06-07T12:00:00Z",
      },
      {
        step: "Payment released",
        status: "completed",
        actionBy: "u-5",
        actionByName: "Mr. Robert Sterling",
        remarks: "Released incentive. Txn: TXN88716281",
        date: "2026-06-15T15:30:00Z",
      },
    ],
    incentiveAmount: 1200,
    paymentDetails: {
      transactionId: "TXN88716281",
      dateReleased: "2026-06-15T15:30:00Z",
      remarks: "Direct bank transfer to faculty account.",
    },
  },
  {
    id: "claim-105",
    title: "Novel Cryptographic Protocols for Multi-Agent Systems",
    category: "journal",
    status: "returned_hod",
    creatorId: "u-1",
    creatorName: "Dr. Aris Thorne",
    creatorDept: "Computer Science & Engineering",
    creatorRole: "faculty",
    dateSubmitted: "2026-07-15T08:30:00Z",
    fields: {
      researchDomain: "Cybersecurity",
      publicationType: "Journal Paper",
      journalName: "Journal of Systems Cryptography",
      issn: "2190-8532",
      publisher: "Springer",
      scopusIndexed: "Yes",
      sciIndexed: "No",
      scieIndexed: "Yes",
      ugcApproved: "Yes",
      quartile: "Q2",
      publicationDate: "2026-06-01",
      doi: "10.1007/jsc.2026.99",
      volume: "8",
      issue: "2",
      pages: "120-135",
      impactFactor: "3.2",
      coAuthors: ["EMP-109"],
      correspondingAuthor: "EMP-101",
      // Verification Links
      scopusUrl:
        "https://www.scopus.com/record/display.uri?eid=2-s2.0-998817265",
      publisherUrl: "https://link.springer.com/article/10.1007/jsc.2026.99",
      journalUrl: "https://www.springer.com/journal/12345",
      remarks: "Need quick review.",
    },
    approvalHistory: [
      {
        step: "Submitted",
        status: "completed",
        actionBy: "u-1",
        actionByName: "Dr. Aris Thorne",
        remarks: "Submitted.",
        date: "2026-07-15T08:30:00Z",
      },
      {
        step: "HOD Review",
        status: "returned",
        actionBy: "u-3",
        actionByName: "Dr. Marcus Vance",
        remarks:
          "Please fill in the publisher link and the correct Scopus Document URL.",
        date: "2026-07-16T14:00:00Z",
      },
    ],
    incentiveAmount: 0,
    paymentDetails: null,
  },
];

// Initialize DB if not present
export const initDB = () => {
  if (!localStorage.getItem("portal_users")) {
    localStorage.setItem("portal_users", JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem("portal_faculty")) {
    localStorage.setItem("portal_faculty", JSON.stringify(INTERNAL_FACULTY));
  }
  if (!localStorage.getItem("portal_submissions")) {
    // If the database was already created with old formats (containing documents), clear it to seed clean link-based ones
    const existing = localStorage.getItem("portal_submissions");
    if (existing && existing.includes('"documents"')) {
      localStorage.setItem(
        "portal_submissions",
        JSON.stringify(INITIAL_SUBMISSIONS),
      );
    } else if (!existing) {
      localStorage.setItem(
        "portal_submissions",
        JSON.stringify(INITIAL_SUBMISSIONS),
      );
    }
  }
  if (!localStorage.getItem("portal_circulars")) {
    localStorage.setItem("portal_circulars", JSON.stringify(INITIAL_CIRCULARS));
  }
  if (!localStorage.getItem("portal_departments")) {
    localStorage.setItem(
      "portal_departments",
      JSON.stringify(INITIAL_DEPARTMENTS),
    );
  }
};

// Database get utilities
export const getUsers = () =>
  JSON.parse(localStorage.getItem("portal_users") || "[]");
export const getInternalFaculty = () =>
  JSON.parse(localStorage.getItem("portal_faculty") || "[]");
export const getSubmissions = () =>
  JSON.parse(localStorage.getItem("portal_submissions") || "[]");
export const getCirculars = () =>
  JSON.parse(localStorage.getItem("portal_circulars") || "[]");
export const getDepartments = () =>
  JSON.parse(localStorage.getItem("portal_departments") || "[]");

// Database set utilities
export const setUsers = (users) =>
  localStorage.setItem("portal_users", JSON.stringify(users));
export const setSubmissions = (subs) =>
  localStorage.setItem("portal_submissions", JSON.stringify(subs));
export const setCirculars = (circs) =>
  localStorage.setItem("portal_circulars", JSON.stringify(circs));

// Auth Operations
export const loginUser = (email, password) => {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    return { success: true, user };
  }
  return { success: false, error: "Invalid email or password" };
};

// Claim Actions
export const createClaim = (claimData) => {
  const subs = getSubmissions();
  const id = "claim-" + Math.floor(Math.random() * 900000 + 100000);
  const newClaim = {
    id,
    ...claimData,
    dateSubmitted: newClaimStatusDate(claimData.status),
    incentiveAmount: 0,
    paymentDetails: null,
    approvalHistory: [
      {
        step: claimData.status === "draft" ? "Draft Saved" : "Submitted",
        status: "completed",
        actionBy: claimData.creatorId,
        actionByName: claimData.creatorName,
        remarks:
          claimData.status === "draft"
            ? "Draft saved successfully"
            : "Claim submitted for review.",
        date: new Date().toISOString(),
      },
    ],
  };
  subs.unshift(newClaim);
  setSubmissions(subs);
  return newClaim;
};

const newClaimStatusDate = (status) => {
  if (status === "draft") return null;
  return new Date().toISOString();
};

export const updateClaim = (id, updatedFields) => {
  const subs = getSubmissions();
  const index = subs.findIndex((s) => s.id === id);
  if (index === -1) return null;

  const current = subs[index];
  const merged = { ...current, ...updatedFields };

  // If status changed from draft to pending_hod, log a submit action
  if (current.status === "draft" && updatedFields.status === "pending_hod") {
    merged.dateSubmitted = new Date().toISOString();
    merged.approvalHistory.push({
      step: "Submitted",
      status: "completed",
      actionBy: current.creatorId,
      actionByName: current.creatorName,
      remarks: "Claim submitted from draft.",
      date: new Date().toISOString(),
    });
  } else if (
    current.status === "returned_hod" &&
    updatedFields.status === "pending_hod"
  ) {
    merged.approvalHistory.push({
      step: "Resubmitted",
      status: "completed",
      actionBy: current.creatorId,
      actionByName: current.creatorName,
      remarks: "Claim updated and resubmitted.",
      date: new Date().toISOString(),
    });
  }

  subs[index] = merged;
  setSubmissions(subs);
  return merged;
};

// HOD & RPC approvals workflow
export const processReview = (
  claimId,
  action,
  reviewerId,
  reviewerName,
  remarks,
) => {
  const subs = getSubmissions();
  const index = subs.findIndex((s) => s.id === claimId);
  if (index === -1) return { success: false, error: "Claim not found" };

  const claim = subs[index];
  let nextStatus = claim.status;
  let stepName = "";

  if (claim.status === "pending_hod") {
    if (action === "approve") {
      nextStatus = "pending_rpc";
      stepName = "HOD Approval";
    } else if (action === "return") {
      nextStatus = "returned_hod";
      stepName = "Returned by HOD";
    } else if (action === "reject") {
      nextStatus = "rejected";
      stepName = "Rejected by HOD";
    }
  } else if (claim.status === "pending_rpc") {
    if (action === "approve") {
      nextStatus = "pending_accounts";
      stepName = "RPC Verification";
      // Auto-calculate rough draft incentive based on category
      claim.incentiveAmount = calculateIncentiveEstimate(claim);
    } else if (action === "return") {
      nextStatus = "returned_rpc"; // returned to faculty from RPC
      stepName = "Returned by RPC";
    } else if (action === "reject") {
      nextStatus = "rejected";
      stepName = "Rejected by RPC";
    }
  }

  claim.status = nextStatus;
  claim.approvalHistory.push({
    step: stepName,
    status:
      action === "approve"
        ? "approved"
        : action === "return"
          ? "returned"
          : "rejected",
    actionBy: reviewerId,
    actionByName: reviewerName,
    remarks: remarks || "Processed review action.",
    date: new Date().toISOString(),
  });

  subs[index] = claim;
  setSubmissions(subs);
  return { success: true, claim };
};

// Accounts disbursement workflow
export const releaseIncentivePayment = (
  claimId,
  calculatedAmount,
  payeeId,
  payeeName,
  remarks,
) => {
  const subs = getSubmissions();
  const index = subs.findIndex((s) => s.id === claimId);
  if (index === -1) return { success: false, error: "Claim not found" };

  const claim = subs[index];
  claim.status = "released";
  claim.incentiveAmount = Number(calculatedAmount);
  claim.paymentDetails = {
    transactionId: "TXN" + Math.floor(Math.random() * 90000000 + 10000000),
    dateReleased: new Date().toISOString(),
    remarks: remarks || "Incentive successfully processed and released.",
  };

  claim.approvalHistory.push({
    step: "Payment Released",
    status: "completed",
    actionBy: payeeId,
    actionByName: payeeName,
    remarks: `Released incentive of $${calculatedAmount}. Remarks: ${remarks}`,
    date: new Date().toISOString(),
  });

  subs[index] = claim;
  setSubmissions(subs);
  return { success: true, claim };
};

// Simple rule base for automatic incentive estimation
const calculateIncentiveEstimate = (claim) => {
  const cat = claim.category;
  const f = claim.fields || {};

  if (cat === "journal") {
    // Q1 sci journal gets more
    if (f.sciIndexed === "Yes" || f.scieIndexed === "Yes") {
      if (f.quartile === "Q1") return 1500;
      if (f.quartile === "Q2") return 1000;
      return 800;
    }
    return 400; // standard Scopus/UGC
  }
  if (cat === "patent") {
    if (f.status === "Granted") {
      return f.patentType === "International" ? 2500 : 1500;
    }
    return 500; // filed patent
  }
  if (cat === "book") {
    return 1000;
  }
  if (cat === "startup") {
    return 2000;
  }
  return 300; // default claim incentive
};

// Create a new circular (Admin activity)
export const publishCircular = (title, category, authorId, authorName) => {
  const circs = getCirculars();
  const newCirc = {
    id: "c-" + Math.floor(Math.random() * 9000 + 1000),
    title,
    date: new Date().toISOString().split("T")[0],
    category,
    author: authorName,
    fileUrl: "#",
    isNew: true,
  };
  circs.unshift(newCirc);
  setCirculars(circs);
  return newCirc;
};
