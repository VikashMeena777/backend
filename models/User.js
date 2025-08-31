import mongoose from 'mongoose';

const resetTokenSchema = new mongoose.Schema({
    token: String,
    expiresAt: Date
}, { _id: false });

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, unique: true, required: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    emailVerified: { type: Boolean, default: false },
    resetToken: resetTokenSchema
}, { timestamps: true });

export default mongoose.model('User', userSchema);
