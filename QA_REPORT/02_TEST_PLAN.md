# RPMS End-to-End QA Audit — 02. Master Test Plan
**Maharishi Markandeshwar (Deemed to be University)**  
**System**: Research Promotion Management System (RPMS)  

---

## 1. Scope & Test Objectives
The Master Test Plan outlines a multi-tiered validation approach designed to audit every workflow, permission boundary, API endpoint, and financial transaction within RPMS.

### Testing Scope:
1. **Authentication & Session Lifecycle**:
   - Token creation, storage in `localStorage`, authorization header attachment, JWT verification, session recovery on `F5` refresh, and invalid token handling.
2. **Role-Based Access Control (RBAC)** across 11 User Roles:
   - `student`, `faculty`, `hod`, `principal`, `director`, `rd_cell`, `rpc_cell`, `accounts`, `registrar`, `vc`, `admin`.
3. **Automatic Workflow Hierarchy Routing**:
   - Standard Path: `Faculty/Student` $\rightarrow$ `HOD` $\rightarrow$ `RPC / R&D` $\rightarrow$ `Finance` $\rightarrow$ `Completed`.
   - Fallback Path 1 (No HOD): `Faculty/Student` $\rightarrow$ `Principal (Auto-Approver)` $\rightarrow$ `RPC / R&D` $\rightarrow$ `Finance` $\rightarrow$ `Completed`.
   - Fallback Path 2 (No HOD & No Principal): `Faculty/Student` $\rightarrow$ `Director (Auto-Approver)` $\rightarrow$ `RPC / R&D` $\rightarrow$ `Finance` $\rightarrow$ `Completed`.
4. **Policy Engine & Financial Calculation**:
   - Journal Quartiles (Q1, Q2, Q3, Q4, Scopus, WoS) incentive matching.
   - Author equal split calculation ($\text{Author Share} = \text{Total Incentive} / \text{MMDU Authors}$).
   - Second publication rule (1st publication held, 2nd publication releases held funds).
5. **Database Consistency & Audit Trail**:
   - Mongoose collection updates, audit log records, approval history, notifications, and financial ledger vouchers.

---

## 2. Test Environment Matrix

| System Component | Specification | Location / Port |
| :--- | :--- | :--- |
| **Frontend Framework** | React, Vite 8.1.5, React Router DOM, TailwindCSS, Framer Motion (`motion/react`) | `http://localhost:5173` |
| **Backend Service** | Node.js, Express.js, Mongoose, JWT (`jsonwebtoken`) | `http://localhost:5000` |
| **Database Cluster** | MongoDB Atlas Cloud Cluster (`mmdu-policy-test`) | Cloud Managed |

---

## 3. Test Cases Execution Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          RPMS MASTER TEST SUITES                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  [TS-01] Authentication & Session Lifecycle                                 │
│  [TS-02] Role & Permission Scoping (11 Roles)                               │
│  [TS-03] Department Approver Hierarchy & Automatic Fallback                 │
│  [TS-04] End-to-End Submission, Resubmission & Rejection Workflows           │
│  [TS-05] Policy Engine & Financial Author Equal Split                       │
│  [TS-06] Second Publication Hold & Automatic Unholding                      │
│  [TS-07] REST API Response Integrity & Security Sanitization                 │
│  [TS-08] MongoDB Atlas Document Auditing & Ledger Consistency               │
│  [TS-09] Frontend Build & Console Zero-Error Diagnostics                    │
└─────────────────────────────────────────────────────────────────────────────┘
```
