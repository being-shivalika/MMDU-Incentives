# RPMS End-to-End QA Audit — 07. Role Permission & Access Audit
**Maharishi Markandeshwar (Deemed to be University)**  
**System**: Research Promotion Management System (RPMS)  

---

## 1. Permission Evaluation Engine Summary
All authorization decisions in RPMS are evaluated dynamically on the server (`hierarchyService.js`) based on:
1. **Current Workflow Stage** (`claim.status`)
2. **Department Approver Availability** (`getEffectiveApprover(department)`)
3. **User Role & Identity** (`user.role`, `user._id`)

---

## 2. Comprehensive Permission Matrix Across 11 Roles

| User Role | Create Claim | Edit Draft | Submit / Resubmit | View Own Claims | Dept Approval (HOD Exists) | Dept Approval (NO HOD) | RPC Verification | Finance Payment Release | Admin System Config |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Student** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Faculty** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **HOD** | 👁 View | ❌ | ❌ | ✅ | ✅ (Effective) | ❌ | ❌ | ❌ | ❌ |
| **Principal (Dept HAS HOD)** | 👁 View | ❌ | ❌ | ✅ | 👁 View Only | 👁 View Only | ❌ | ❌ | ❌ |
| **Principal (Dept HAS NO HOD)** | 👁 View | ❌ | ❌ | ✅ | ❌ | ✅ (Auto-Fallback) | ❌ | ❌ | ❌ |
| **Director (Dept HAS HOD / Principal)** | 👁 View | ❌ | ❌ | ✅ | 👁 View Only | 👁 View Only | ❌ | ❌ | ❌ |
| **Director (Dept NO HOD & NO Principal)** | 👁 View | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ (Auto-Fallback) | ❌ | ❌ |
| **R&D Cell / RPC Cell** | 👁 View | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ (Effective) | ❌ | ❌ |
| **Accounts / Finance** | 👁 View | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ (Effective) | ❌ |
| **Registrar** | 👁 View | ❌ | ❌ | ✅ | 👁 View Only | 👁 View Only | 👁 View Only | 👁 View Only | ❌ |
| **Vice Chancellor (VC)** | 👁 View | ❌ | ❌ | ✅ | 👁 View Only | 👁 View Only | 👁 View Only | 👁 View Only | ❌ |
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 3. Action Button Visibility Enforcement Rules

1. **Faculty / Student**:
   - Can create, edit drafts, submit, and resubmit returned claims.
   - **Approve, Reject, and Return buttons are COMPLETELY HIDDEN**.

2. **Department Approval Stage (`DEPARTMENT_REVIEW`)**:
   - **If HOD Exists**: HOD gets `Approve`, `Reject`, `Return` buttons. Principal and Director are View-Only (buttons hidden).
   - **If NO HOD Exists**: Principal automatically becomes effective approver and gets `Approve`, `Reject`, `Return` buttons.
   - **If NO HOD and NO Principal Exist**: Director automatically becomes effective approver and gets `Approve`, `Reject`, `Return` buttons.

3. **RPC Verification Stage (`RPC_VERIFICATION`)**:
   - Only `rd_cell`, `rpc_cell`, or `admin` get `Approve`, `Reject`, `Return` buttons. All other roles see View-Only mode.

4. **Accounts Processing Stage (`ACCOUNTS_PROCESSING`)**:
   - Only `accounts` or `admin` get `Release Payment` button. All other roles see View-Only mode.

5. **View-Only Mode Behavior**:
   - Unauthorized roles see a clean status banner:
     > `View Only Mode — Effective Approver: HOD (or Assigned Desk)`
   - No disabled buttons are rendered. Buttons are completely hidden.
