import Service from '../models/Service.js';

export const listServices = async (req, res) => {
    try {
        const list = await Service.find().sort({ createdAt: -1 });
        res.json({ services: list });
    } catch (err) {
        console.error('listServices err', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createService = async (req, res) => {
    try {
        const s = await Service.create(req.body);
        res.json({ service: s });
    } catch (err) {
        console.error('createService err', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateService = async (req, res) => {
    try {
        const s = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ service: s });
    } catch (err) {
        console.error('updateService err', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteService = async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        console.error('deleteService err', err);
        res.status(500).json({ message: 'Server error' });
    }
};
