import { Router } from 'express';
import { listSubmissions, createSubmission, getSubmission, updateSubmission, saveDraft, deleteSubmission, markClaimAsPaid, markBatchClaimsAsPaid } from '../controllers/submissionController.js';
import protect from '../middleware/auth.js';
import authorize from '../middleware/authorize.js';

const router = Router();

router.use(protect); // All routes require authentication

router.post('/pay-batch', authorize('accounts', 'admin', 'hod', 'rpc_cell', 'director', 'vc'), markBatchClaimsAsPaid);

router.route('/')
  .get(listSubmissions)
  .post(authorize('faculty', 'student'), createSubmission);

router.route('/:id')
  .get(getSubmission)
  .put(authorize('faculty', 'student'), updateSubmission)
  .delete(authorize('faculty', 'student'), deleteSubmission);

router.put('/:id/draft', authorize('faculty', 'student'), saveDraft);
router.put('/:id/pay', authorize('accounts', 'admin', 'hod', 'rpc_cell', 'director', 'vc'), markClaimAsPaid);

export default router;
