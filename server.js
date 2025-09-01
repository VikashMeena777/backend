import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import connectDB from './config/db.js';
import rateLimiter from './middlewares/rateLimiter.js';

import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import servicesRoutes from './routes/services.js';
import bookingsRoutes from './routes/bookings.js';
import ordersRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json({ limit: '15mb' }));
app.use(rateLimiter);

// health
app.get('/', (req, res) => res.send('XPR Media Agency API'));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/orders', ordersRoutes); // includes webhook route (raw body handled inside)
app.use('/api/admin', adminRoutes);

// fallback error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
    await connectDB();
    app.listen(PORT, '5000', () => console.log(`Server running on http://localhost:${PORT}`));
};

start();
