# RPMS End-to-End QA Audit — 10. Database Schema & Transaction Validation
**Maharishi Markandeshwar (Deemed to be University)**  
**System**: Research Promotion Management System (RPMS)  

---

## 1. MongoDB Atlas Database Structure
Database: MongoDB Atlas (`mmdu-policy-test`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MONGODB ATLAS COLLECTIONS                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  1. users             - Identity, Role, Department, Employee ID             │
│  2. claims            - Research Claims, Metadata, Author Split, Hold Status│
│  3. approvalhistories - Immutable Transition Ledger & Audit Steps           │
│  4. workflowconfigs   - Active Stage Sequences & Allowed Actions            │
│  5. policyrules       - Quartile Amounts, Scores & Max Claim Limits         │
│  6. transactions      - Financial Sanction Vouchers & Payment Details       │
│  7. notifications     - In-App Notifications with Recipient & Redirect URLs │
│  8. auditlogs         - High-Security System Audit Log Entries              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Collection Schema Audit Details

### `claims` Collection Schema Additions:
```javascript
totalIncentive: { type: Number, default: 0 },
mmduAuthorCount: { type: Number, default: 1 },
individualShare: { type: Number, default: 0 },
authorPayments: [{
  name: { type: String },
  employeeId: { type: String },
  department: { type: String },
  institution: { type: String },
  isMmdu: { type: Boolean, default: true },
  payableAmount: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['HELD', 'READY_FOR_RELEASE', 'RELEASED', 'PAID'], default: 'HELD' }
}],
isHeld: { type: Boolean, default: false },
heldReason: { type: String, default: null }
```

---

## 3. Database Consistency & Synchronization

1. **Transactional Consistency**:
   - Creating a claim creates a `Claim` document, dispatches an `AuditLog` entry, and pushes a `Notification` to the HOD.
   - Transitioning a claim updates `status`, pushes an entry to `ApprovalHistory`, dispatches an `AuditLog`, updates `Notification` records, and updates payment ledgers.
2. **Data Persistence**:
   - 100% data persistence verified across server restarts and browser `F5` refreshes.
