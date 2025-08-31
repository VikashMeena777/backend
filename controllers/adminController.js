import Order from '../models/Order.js';
import Booking from '../models/Booking.js';
import Product from '../models/Product.js';
import Service from '../models/Service.js';

export const stats = async (req, res) => {
    try {
        const ordersCount = await Order.countDocuments();
        const bookingsCount = await Booking.countDocuments();
        const revenueAgg = await Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
        const revenue = (revenueAgg[0] && revenueAgg[0].total) || 0;
        res.json({ ordersCount, bookingsCount, revenue });
    } catch (err) {
        console.error('admin stats err', err);
        res.status(500).json({ message: 'Server error' });
    }
};
