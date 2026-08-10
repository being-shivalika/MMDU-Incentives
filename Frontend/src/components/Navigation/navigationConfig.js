import {
  LayoutDashboard,
  PlusCircle,
  FileSpreadsheet,
  FileClock,
  FolderSearch,
  Users,
  BookOpen,
  History,
  CreditCard,
  Megaphone,
  Shield,
  CheckCircle,
  Building2,
  Briefcase,
} from "lucide-react";

/*
=====================================
ROLE → NAVIGATION MAPPING
Backend roles:
faculty, student, hod, principal,
director, rd_cell, accounts,
registrar, vc, admin

Navigation keys:
teacher, student, hod...
=====================================
*/

export const ROLE_TO_NAV_KEY = {
  faculty: "teacher",
  student: "student",
  hod: "hod",
  principal: "principal",
  director: "director",
  rd_cell: "rpc",
  rpc: "rpc",
  rpc_cell: "rpc",
  accounts: "accounts",
  registrar: "registrar",
  vc: "vc",
  admin: "admin",
};

export const ROLE_TITLES = {
  faculty: "Faculty Dashboard",
  student: "Student Dashboard",
  hod: "HOD Dashboard",
  principal: "Principal Dashboard",
  director: "Director Dashboard",
  rd_cell: "Research Development Cell",
  rpc: "Research Review Cell",
  accounts: "Accounts Dashboard",
  registrar: "Registrar Dashboard",
  vc: "Vice Chancellor Dashboard",
  admin: "Administrator Dashboard",
};

export const navigationConfig = {
  /*
  =========================
  FACULTY / TEACHER
  =========================
  */

  teacher: [
    {
      path: "/applicant",
      label: "Dashboard",
      icon: LayoutDashboard,
    },

    {
      label: "Submit Research",
      icon: PlusCircle,
      isDropdown: true,

      subItems: [
        {
          path: "/applicant/submissions/create/publication",
          label: "Publication",
        },

        {
          path: "/applicant/submissions/create/conference",
          label: "Conference / Seminar",
        },

        {
          path: "/applicant/submissions/create/patent",
          label: "Patent",
        },

        {
          path: "/applicant/submissions/create/book",
          label: "Book & Chapters",
        },

        {
          path: "/applicant/submissions/create/copyright",
          label: "Copyright & Claims",
        },
      ],
    },

    {
      path: "/applicant/submissions",
      label: "My Submissions",
      icon: FileSpreadsheet,
    },

    {
      path: "/applicant/drafts",
      label: "Drafts",
      icon: FileClock,
    },

    {
      path: "/policies",
      label: "Research Policies",
      icon: BookOpen,
    },
  ],

  /*
  =========================
  STUDENT
  =========================
  */

  student: [
    {
      path: "/applicant",
      label: "Dashboard",
      icon: LayoutDashboard,
    },

    {
      label: "Submit Research",
      icon: PlusCircle,
      isDropdown: true,

      subItems: [
        {
          path: "/applicant/submissions/create/publication",
          label: "Publication",
        },

        {
          path: "/applicant/submissions/create/conference",
          label: "Conference / Seminar",
        },

        {
          path: "/applicant/submissions/create/patent",
          label: "Patent",
        },
      ],
    },

    {
      path: "/applicant/submissions",
      label: "My Submissions",
      icon: FileSpreadsheet,
    },

    {
      path: "/applicant/drafts",
      label: "Drafts",
      icon: FileClock,
    },
  ],

  /*
  =========================
  HOD
  =========================
  */

  hod: [
    {
      path: "/hod",
      label: "Dashboard",
      icon: LayoutDashboard,
    },

    {
      path: "/hod/reviews",
      label: "Department Queue",
      icon: FileClock,
    },
  ],

  /*
  =========================
  PRINCIPAL
  =========================
  */

  principal: [
    {
      path: "/principal",
      label: "Dashboard",
      icon: LayoutDashboard,
    },

    {
      path: "/principal/approvals",
      label: "Final Approvals",
      icon: CheckCircle,
    },

    {
      path: "/principal/history",
      label: "Approval History",
      icon: History,
    },
  ],

  /*
  =========================
  DIRECTOR
  =========================
  */

  director: [
    {
      path: "/director",
      label: "Dashboard",
      icon: LayoutDashboard,
    },

    {
      path: "/director/approvals",
      label: "Director Approvals",
      icon: CheckCircle,
    },
  ],

  /*
  =========================
  RPC
  =========================
  */

  rpc: [
    {
      path: "/research-review",
      label: "Dashboard",
      icon: LayoutDashboard,
    },

    {
      path: "/research-review/queue",
      label: "Verification Queue",
      icon: FileClock,
    },

    {
      path: "/research-review/history",
      label: "Review History",
      icon: History,
    },
  ],

  /*
  =========================
  ACCOUNTS
  =========================
  */

  accounts: [
    {
      path: "/accounts",
      label: "Dashboard",
      icon: LayoutDashboard,
    },

    {
      path: "/accounts/payments",
      label: "Payment Queue",
      icon: CreditCard,
    },

    {
      path: "/accounts/history",
      label: "Released Incentives",
      icon: History,
    },
  ],

  /*
  =========================
  ADMIN
  =========================
  */

  admin: [
    {
      path: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
    },

    {
      path: "/admin/users",
      label: "User Management",
      icon: Users,
    },

    {
      path: "/admin/circulars",
      label: "Circulars",
      icon: Megaphone,
    },

    {
      path: "/admin/audit",
      label: "Audit Logs",
      icon: Shield,
    },

    {
      path: "/admin/settings",
      label: "Portal Settings",
      icon: Briefcase,
    },
  ],

  registrar: [
    {
      path: "/registrar",
      label: "Dashboard",
      icon: LayoutDashboard,
    },

    {
      path: "/registrar/records",
      label: "Academic Records",
      icon: FileSpreadsheet,
    },

    {
      path: "/registrar/verifications",
      label: "Verifications",
      icon: CheckCircle,
    },
  ],

  vc: [
    {
      path: "/vc",
      label: "Dashboard",
      icon: LayoutDashboard,
    },

    {
      path: "/vc/approvals",
      label: "Final Approvals",
      icon: CheckCircle,
    },

    {
      path: "/vc/reports",
      label: "Institutional Reports",
      icon: Building2,
    },
  ],
};
