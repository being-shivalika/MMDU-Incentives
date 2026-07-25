import { Router } from 'express';
import { listSubmissions, createSubmission, getSubmission, updateSubmission, saveDraft, deleteSubmission } from '../controllers/submissionController.js';
import protect from '../middleware/auth.js';
import authorize from '../middleware/authorize.js';

const router = Router();

router.use(protect); // All routes require authentication

router.route('/')
  .get(listSubmissions)
  .post(authorize('faculty', 'student'), createSubmission);

router.route('/:id')
  .get(getSubmission)
  .put(authorize('faculty', 'student'), updateSubmission)
  .delete(authorize('faculty', 'student'), deleteSubmission);

router.put('/:id/draft', authorize('faculty', 'student'), saveDraft);

export default router;
