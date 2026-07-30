# RPMS End-to-End QA Audit — 08. Workflow Tracing & Routing Audit
**Maharishi Markandeshwar (Deemed to be University)**  
**System**: Research Promotion Management System (RPMS)  

---

## 1. End-to-End Workflow Tracing Matrix

### Workflow Path A: Standard Department Approval (HOD Exists)
```
[Faculty / Student]
      │ Submits Claim (DRAFT ➔ DEPARTMENT_REVIEW)
      ▼
[Department HOD]
      │ Validates Dept & Authors (DEPARTMENT_REVIEW ➔ RPC_VERIFICATION)
      ▼
[RPC / R&D Cell]
      │ Validates Scopus/WoS, Quartile, Calculates Incentive & Author Split (RPC_VERIFICATION ➔ ACCOUNTS_PROCESSING)
      ▼
[Finance & Accounts]
      │ Verifies Sanction & Releases Payment (ACCOUNTS_PROCESSING ➔ COMPLETED)
      ▼
[Completed & Disbursed]
```

- **Validation Result**: 🟢 PASS. Verified with `rahul.sharma@mmdu.ac.in` (Faculty) $\rightarrow$ `amit.verma@mmdu.ac.in` (HOD) $\rightarrow$ `rpc@mmdu.ac.in` (RPC) $\rightarrow$ `accounts@mmdu.ac.in` (Finance).

---

### Workflow Path B: Fallback Department Approval (No HOD Exists)
```
[Faculty / Student]
      │ Submits Claim (Pharmacy Dept - No HOD)
      ▼
[Principal (Auto-Approver)]
      │ System detects No HOD ➔ Principal gets approval buttons automatically!
      │ Principal Approves (DEPARTMENT_REVIEW ➔ RPC_VERIFICATION)
      ▼
[RPC / R&D Cell]
      │ Calculates Incentive (RPC_VERIFICATION ➔ ACCOUNTS_PROCESSING)
      ▼
[Finance & Accounts]
      │ Disburses Payment (ACCOUNTS_PROCESSING ➔ COMPLETED)
      ▼
[Completed & Disbursed]
```

- **Validation Result**: 🟢 PASS. Verified with `anjali.kapoor@mmdu.ac.in` (Pharmacy Faculty) $\rightarrow$ `principal.pharmacy@mmdu.ac.in` (Principal Auto-Approver).

---

### Workflow Path C: Revision & Resubmission Path
```
[Faculty / Student] ──Submits──> [HOD] ──Returns for Correction──> [Faculty / Student]
                                                                        │
                                                                   Edits Draft
                                                                        │
                                                                    Resubmits
                                                                        ▼
                                                                      [HOD]
                                                                        │ Approves
                                                                        ▼
                                                                [RPC / R&D Cell]
```

- **Validation Result**: 🟢 PASS. Remarks mandated when returning claim (`"Remarks are required when returning a claim"`). Faculty edits draft and resubmits to HOD.

---

## 2. Dynamic Workflow Progress Diagram Verification
- **5-Step Visual Tracker**:
  1. `Faculty / Student` (Completed checkmark)
  2. `Dept Approval (HOD / Principal Auto-Fallback)` (Active pulsing indicator)
  3. `RPC / R&D Cell` (Pending grey)
  4. `Finance & Accounts` (Pending grey)
  5. `Payment Released` (Pending grey)
- **Status & Hold Banners**: Displays second publication hold notice (`"Payment held until second eligible publication"`) and automatic fallback routing reasons.
