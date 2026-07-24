import { Router } from 'express';
import {
  listUsers, createUser, updateUser, toggleUserActive,
  getAuditLogs,
  listPolicyRules, createPolicyRule, updatePolicyRule,
  listFinancialYears, createFinancialYear, updateFinancialYear,
  getWorkflowConfig, updateWorkflowConfig
} from '../controllers/adminController.js';
import protect from '../middleware/auth.js';
import authorize from '../middleware/authorize.js';

const router = Router();

router.use(protect);

// User Management
router.route('/users')
  .get(authorize('admin'), listUsers)
  .post(authorize('admin'), createUser);
router.route('/users/:id')
  .put(authorize('admin'), updateUser);
router.put('/users/:id/toggle-active', authorize('admin'), toggleUserActive);

// Audit Logs
router.get('/audit-logs', authorize('admin'), getAuditLogs);

// Policy Rules
router.route('/policy-rules')
  .get(authorize('admin', 'rpc_cell'), listPolicyRules)
  .post(authorize('admin'), createPolicyRule);
router.put('/policy-rules/:id', authorize('admin'), updatePolicyRule);

// Financial Years
router.route('/financial-years')
  .get(authorize('admin'), listFinancialYears)
  .post(authorize('admin'), createFinancialYear);
router.put('/financial-years/:id', authorize('admin'), updateFinancialYear);

// Workflow Config
router.get('/workflow-config', authorize('admin'), getWorkflowConfig);
router.put('/workflow-config/:id', authorize('admin'), updateWorkflowConfig);

export default router;
