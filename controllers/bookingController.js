import Booking from '../models/Booking.js';
import { sendMail, bookingEmailTemplate } from '../utils/mailer.js';

export const createBooking = async (req, res) => {
    try {
        const { name, email, phone, service, date, notes } = req.body;
        if (!name || !email || !service) return res.status(400).json({ message: 'Missing fields' });
        const b = await Booking.create({ name, email, phone, service, date, notes });
        // notify admin & send confirmation to user (non-blocking)
        try { await sendMail({ to: process.env.SMTP_USER || process.env.ADMIN_EMAIL, subject: 'New Booking', html: bookingEmailTemplate(b) }); } catch (e) { console.log('mail fail', e); }
        try { await sendMail({ to: email, subject: 'Booking Received', html: `<p>Your booking for ${service} is received. We will contact you soon.</p>` }); } catch (e) { console.log('mail fail', e); }
        res.json({ message: 'Booked. We will contact you soon.' });
    } catch (err) {
        console.error('createBooking err', err);
        res.status(500).json({ message: 'Server error' });
    }
};
