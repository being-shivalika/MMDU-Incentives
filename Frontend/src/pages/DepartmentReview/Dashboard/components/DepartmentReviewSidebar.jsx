import Sidebar from "../../../../components/Navigation/Sidebar";

import {
  LayoutDashboard,
  FileClock,
  History,
  FolderSearch,
} from "lucide-react";

import { ROUTES } from "../../../../constants/routes";

const DepartmentReviewSidebar = ({ role = "hod", children, ...props }) => {
  const isPrincipal = role === "principal";

  const navItems = [
    {
      path: ROUTES?.DEPARTMENT_REVIEW || "/department-review",
      label: "Dashboard",
      icon: LayoutDashboard,
      end: true,
    },
    {
      path: ROUTES?.DEPARTMENT_REVIEW_QUEUE || "/department-review/queue",
      label: "Department Queue",
      icon: FileClock,
    },
    {
      path: "/department-review/history",
      label: "Review History",
      icon: History,
    },
    {
      path: "/directory/research",
      label: "Research Directory",
      icon: FolderSearch,
    },
  ];

  return (
    <Sidebar
      {...props}
      title={isPrincipal ? "Principal Overview" : "Hod Overview"}
      navItems={navItems}
    >
      {children}
    </Sidebar>
  );
};

export default DepartmentReviewSidebar;
