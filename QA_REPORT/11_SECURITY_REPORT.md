# RPMS End-to-End QA Audit — 11. Security Audit Report
**Maharishi Markandeshwar (Deemed to be University)**  
**System**: Research Promotion Management System (RPMS)  

---

## 1. Security Controls & Defensive Architecture

- **Transport Security**: HTTPS / TLS 1.3 encryption.
- **Header Protection**: `helmet()` for X-Frame-Options, Content Security Policy, and HSTS.
- **Sanitization**: `mongoSanitize()` strips `$` and `.` characters from incoming request bodies to prevent NoSQL query operator injection.
- **Authentication**: JWT signature verification with configurable expiration (`JWT_EXPIRE`).
- **Authorization**: Server-side role and effective approver checks (`hierarchyService.js`) on all protected routes.

---

## 2. Security Test Vector Results

| Vulnerability Vector | Test Method | Expected Result | Status |
| :--- | :--- | :--- | :---: |
| **Token Tampering** | Manipulated JWT signature | Returns `401 Unauthorized` | 🟢 PASS |
| **Role Escalation** | Student calling HOD transition API | Returns `403 Forbidden` | 🟢 PASS |
| **NoSQL Injection** | Input payload with `{"$gt": ""}` | Sanitized by `express-mongo-sanitize` | 🟢 PASS |
| **Duplicate DOI Fraud** | Submitting active DOI | Returns `400 Bad Request` | 🟢 PASS |
| **Disabled Account Access**| Login with `isActive: false` | Returns `403 Account Disabled` | 🟢 PASS |
| **Direct URL Access** | Student accessing `/research-review` | Blocked by `ProtectedRoute` $\rightarrow$ Redirected | 🟢 PASS |
