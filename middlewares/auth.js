import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const requireAuth = async (req, res, next) => {
    try {
        const header = req.headers.authorization || '';
        const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
        if (!token) return res.status(401).json({ message: 'No token provided' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-passwordHash -resetToken');
        if (!user) return res.status(401).json({ message: 'Invalid token' });
        req.user = user;
        next();
    } catch (err) {
        console.error('Auth error', err);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

export const requireAdmin = (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    next();
};
