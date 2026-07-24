import { Router } from 'express';
import { uploadDocument, getClaimDocuments, deleteDocument } from '../controllers/uploadController.js';
import protect from '../middleware/auth.js';
import authorize from '../middleware/authorize.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.use(protect);

router.route('/:claimId')
  .post(authorize('faculty', 'student'), upload.single('document'), uploadDocument)
  .get(getClaimDocuments);

router.delete('/:documentId', authorize('faculty', 'student'), deleteDocument);

export default router;
