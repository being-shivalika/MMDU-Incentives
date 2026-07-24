import { Router } from 'express';
import { processTransition, getWorkflowConfig, updateWorkflowConfig } from '../controllers/workflowController.js';
import protect from '../middleware/auth.js';
import authorize from '../middleware/authorize.js';

const router = Router();

router.use(protect);

router.post('/transition', processTransition);
router.get('/config', authorize('admin'), getWorkflowConfig);
router.put('/config/:id', authorize('admin'), updateWorkflowConfig);

export default router;
