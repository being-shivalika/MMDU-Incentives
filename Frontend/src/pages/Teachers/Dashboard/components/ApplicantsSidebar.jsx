import Sidebar from "../../../../components/Navigation/Sidebar";

import {
  LayoutDashboard,
  PlusCircle,
  FileSpreadsheet,
  FileClock,
  FolderSearch,
  BookOpen,
} from "lucide-react";

import { ROUTES } from "../../../../constants/routes";

const ApplicantsSidebar = ({ role = "faculty", children, ...props }) => {
  const isStudent = role === "student";

  const getSubmissionPath = (category) => {
    const route = ROUTES?.APPLICANT_CREATE_SUBMISSION || "/applicant/submissions/create/:category";
    return route.replace(":category", category);
  };

  const navItems = [
    {
      path: ROUTES?.APPLICANT_DASHBOARD || "/applicant",
      label: "Dashboard",
      icon: LayoutDashboard,
      end: true,
    },

    {
      label: "Submissions",
      icon: PlusCircle,
      isDropdown: true,

      subItems: [
        {
          path: getSubmissionPath("publication"),
          label: "Journal Publication",
        },
        {
          path: getSubmissionPath("book"),
          label: "Book & Chapters",
        },
        {
          path: getSubmissionPath("patent"),
          label: "Patent",
        },
        {
          path: getSubmissionPath("copyright"),
          label: "Copyright",
        },
        {
          path: getSubmissionPath("startup"),
          label: "Startup",
        },
      ],
    },

    {
      path: ROUTES?.APPLICANT_SUBMISSIONS || "/applicant/submissions",
      label: "My Submissions",
      icon: FileSpreadsheet,
      isActive: (location) => {
        const p = location.pathname;
        const base = ROUTES?.APPLICANT_SUBMISSIONS || "/applicant/submissions";
        return p === base || (p.startsWith(base) && !p.includes("/create"));
      },
    },

    {
      path: ROUTES?.APPLICANT_DRAFTS || "/applicant/submissions/drafts",
      label: "Drafts",
      icon: FileClock,
    },

    {
      path: "/directory/research",
      label: "Research Directory",
      icon: FolderSearch,
    },

    {
      path: "/policies",
      label: "Research Policies",
      icon: BookOpen,
    },
  ];

  return (
    <Sidebar
      {...props}
      title={isStudent ? "Student" : "Faculty"}
      navItems={navItems}
    >
      {children}
    </Sidebar>
  );
};

export default ApplicantsSidebar;
