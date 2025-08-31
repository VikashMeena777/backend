import express from 'express';
import { listServices, createService, updateService, deleteService } from '../controllers/serviceController.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', listServices);
router.post('/', requireAuth, requireAdmin, createService);
router.put('/:id', requireAuth, requireAdmin, updateService);
router.delete('/:id', requireAuth, requireAdmin, deleteService);

export default router;
