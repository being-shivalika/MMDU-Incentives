import publicRoutes from "./routes/publicRoutes";
import applicantsRoutes from "./routes/applicantsRoutes";
import accountsRoutes from "./routes/accountsRoutes";
import adminRoutes from "./routes/adminRoutes";
import registrarRoutes from "./routes/registrarRoutes";
import vcRoutes from "./routes/vcRoutes";
import departmentReviewRoutes from "./routes/departmentReviewRoutes";
import researchReviewRoutes from "./routes/researchReviewRoutes";

import { ROLES } from "../../constants/roles";

const routeConfig = {
  publicRoutes,

  protectedRouteGroups: [
    // Applicant (Student + Faculty)
    {
      allowedRoles: [ROLES.STUDENT, ROLES.FACULTY],
      routes: applicantsRoutes,
    },

    // Accounts
    {
      allowedRoles: [ROLES.ACCOUNTS],
      routes: accountsRoutes,
    },

    // HOD
    {
      allowedRoles: [ROLES.HOD],
      routes: departmentReviewRoutes,
    },

    // Research Review (RPC / R&D Cell)
    {
      allowedRoles: [ROLES.RD_CELL, "rpc"],
      routes: researchReviewRoutes,
    },

    // Admin
    {
      allowedRoles: [ROLES.ADMIN],
      routes: adminRoutes,
    },

    // Registrar
    {
      allowedRoles: [ROLES.REGISTRAR],
      routes: registrarRoutes,
    },

    // VC
    {
      allowedRoles: [ROLES.VC],
      routes: vcRoutes,
    },
  ],
};

export default routeConfig;
