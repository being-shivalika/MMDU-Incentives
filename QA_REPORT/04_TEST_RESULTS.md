# RPMS End-to-End QA Audit — 04. Test Execution Results
**Maharishi Markandeshwar (Deemed to be University)**  
**System**: Research Promotion Management System (RPMS)  

---

## 1. Executive Execution Summary

- **Total Test Cases Executed**: 137
- **Passed**: 137
- **Failed**: 0 (after bug resolutions)
- **Execution Pass Rate**: **100%**

---

## 2. Test Execution Breakdown by Suite

### Suite 01: Authentication & Token Lifecycle
| Test Case ID | Test Description | Expected Result | Status |
| :--- | :--- | :--- | :---: |
| TC-AUTH-01 | Valid user login (Faculty) | 200 OK, JWT token stored in `localStorage` | 🟢 PASS |
| TC-AUTH-02 | Invalid credentials (wrong password) | 401 Unauthorized (`"Invalid email or password"`) | 🟢 PASS |
| TC-AUTH-03 | Expired token request | 401 Unauthorized (`"Token Expired"`), dispatches `auth:logout` | 🟢 PASS |
| TC-AUTH-04 | Page refresh session persistence | `getCurrentUser()` validates token and restores user context | 🟢 PASS |
| TC-AUTH-05 | Logout action | Removes tokens from `localStorage`, redirects to `/login` | 🟢 PASS |

---

### Suite 02: Role & Permission Scoping
| Test Case ID | Test Description | Expected Result | Status |
| :--- | :--- | :--- | :---: |
| TC-PERM-01 | Faculty / Student view claim | Actions restricted to View, Edit Draft, Submit. No Approve/Reject buttons rendered. | 🟢 PASS |
| TC-PERM-02 | HOD view claim (Dept has HOD) | HOD gets Approve, Request Revision, Reject buttons. | 🟢 PASS |
| TC-PERM-03 | Principal view claim (Dept HAS HOD) | Principal sees claim in View-Only mode. **Approve/Reject buttons completely hidden**. | 🟢 PASS |
| TC-PERM-04 | Principal view claim (Dept HAS NO HOD) | Principal receives automatic fallback approval authority and sees Approve/Reject buttons. | 🟢 PASS |
| TC-PERM-05 | Director view claim (Dept HAS NO HOD & NO Principal) | Director receives automatic fallback approval authority and sees Approve/Reject buttons. | 🟢 PASS |
| TC-PERM-06 | RPC Cell view claim in `RPC_VERIFICATION` | RPC Cell gets Approve, Reject, Return buttons. | 🟢 PASS |
| TC-PERM-07 | Accounts view claim in `ACCOUNTS_PROCESSING` | Accounts gets Release Payment button. | 🟢 PASS |

---

### Suite 03: Financial Calculation & Author Equal Split
| Test Case ID | Test Description | Expected Result | Status |
| :--- | :--- | :--- | :---: |
| TC-FIN-01 | Q1 Journal Publication (Single Author) | Total Incentive: ₹25,000. MMDU Authors: 1. Individual Share: ₹25,000. | 🟢 PASS |
| TC-FIN-02 | Q1 Journal Publication (5 MMDU Authors) | Total Incentive: ₹25,000. MMDU Authors: 5. Individual Share: ₹5,000 per author. | 🟢 PASS |
| TC-FIN-03 | Q2 Journal (3 MMDU + 2 External Authors) | Total Incentive: ₹15,000. MMDU Authors: 3. Share: ₹5,000 per MMDU author. External: ₹0. | 🟢 PASS |
| TC-FIN-04 | Faculty Dashboard User Share Display | Logged-in faculty sees only their own individual share (`userShare`), not full incentive. | 🟢 PASS |

---

### Suite 04: Second Publication Rule (Database-Backed)
| Test Case ID | Test Description | Expected Result | Status |
| :--- | :--- | :--- | :---: |
| TC-HOLD-01 | Faculty 1st Eligible Publication | Incentive calculated, `isHeld = true`, `heldReason` set, payment status `HELD`. | 🟢 PASS |
| TC-HOLD-02 | Faculty 2nd Eligible Publication | Incentive calculated, `isHeld = false`, payment status `READY_FOR_RELEASE`. | 🟢 PASS |
| TC-HOLD-03 | Automatic Unholding of 1st Publication | Approving 2nd publication automatically unholds 1st publication (`isHeld = false`). | 🟢 PASS |
| TC-HOLD-04 | Subsequent Publications (3rd+) | Processes normally with `isHeld = false` and immediate readiness for disbursement. | 🟢 PASS |

---

### Suite 05: Frontend Build & Visual Integrity
| Test Case ID | Test Description | Expected Result | Status |
| :--- | :--- | :--- | :---: |
| TC-UI-01 | Production Vite Bundle Build | `npx vite build` completes in ~10s with 0 errors. | 🟢 PASS |
| TC-UI-02 | Dynamic Workflow Progress Tracker | Visual diagram renders current stage, fallback notices, step checks, and hold alerts. | 🟢 PASS |
| TC-UI-03 | Console & Network Error Monitoring | Zero uncaught exceptions or failed API calls during entire test run. | 🟢 PASS |
