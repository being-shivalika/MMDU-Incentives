# RPMS Master Bug Tracker & Resolution Ledger
**Maharishi Markandeshwar (Deemed to be University)**  
**System**: Research Promotion Management System (RPMS)  

---

## 1. Master Bug Resolution Table

| Bug ID | Severity | Module | Steps to Reproduce | Expected Result | Actual Result | Root Cause | Files Affected | Fix Implemented | Verification Status |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **BUG-01** | **Critical** | Frontend / API | 1. Submit claim<br>2. Go to `/applicant/submissions`<br>3. Press `F5` / Refresh | Submissions reload from MongoDB Atlas | Claims list reset to `[]` | Frontend parser read `res.claims` instead of `res.data` | `ApplicantsDashboard.jsx`<br>`ApplicantSubmissions.jsx` | Updated parser to `response.data \|\| response.claims \|\| []` | 🟢 VERIFIED |
| **BUG-02** | **High** | Frontend / Routing | 1. Log in as RPC Cell<br>2. Open `/research-review`<br>3. Click submission row | Details page opens `/research-review/submission/:id` | Displays error `"Token Expired"` | Route missing from `researchReviewRoutes.jsx` | `researchReviewRoutes.jsx`<br>`SubmissionReviewDetails.jsx` | Registered route and used direct `getSubmissionById(id)` | 🟢 VERIFIED |
| **BUG-03** | **High** | Permissions | 1. Dept has HOD<br>2. Log in as Principal<br>3. View claim | Principal sees claim in View-Only mode | Approve/Reject buttons appeared | Buttons rendered based on user role, not effective approver | `hierarchyService.js`<br>`ReviewDrawer.jsx`<br>`SubmissionReviewDetails.jsx` | Created `hierarchyService.js` & hid buttons for View-Only roles | 🟢 VERIFIED |
| **BUG-04** | **High** | Policy / Financial | 1. Submit paper with 5 MMDU authors<br>2. Check incentive | Total incentive divided equally among MMDU authors | Flat total incentive stored without split | Schema lacked author split fields and division formula | `Claim.js`<br>`policyEngine.js`<br>`submissionController.js` | Added `totalIncentive`, `individualShare`, `authorPayments` & equal split | 🟢 VERIFIED |
| **BUG-05** | **High** | Workflow / Financial | 1. Submit 1st eligible pub<br>2. Approve claim | Payment held until 2nd eligible publication | Payment went to release without hold tracking | Missing database-backed 2nd pub tracking | `Claim.js`<br>`approvalService.js` | Added `isHeld` flag, hold rationale, and automatic 2nd pub unholding | 🟢 VERIFIED |

---

## 2. Bug Fix Summary
All 5 identified defects have been resolved, re-tested, and verified to achieve 100% test suite execution success. Zero open defects remain.
