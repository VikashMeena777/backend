import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    service: String,
    date: String,
    notes: String,
    status: { type: String, enum: ['new', 'contacted', 'closed', 'canceled'], default: 'new' }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
