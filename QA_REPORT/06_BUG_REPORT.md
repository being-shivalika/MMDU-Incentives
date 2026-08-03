# RPMS End-to-End QA Audit — 06. Master Bug Report
**Maharishi Markandeshwar (Deemed to be University)**  
**System**: Research Promotion Management System (RPMS)  

---

## 1. Summary of Bug Resolutions

| Bug ID | Title | Module | Severity | Priority | Status |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **BUG-01** | Submissions disappear from "My Submissions" after refresh | Frontend / API | Critical | High | 🟢 RESOLVED |
| **BUG-02** | RD Dashboard details link returns "Token Expired" error | Frontend / Routing | High | High | 🟢 RESOLVED |
| **BUG-03** | Approval buttons visible to View-Only roles (Principal/Director) | Permissions | High | High | 🟢 RESOLVED |
| **BUG-04** | Missing MM(DU) author equal split calculation | Policy / Financial | High | High | 🟢 RESOLVED |
| **BUG-05** | Missing database-backed 2nd publication payment hold rule | Workflow / Financial | High | High | 🟢 RESOLVED |

---

## 2. Detailed Bug Reports

### BUG-01: Submissions disappear from "My Submissions" after page refresh
- **Bug ID**: BUG-01
- **Severity**: Critical | **Priority**: High
- **Steps to Reproduce**:
  1. Log in as Faculty (`rahul.sharma@mmdu.ac.in`).
  2. Submit a new research claim.
  3. Navigate to `/applicant/submissions`. Claim displays correctly.
  4. Press `F5` / Refresh the browser page.
- **Expected Result**: Submissions persist and reload from MongoDB Atlas via `GET /api/submissions`.
- **Actual Result**: `submissions` state reset to `[]` because `ApplicantsDashboard.jsx` read `res.claims` instead of `res.data`.
- **Root Cause**: Backend returns `{ success: true, message: '...', data: [...] }`. Code accessed `res.claims` which evaluated to `undefined`.
- **Fix Applied**: Updated `ApplicantsDashboard.jsx` and `ApplicantSubmissions.jsx` to parse `response.data || response.claims || []`.
- **Verification Status**: Verified. Refreshing browser reliably reloads all submitted/draft claims.

---

### BUG-02: RD Dashboard "Review Submission Details" fails with "Token Expired"
- **Bug ID**: BUG-02
- **Severity**: High | **Priority**: High
- **Steps to Reproduce**:
  1. Log in as RPC / R&D Cell (`rpc@mmdu.ac.in`).
  2. Open Research Review Dashboard (`/research-review`).
  3. Click any submission row to view details.
- **Expected Result**: Navigates to `/research-review/submission/:id` and loads claim details.
- **Actual Result**: Route match failed because `RESEARCH_REVIEW_DETAILS` route was missing from `researchReviewRoutes.jsx`, displaying an unhandled fallback error `"Token Expired"`.
- **Root Cause**: Missing route entry in `researchReviewRoutes.jsx` and indirect array filtering in `SubmissionReviewDetails.jsx`.
- **Fix Applied**: Registered `ROUTES.RESEARCH_REVIEW_DETAILS` in `researchReviewRoutes.jsx` and updated `SubmissionReviewDetails.jsx` to call `getSubmissionById(id)` directly.
- **Verification Status**: Verified. Review Submission Details page opens cleanly for all active claims.

---

### BUG-03: Approval buttons visible to View-Only roles when HOD exists
- **Bug ID**: BUG-03
- **Severity**: High | **Priority**: High
- **Steps to Reproduce**:
  1. Department has a HOD (`amit.verma@mmdu.ac.in`).
  2. Log in as Principal (`principal.cse@mmdu.ac.in`) and view claim.
- **Expected Result**: Principal sees claim in View-Only mode. Approval/rejection buttons are completely hidden.
- **Actual Result**: Principal saw `Approve` and `Reject` buttons.
- **Root Cause**: Frontend drawers rendered buttons based solely on user role (`user.role === 'principal'`) without checking department approver hierarchy.
- **Fix Applied**: Implemented `hierarchyService.js` to compute `permissions.canApprove`. Updated drawers to hide action buttons completely if `canApprove` is false.
- **Verification Status**: Verified. Action buttons are hidden for view-only roles.

---

### BUG-04: Missing MM(DU) author equal split calculation
- **Bug ID**: BUG-04
- **Severity**: High | **Priority**: High
- **Steps to Reproduce**:
  1. Submit a publication with 5 MM(DU) authors and ₹25,000 total incentive.
- **Expected Result**: Total Incentive: ₹25,000. MMDU Authors: 5. Individual Share: ₹5,000.
- **Actual Result**: Incentive stored as flat ₹25,000 without author split schema.
- **Root Cause**: Missing author division logic and schema fields in `Claim.js` and `policyEngine.js`.
- **Fix Applied**: Added `totalIncentive`, `individualShare`, `mmduAuthorCount`, and `authorPayments` array. Implemented equal split formula in `policyEngine.js`.
- **Verification Status**: Verified. Individual shares calculate accurately and display per-author amounts.

---

### BUG-05: Missing database-backed 2nd publication payment hold rule
- **Bug ID**: BUG-05
- **Severity**: High | **Priority**: High
- **Steps to Reproduce**:
  1. Faculty submits 1st eligible publication.
  2. Approve claim through workflow.
- **Expected Result**: 1st publication incentive recorded, but payment status set to `HELD` (`isHeld = true`). Approving 2nd publication releases both 1st and 2nd publication funds.
- **Actual Result**: 1st publication went directly to payment without hold tracking.
- **Root Cause**: Absence of database-backed publication count tracking.
- **Fix Applied**: Added `isHeld` and `heldReason` fields to `Claim.js`. Enforced hold on 1st publication and automatic unholding of prior claims upon approving 2nd eligible publication in `approvalService.js`.
- **Verification Status**: Verified. Payment hold and release rules execute automatically via database transactions.
