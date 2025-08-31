import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({ key: String, url: String }, { _id: false });

const productSchema = new mongoose.Schema({
    title: String,
    slug: { type: String, unique: true, index: true },
    category: String,
    price: Number,
    shortDesc: String,
    longDesc: String,
    tags: [String],
    thumbnailUrl: String,
    assets: [assetSchema],
    featured: { type: Boolean, default: false },
    resellRights: { type: Boolean, default: true },
    isDigital: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
