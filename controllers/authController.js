import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendMail, verificationEmailTemplate } from '../utils/mailer.js';

const SALT = 10;

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'User already exists' });
        const passwordHash = await bcrypt.hash(password, SALT);
        const user = await User.create({ name, email, passwordHash });
        // optional: send verification email
        try {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
            await sendMail({ to: email, subject: 'Verify your email', html: verificationEmailTemplate(name, link) });
        } catch (e) { /* non-blocking */ }
        res.status(201).json({ message: 'Registered. Check email to verify.' });
    } catch (err) {
        console.error('register err', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        if (!user.emailVerified) return res.status(400).json({ message: 'Please verify your email first' });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ 
            token, 
            user: { id: user._id, name: user.name, email: user.email } 
        });
    } catch (err) {
        console.error('Login error', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const me = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-passwordHash');
        res.json(user);
    } catch (err) {
        console.error('me err', err);
        res.status(500).json({ message: 'Server error' });
    }
};