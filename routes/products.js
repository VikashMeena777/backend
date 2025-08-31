import express from 'express';
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', listProducts);
router.get('/:slug', getProduct);
router.post('/', requireAuth, requireAdmin, createProduct);
router.put('/:id', requireAuth, requireAdmin, updateProduct);
router.delete('/:id', requireAuth, requireAdmin, deleteProduct);

export default router;
