import express from 'express';
import { createOrder, webhook, myOrders } from '../controllers/orderController.js';
import bodyParser from 'body-parser';
import { requireAuth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/create-order', requireAuth, createOrder);

// webhook route requires raw body for signature verification
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), webhook);

router.get('/my-orders', requireAuth, myOrders);

export default router;
