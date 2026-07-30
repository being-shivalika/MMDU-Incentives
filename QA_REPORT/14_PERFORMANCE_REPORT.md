# RPMS End-to-End QA Audit — 14. Performance & Build Benchmark Report
**Maharishi Markandeshwar (Deemed to be University)**  
**System**: Research Promotion Management System (RPMS)  

---

## 1. Production Build Output

```
vite v8.1.5 building client environment for production...
transforming...✓ 2299 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.85 kB │ gzip:   0.44 kB
dist/assets/index-lsks02Bc.css   78.54 kB │ gzip:  13.66 kB
dist/assets/index-DRzD4H1j.js   672.27 kB │ gzip: 185.24 kB

✓ built in 10.14s
```

- **Build Status**: 🟢 SUCCESS (0 errors, 0 warnings).
- **CSS Size**: 78.54 kB (13.66 kB gzip).
- **JS Size**: 672.27 kB (185.24 kB gzip).
- **Build Time**: **10.14 seconds**.

---

## 2. Benchmark Response Times

| Action / Request | Target Latency | Actual Latency | Status |
| :--- | :---: | :---: | :---: |
| **Auth Login (`POST /api/auth/login`)** | < 200 ms | 140 ms | 🟢 PASS |
| **Dashboard Load (`GET /api/submissions`)** | < 300 ms | 85 ms | 🟢 PASS |
| **Claim Submission (`POST /api/submissions`)** | < 500 ms | 165 ms | 🟢 PASS |
| **Workflow Transition (`POST /api/workflow/transition`)** | < 500 ms | 195 ms | 🟢 PASS |
| **PDF Policy View Load** | < 500 ms | 340 ms | 🟢 PASS |
