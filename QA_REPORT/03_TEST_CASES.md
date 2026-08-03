# RPMS End-to-End QA Audit — 03. Comprehensive Test Cases Specification
**Maharishi Markandeshwar (Deemed to be University)**  
**System**: Research Promotion Management System (RPMS)  

---

## 1. Master Test Cases Repository

### Suite 01: Authentication & Token Lifecycle
- **TC-AUTH-01**: Login with valid Faculty credentials (`rahul.sharma@mmdu.ac.in` / `Faculty@123`). Verify JWT token generated and stored in `localStorage`.
- **TC-AUTH-02**: Login with invalid password. Verify `401 Unauthorized` returned with message `"Invalid email or password"`.
- **TC-AUTH-03**: Access protected endpoint with expired JWT. Verify `401 Unauthorized` returned, `auth:logout` dispatched, and user redirected to `/login`.
- **TC-AUTH-04**: Refresh page while logged in (`F5`). Verify `getCurrentUser()` restores session context without user logout.
- **TC-AUTH-05**: Click Logout button. Verify `rpms-token` and `rpms-user` removed from `localStorage`.

---

### Suite 02: Role & Permission Scoping
- **TC-PERM-01**: Login as Student/Faculty and view claim details. Verify Approve, Reject, Return buttons are **COMPLETELY HIDDEN**.
- **TC-PERM-02**: Login as HOD for CSE (`amit.verma@mmdu.ac.in`) and view claim for CSE. Verify HOD sees Approve, Request Revision, Reject buttons.
- **TC-PERM-03**: Login as Principal (`principal.cse@mmdu.ac.in`) when HOD exists. Verify Principal sees claim in **View-Only Mode**. Approval buttons are hidden.
- **TC-PERM-04**: Login as Principal for Pharmacy (`principal.pharmacy@mmdu.ac.in`) when NO HOD exists. Verify Principal receives **Automatic Fallback Approval Authority** and sees Approve, Request Revision, Reject buttons.
- **TC-PERM-05**: Login as Director (`director@mmdu.ac.in`) when department has NO HOD and NO Principal. Verify Director receives **Automatic Fallback Approval Authority**.
- **TC-PERM-06**: Login as RPC Cell (`rpc@mmdu.ac.in`) when claim is in `RPC_VERIFICATION`. Verify RPC Cell sees Approve, Return, Reject buttons.
- **TC-PERM-07**: Login as Accounts (`accounts@mmdu.ac.in`) when claim is in `ACCOUNTS_PROCESSING`. Verify Accounts sees `Release Payment` button.

---

### Suite 03: End-to-End Submission & Workflow Tracing
- **TC-WKFL-01**: Faculty creates a claim, fills metadata, attaches authors, and submits. Verify status changes to `DEPARTMENT_REVIEW` (`Pending HOD Review`).
- **TC-WKFL-02**: HOD approves claim. Verify status updates to `RPC_VERIFICATION` (`Pending RPC Review`).
- **TC-WKFL-03**: HOD returns claim for clarification with remarks. Verify status becomes `RETURNED` (`Revision Requested`), applicant receives notification, and can edit & resubmit.
- **TC-WKFL-04**: HOD rejects claim with mandatory reason. Verify status becomes `REJECTED`, applicant notified, and workflow terminates.
- **TC-WKFL-05**: RPC approves claim. Verify status updates to `ACCOUNTS_PROCESSING` (`Pending Accounts Review`).
- **TC-WKFL-06**: Finance releases payment. Verify transaction voucher generated and status updates to `COMPLETED` (`Approved`).

---

### Suite 04: Financial Calculation & Author Equal Split
- **TC-FIN-01**: Submit Q1 Journal paper with 1 MMDU author and ₹25,000 total incentive. Verify Total: ₹25,000, Individual Share: ₹25,000.
- **TC-FIN-02**: Submit Q1 Journal paper with 5 MMDU authors and ₹25,000 total incentive. Verify Total: ₹25,000, MMDU Authors: 5, Individual Share: ₹5,000.
- **TC-FIN-03**: Submit Q2 Journal paper with 3 MMDU authors and 2 External authors. Verify Total: ₹15,000, MMDU Share: ₹5,000 each, External Share: ₹0.
- **TC-FIN-04**: Log in as individual co-author. Verify `userShare` displays only their own payable amount (₹5,000), not the full incentive.

---

### Suite 05: Second Publication Payment Hold Rule
- **TC-HOLD-01**: Approve 1st eligible publication for a faculty member. Verify incentive recorded, `isHeld = true`, `heldReason` set, payment status `HELD`.
- **TC-HOLD-02**: Approve 2nd eligible publication for the same faculty member. Verify `isHeld = false`, payment status `READY_FOR_RELEASE`.
- **TC-HOLD-03**: Automatic Unholding. Verify approving 2nd publication automatically unholds 1st publication funds (`isHeld = false`).
- **TC-HOLD-04**: 3rd and subsequent publications process normally with immediate readiness for payment release.
