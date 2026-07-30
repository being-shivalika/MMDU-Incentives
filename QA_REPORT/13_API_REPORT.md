# RPMS End-to-End QA Audit — 13. REST API Endpoint Audit
**Maharishi Markandeshwar (Deemed to be University)**  
**System**: Research Promotion Management System (RPMS)  

---

## 1. REST API Specification & Response Standardization
All backend routes return standardized JSON payloads:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2026-07-30T01:00:00.000Z"
}
```

---

## 2. Endpoint Audit Matrix

| Endpoint Route | HTTP Method | Protected | Roles Allowed | Status Codes | Status |
| :--- | :---: | :---: | :--- | :---: | :---: |
| `/api/auth/login` | `POST` | Public | All | 200, 400, 401, 403 | 🟢 PASS |
| `/api/auth/me` | `GET` | Yes | All | 200, 401 | 🟢 PASS |
| `/api/auth/logout` | `POST` | Yes | All | 200 | 🟢 PASS |
| `/api/submissions` | `GET` | Yes | All Roles (Filtered) | 200, 401 | 🟢 PASS |
| `/api/submissions` | `POST` | Yes | `faculty`, `student` | 201, 400, 401 | 🟢 PASS |
| `/api/submissions/:id` | `GET` | Yes | All Roles | 200, 401, 404 | 🟢 PASS |
| `/api/submissions/:id` | `PUT` | Yes | `faculty`, `student` | 200, 400, 403 | 🟢 PASS |
| `/api/submissions/:id/draft` | `PUT` | Yes | `faculty`, `student` | 200, 400, 403 | 🟢 PASS |
| `/api/submissions/:id` | `DELETE` | Yes | `faculty`, `student` | 200, 400, 403 | 🟢 PASS |
| `/api/workflow/transition` | `POST` | Yes | Authorized Approvers | 200, 400, 403 | 🟢 PASS |
| `/api/workflow/config` | `GET` | Yes | `admin` | 200, 401, 403 | 🟢 PASS |
| `/api/transactions` | `GET` | Yes | `accounts`, `admin` | 200, 401, 403 | 🟢 PASS |
| `/api/notifications` | `GET` | Yes | All Roles | 200, 401 | 🟢 PASS |
| `/api/notifications/:id/read` | `PUT` | Yes | All Roles | 200, 404 | 🟢 PASS |
| `/api/dashboard/stats` | `GET` | Yes | All Roles | 200, 401 | 🟢 PASS |
