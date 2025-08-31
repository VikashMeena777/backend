import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: String,
    targetType: String,
    targetId: String,
    notes: String
}, { timestamps: true });

export default mongoose.model('AdminAudit', auditSchema);
