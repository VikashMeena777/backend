import PDFDocument from 'pdfkit';
import streamBuffers from 'stream-buffers';

export async function generateInvoiceBuffer(order) {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const bufferStream = new streamBuffers.WritableStreamBuffer();

    doc.pipe(bufferStream);
    doc.fontSize(20).text('XPR Media Agency', { align: 'left' });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice for Order: ${order._id}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
    doc.moveDown();

    order.items.forEach((it, idx) => {
        doc.fontSize(12).text(`${idx + 1}. ${it.title} x${it.qty} — ₹${it.price}`);
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total: ₹${order.amount}`);
    doc.end();

    await new Promise((resolve) => doc.on('end', resolve));
    return bufferStream.getContents();
}
