import express from 'express';
import { requireAuth, requireAdmin } from '../middlewares/auth.js';
import { stats } from '../controllers/adminController.js';
import Product from '../models/Product.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import Order from '../models/Order.js';

const router = express.Router();
router.use(requireAuth);
router.use(requireAdmin);

router.get('/stats', stats);

// Manage products - admin
router.get('/products', async (req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ products });
});
router.get('/services', async (req, res) => {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json({ services });
});
router.get('/bookings', async (req, res) => {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ bookings });
});
router.get('/orders', async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ orders });
});

export default router;
