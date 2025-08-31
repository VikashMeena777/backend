import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false,
    auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
    }
});

export async function sendMail({ to, subject, html, text, attachments }) {
    if (!process.env.SMTP_USER) {
        console.log('EMAIL (mock) to:', to, 'subject:', subject);
        return null;
    }
    const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to,
        subject,
        html,
        text,
        attachments
    });
    return info;
}

export function verificationEmailTemplate(name, link) {
    return `<p>Hi ${name || ''},</p><p>Please verify your email by clicking <a href="${link}">this link</a>.</p>`;
}

export function bookingEmailTemplate(booking) {
    return `<h3>New booking</h3><pre>${JSON.stringify(booking, null, 2)}</pre>`;
}

export function orderConfirmationTemplate(order) {
    return `<h3>Order Confirmed</h3><p>Order ID: ${order._id}</p><p>Amount: ₹${order.amount}</p>`;
}
