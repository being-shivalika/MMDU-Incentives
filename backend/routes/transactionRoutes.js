import { Router } from 'express';
import { listTransactions, getTransaction, updateTransaction, getTransactionByClaim } from '../controllers/transactionController.js';
import protect from '../middleware/auth.js';
import authorize from '../middleware/authorize.js';

const router = Router();

router.use(protect);

router.get('/', authorize('accounts', 'admin', 'registrar'), listTransactions);
router.get('/claim/:claimId', getTransactionByClaim);
router.route('/:id')
  .get(authorize('accounts', 'admin'), getTransaction)
  .put(authorize('accounts'), updateTransaction);

export default router;
