import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { getSignedUrl } from '../utils/s3.js';
import { sendMail, orderConfirmationTemplate } from '../utils/mailer.js';
import { v4 as uuidv4 } from 'uuid';
import { generateInvoiceBuffer } from '../utils/invoice.js';

const razorpay = new Razorpay({ 
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_RBsHT3KWOzCywL', 
    key_secret: process.env.RAZORPAY_KEY_SECRET || '2ICC2bgcnOUE8rMeZUZ51qnZ' 
});

export const createOrder = async (req, res) => {
    try {
        const { items } = req.body;
        if (!items || items.length === 0) return res.status(400).json({ message: 'Cart empty' });

        let amount = 0;
        const orderItems = [];
        for (const it of items) {
            const p = await Product.findById(it.productId);
            const price = p ? p.price : (it.price || 0);
            orderItems.push({ productId: it.productId, title: p ? p.title : it.title, price, qty: it.qty || 1 });
            amount += price * (it.qty || 1);
        }

        const amountPaise = Math.round(amount * 100);
        const options = { amount: amountPaise, currency: 'INR', receipt: `receipt_${Date.now()}`, payment_capture: 1 };
        const rOrder = await razorpay.orders.create(options);

        const order = await Order.create({
            userId: req.user._id,
            email: req.user.email,
            items: orderItems,
            amount,
            providerOrderId: rOrder.id,
            paymentStatus: 'pending'
        });

        res.json({ orderId: order._id, razorOrder: rOrder, amount });
    } catch (err) {
        console.error('createOrder err', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const webhook = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
        const signature = req.headers['x-razorpay-signature'];
        const expected = crypto.createHmac('sha256', secret).update(JSON.stringify(req.body)).digest('hex');
        
        if (signature !== expected) {
            console.warn('Webhook signature mismatch');
            return res.status(400).send('invalid signature');
        }
        
        const payload = req.body; 
        if (payload.event === 'payment.captured') {
            const payment = payload.payload.payment.entity;
            const razorOrderId = payment.order_id;
            const providerPaymentId = payment.id;
            const order = await Order.findOne({ providerOrderId: razorOrderId });
            if (!order) return res.status(404).send('order not found');

            order.paymentStatus = 'paid';
            order.providerPaymentId = providerPaymentId;

            order.downloads = order.items.map(it => {
                const key = `products/${it.productId}.zip`;
                return { productId: it.productId, url: getSignedUrl(key), expiresAt: new Date(Date.now() + parseInt(process.env.DOWNLOAD_TTL_HOURS || '24', 10) * 3600 * 1000) };
            });

            order.items.forEach(it => { it.licenseKey = uuidv4(); });

            const invoiceBuffer = await generateInvoiceBuffer(order).catch(() => null);
            const attachments = invoiceBuffer ? [{ filename: `invoice-${order._id}.pdf`, content: invoiceBuffer }] : [];

            await order.save();

            // Send order confirmation email
            try {
                await sendMail({
                    to: order.email,
                    subject: 'Order Confirmation - XPR Media Agency',
                    html: orderConfirmationTemplate(order),
                    attachments
                });
            } catch (emailError) {
                console.error('Email send error:', emailError);
            }
        }

        res.status(200).send('OK');
    } catch (err) {
        console.error('webhook err', err);
        res.status(500).send('Server error');
    }
};

export const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json({ orders });
    } catch (err) {
        console.error('myOrders err', err);
        res.status(500).json({ message: 'Server error' });
    }
};