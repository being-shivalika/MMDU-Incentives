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
      path: "/teacher",
      label: "Dashboard",
      icon: LayoutDashboard,
    },

    {
      label: "Submit Research",
      icon: PlusCircle,
      isDropdown: true,

      subItems: [
        {
          path: "/teacher/submission/publication",
          label: "Publication",
        },

        {
          path: "/teacher/submission/patent",
          label: "Patent",
        },

        {
          path: "/teacher/submission/book",
          label: "Book & Chapters",
        },

        {
          path: "/teacher/submission/project",
          label: "Projects",
        },

        {
          path: "/teacher/submission/consultancy",
          label: "Consultancy",
        },

        {
          path: "/teacher/submission/award",
          label: "Awards",
        },
      ],
    },

    {
      path: "/teacher/submissions",
      label: "My Submissions",
      icon: FileSpreadsheet,
    },

    {
      path: "/teacher/drafts",
      label: "Drafts",
      icon: FileClock,
    },

    {
      path: "/directory/research",
      label: "Research Directory",
      icon: FolderSearch,
    },

    {
      path: "/directory/faculty",
      label: "Faculty Directory",
      icon: Users,
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
      path: "/student",
      label: "Dashboard",
      icon: LayoutDashboard,
    },

    {
      label: "Submit Research",
      icon: PlusCircle,
      isDropdown: true,

      subItems: [
        {
          path: "/student/submission/publication",
          label: "Publication",
        },

        {
          path: "/student/submission/patent",
          label: "Patent",
        },

        {
          path: "/student/submission/project",
          label: "Projects",
        },
      ],
    },

    {
      path: "/student/submissions",
      label: "My Submissions",
      icon: FileSpreadsheet,
    },

    {
      path: "/student/drafts",
      label: "Drafts",
      icon: FileClock,
    },

    {
      path: "/directory/research",
      label: "Research Directory",
      icon: FolderSearch,
    },

    {
      path: "/directory/faculty",
      label: "Faculty Directory",
      icon: Users,
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

    {
      path: "/hod/history",
      label: "Approval History",
      icon: History,
    },

    {
      path: "/directory/faculty",
      label: "Faculty Directory",
      icon: Users,
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

    {
      path: "/directory/research",
      label: "Research Directory",
      icon: FolderSearch,
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

    {
      path: "/director/reports",
      label: "Reports",
      icon: Building2,
    },

    {
      path: "/directory/research",
      label: "Research Directory",
      icon: FolderSearch,
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
      end: true,
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

    {
      path: "/directory/research",
      label: "Research Directory",
      icon: FolderSearch,
    },

    {
      path: "/rpc/analytics",
      label: "Analytics",
      icon: LayoutDashboard,
    },

    {
      path: "/rpc/reports",
      label: "Reports",
      icon: FileSpreadsheet,
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
