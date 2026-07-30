# RPMS End-to-End QA Audit — 05. Failed Tests & Resolution Log
**Maharishi Markandeshwar (Deemed to be University)**  
**System**: Research Promotion Management System (RPMS)  

---

## 1. Initial Test Failures Summary
During initial baseline audit execution prior to refactoring, 5 major functional and architectural defects were identified. All 5 defects have been completely resolved, re-tested, and verified to pass with 100% success rate.

---

## 2. Failed Test Log & Verification Audit

### Test Case: `TC-DASH-01` — Submissions disappearing on page refresh
- **Initial Status**: 🔴 FAILED
- **Failure Description**: Navigating to `/applicant/submissions` and pressing `F5` / Refresh reset the submissions list to an empty array `[]`.
- **Root Cause**: `ApplicantsDashboard.jsx` attempted to parse `res.claims`, but backend returned `{ success: true, message: '...', data: [...] }`.
- **Fix Applied**: Updated `ApplicantsDashboard.jsx` and `ApplicantSubmissions.jsx` to parse `response.data || response.claims || []`.
- **Retest Status**: 🟢 PASSED. Refreshing the browser reloads all claims reliably.

---

### Test Case: `TC-RD-01` — RD Dashboard opening details returned "Token Expired"
- **Initial Status**: 🔴 FAILED
- **Failure Description**: Clicking a submission row in the RD Dashboard failed to open the details view and rendered `"Token Expired"`.
- **Root Cause**: Missing route entry `ROUTES.RESEARCH_REVIEW_DETAILS` (`/research-review/submission/:id`) in `researchReviewRoutes.jsx`.
- **Fix Applied**: Registered route in `researchReviewRoutes.jsx` mapped to `<SubmissionReviewDetails />` and integrated direct `getSubmissionById(id)`.
- **Retest Status**: 🟢 PASSED. Review submission details page opens cleanly.

---

### Test Case: `TC-PERM-03` — Principal saw action buttons when HOD exists
- **Initial Status**: 🔴 FAILED
- **Failure Description**: Logged in as Principal (`principal.cse@mmdu.ac.in`) for a department with an active HOD (`amit.verma@mmdu.ac.in`), the drawer displayed `Approve`, `Request Revision`, and `Reject` buttons.
- **Root Cause**: Action buttons rendered based solely on `user.role` without checking effective approver hierarchy for the specific department.
- **Fix Applied**: Implemented `hierarchyService.js` to compute `permissions.canApprove`. Updated drawers to hide buttons completely for view-only roles.
- **Retest Status**: 🟢 PASSED. Principal sees claim in View-Only Mode; action buttons are hidden.

---

### Test Case: `TC-FIN-02` — Multi-author incentive equal split missing
- **Initial Status**: 🔴 FAILED
- **Failure Description**: Submitting a paper with 5 MMDU authors stored flat total incentive without splitting per author.
- **Root Cause**: Missing author division fields in `Claim.js` schema and `policyEngine.js`.
- **Fix Applied**: Added `totalIncentive`, `individualShare`, `mmduAuthorCount`, and `authorPayments` array. Implemented equal split formula in `policyEngine.js`.
- **Retest Status**: 🟢 PASSED. Total incentive ₹25,000 divided by 5 MMDU authors equals ₹5,000 per author.

---

### Test Case: `TC-HOLD-01` — 1st publication payment went directly to release without hold
- **Initial Status**: 🔴 FAILED
- **Failure Description**: Faculty's 1st eligible publication was marked ready for disbursement without enforcing the 2nd publication payment hold rule.
- **Root Cause**: Absence of database-backed publication count tracking.
- **Fix Applied**: Added `isHeld` and `heldReason` fields to `Claim.js`. Enforced payment hold on 1st publication and automatic unholding of prior claims upon approving 2nd eligible publication in `approvalService.js`.
- **Retest Status**: 🟢 PASSED. 1st publication held; approving 2nd publication releases both 1st and 2nd publication payments.

---

## 3. Current Outstanding Failures
- **Total Outstanding Failures**: **0**
- **System Readiness**: **100% PASS**
