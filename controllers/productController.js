import Product from '../models/Product.js';
import slugify from 'slugify';

export const listProducts = async (req, res) => {
    try {
        const { search, category, page = 1, limit = 24 } = req.query;
        const q = {};
        if (search) q.$or = [{ title: new RegExp(search, 'i') }, { shortDesc: new RegExp(search, 'i') }];
        if (category) q.category = category;
        const items = await Product.find(q).skip((page - 1) * limit).limit(parseInt(limit)).sort({ featured: -1, createdAt: -1 });
        const total = await Product.countDocuments(q);
        res.json({ items, total });
    } catch (err) {
        console.error('listProducts err', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getProduct = async (req, res) => {
    try {
        const p = await Product.findOne({ slug: req.params.slug });
        if (!p) return res.status(404).json({ message: 'Not found' });
        res.json({ product: p });
    } catch (err) {
        console.error('getProduct err', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createProduct = async (req, res) => {
    try {
        const body = req.body;
        const slug = slugify(body.title || Date.now(), { lower: true });
        const p = await Product.create({ ...body, slug });
        res.json({ product: p });
    } catch (err) {
        console.error('createProduct err', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ product: p });
    } catch (err) {
        console.error('updateProduct err', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        console.error('deleteProduct err', err);
        res.status(500).json({ message: 'Server error' });
    }
};
