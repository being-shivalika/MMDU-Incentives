# RPMS End-to-End QA Audit — 12. Frontend UI & Diagnostics Report
**Maharishi Markandeshwar (Deemed to be University)**  
**System**: Research Promotion Management System (RPMS)  

---

## 1. Frontend UI Audit & Quality Assurance

- **Design System Constraint**: Preserved existing UI layout, color palettes, fonts, and component structures.
- **Framer Motion Optimization**: Converted imports from `framer-motion` to modern `motion/react` across `Input.jsx`, `Badge.jsx`, `Button.jsx`, and `Card.jsx`.
- **View-Only Mode Banners**: Replaced unconditionally rendered action buttons in drawers with dynamic permission checks (`permissions.canApprove`). Display clean "View Only Mode" status notices for non-approvers.
- **Workflow Diagram**: Built `WorkflowProgressTracker.jsx` component displaying live 5-step workflow status, fallback notices, step checks, and held payment warnings.
- **PDF Policy Viewer**: Embedded PDF viewer displaying `Research_Promotion_Policy_3.0.pdf` with a sticky floating download action.

---

## 2. Console & Page Performance Diagnostics

| Page / Dashboard | Console Errors | Broken Links | Layout Shifting | Status |
| :--- | :---: | :---: | :---: | :---: |
| **Landing Page** | 0 | 0 | None | 🟢 PASS |
| **Login Page** | 0 | 0 | None | 🟢 PASS |
| **Applicant Dashboard** | 0 | 0 | None | 🟢 PASS |
| **Submission Details** | 0 | 0 | None | 🟢 PASS |
| **Department Review Desk** | 0 | 0 | None | 🟢 PASS |
| **RPC Review Dashboard** | 0 | 0 | None | 🟢 PASS |
| **Accounts Payment Desk** | 0 | 0 | None | 🟢 PASS |
