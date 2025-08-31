import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    title: String,
    shortDesc: String,
    price: Number,
    currency: { type: String, default: 'INR' },
    image: String
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
