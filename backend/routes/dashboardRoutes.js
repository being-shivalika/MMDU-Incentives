import { Router } from 'express';
import { getDashboardStats, getRecentSubmissions, getChartData } from '../controllers/dashboardController.js';
import protect from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/recent', getRecentSubmissions);
router.get('/chart-data', getChartData);

export default router;
