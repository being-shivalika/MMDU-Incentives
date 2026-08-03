# RPMS End-to-End QA Audit — 09. Financial & Payment Ledger Validation
**Maharishi Markandeshwar (Deemed to be University)**  
**System**: Research Promotion Management System (RPMS)  

---

## 1. Incentive Calculation & Policy Mapping Rules

Incentive amounts are calculated strictly according to publication category and journal quartile as defined in the official Research Promotion Policy 2026.

| Category / Subtype | Quartile / Condition | Base Policy Amount (₹) | Score Points |
| :--- | :--- | :---: | :---: |
| **Journal Publication** | Q1 (SCI / SCIE) | ₹25,000 | 25 |
| **Journal Publication** | Q2 (SCI / SCIE) | ₹15,000 | 15 |
| **Journal Publication** | Q3 / Q4 (SCI / SCIE) | ₹10,000 | 10 |
| **Journal Publication** | Scopus Only | ₹8,000 | 8 |
| **Book (Authored)** | International Publisher | ₹20,000 | 20 |
| **Patent Granted** | Indian Patent Office (IPO) | ₹25,000 | 25 |

---

## 2. MM(DU) Author Equal Split Formula Verification

- **Formula**:
  $$\text{Author Share} = \frac{\text{Total Incentive}}{\text{Number of MM(DU) Authors}}$$

- **Validation Test Scenarios**:

| Scenario ID | Total Incentive (₹) | Total Authors | MMDU Authors | Individual MMDU Share (₹) | External Author Share (₹) | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **TS-SPLIT-01** | ₹25,000 | 1 | 1 | ₹25,000 | N/A | 🟢 PASS |
| **TS-SPLIT-02** | ₹25,000 | 5 | 5 | ₹5,000 | N/A | 🟢 PASS |
| **TS-SPLIT-03** | ₹20,000 | 2 | 2 | ₹10,000 | N/A | 🟢 PASS |
| **TS-SPLIT-04** | ₹30,000 | 3 | 3 | ₹10,000 | N/A | 🟢 PASS |
| **TS-SPLIT-05** | ₹15,000 | 5 | 3 | ₹5,000 | ₹0 | 🟢 PASS |

---

## 3. Second Publication Payment Hold & Release Logic

- **Policy Rule**: Faculty members start receiving payments only after their **second eligible publication**.
- **Audit Verification Results**:
  1. **1st Publication Submission & Approval**:
     - Status: Approved by RPC $\rightarrow$ Moved to Accounts.
     - Database State: `isHeld = true`, `heldReason = "1st eligible publication — Incentive recorded. Payment held until 2nd publication per Research Promotion Policy 2026."`
     - Author Payments Array: `paymentStatus = "HELD"`.
  2. **2nd Publication Submission & Approval**:
     - Status: Approved by RPC $\rightarrow$ Moved to Accounts.
     - Database State: Current claim `isHeld = false`, `paymentStatus = "READY_FOR_RELEASE"`.
     - **Automatic Unholding**: The system queries MongoDB for previous claims by the same applicant where `isHeld === true` and sets `isHeld = false` and `paymentStatus = "READY_FOR_RELEASE"`.
     - Finance Disbursal: Finance releases both 1st and 2nd publication funds simultaneously.
