import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    productId: String,
    title: String,
    price: Number,
    qty: { type: Number, default: 1 },
    licenseKey: String
}, { _id: false });

const downloadSchema = new mongoose.Schema({
    productId: String,
    url: String,
    expiresAt: Date
}, { _id: false });

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: String,
    items: [itemSchema],
    amount: Number,
    currency: { type: String, default: 'INR' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    providerOrderId: String,
    providerPaymentId: String,
    downloads: [downloadSchema],
    invoiceUrl: String
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
