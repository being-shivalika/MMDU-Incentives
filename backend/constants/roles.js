export const ROLES = {
  STUDENT: 'student',
  FACULTY: 'faculty',
  HOD: 'hod',
  PRINCIPAL: 'principal',
  DIRECTOR: 'director',
  RD_CELL: 'rd_cell',
  RPC_CELL: 'rpc_cell',
  ACCOUNTS: 'accounts',
  REGISTRAR: 'registrar',
  VC: 'vc',
  ADMIN: 'admin'
};

export const APPLICANT_ROLES = [ROLES.STUDENT, ROLES.FACULTY];
export const REVIEWER_ROLES = [ROLES.HOD, ROLES.PRINCIPAL, ROLES.DIRECTOR, ROLES.RD_CELL, ROLES.RPC_CELL];
export const ADMIN_ROLES = [ROLES.ADMIN];
export const ALL_ROLES = Object.values(ROLES);
