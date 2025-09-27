const express = require('express');
const db = require('../utils/inMemoryDB');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// In-memory settings storage for simulation
const settings = {
    'general.siteName': {
        key: 'general.siteName',
        value: 'Zomato Clone',
        type: 'string',
        category: 'general',
        description: 'Site name displayed in the application'
    },
    'general.contactEmail': {
        key: 'general.contactEmail',
        value: 'support@zomatoclone.com',
        type: 'string',
        category: 'general',
        description: 'Contact email for customer support'
    },
    'delivery.baseFee': {
        key: 'delivery.baseFee',
        value: 30,
        type: 'number',
        category: 'delivery',
        description: 'Base delivery fee in INR'
    },
    'delivery.feePerKm': {
        key: 'delivery.feePerKm',
        value: 15,
        type: 'number',
        category: 'delivery',
        description: 'Delivery fee per kilometer in INR'
    },
    'delivery.maxDistance': {
        key: 'delivery.maxDistance',
        value: 10,
        type: 'number',
        category: 'delivery',
        description: 'Maximum delivery distance in kilometers'
    },
    'payment.codEnabled': {
        key: 'payment.codEnabled',
        value: true,
        type: 'boolean',
        category: 'payment',
        description: 'Enable/disable cash on delivery option'
    },
    'payment.minCodAmount': {
        key: 'payment.minCodAmount',
        value: 200,
        type: 'number',
        category: 'payment',
        description: 'Minimum order amount for COD in INR'
    },
    'notifications.emailEnabled': {
        key: 'notifications.emailEnabled',
        value: true,
        type: 'boolean',
        category: 'notifications',
        description: 'Enable/disable email notifications'
    },
    'taxes.serviceTax': {
        key: 'taxes.serviceTax',
        value: 5,
        type: 'number',
        category: 'taxes',
        description: 'Service tax percentage'
    },
    'taxes.gst': {
        key: 'taxes.gst',
        value: 18,
        type: 'number',
        category: 'taxes',
        description: 'GST percentage'
    }
};

// GET /api/settings - Get all settings
router.get('/', auth, adminAuth, async (req, res) => {
    try {
        const { category } = req.query;

        let filteredSettings = Object.values(settings);

        if (category) {
            filteredSettings = filteredSettings.filter(setting => setting.category === category);
        }

        res.json({
            settings: filteredSettings
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/settings/:key - Get specific setting
router.get('/:key', auth, adminAuth, async (req, res) => {
    try {
        const key = req.params.key;
        const fullKey = `${req.query.category || 'general'}.${key}`;

        const setting = settings[fullKey];

        if (!setting) {
            return res.status(404).json({ message: 'Setting not found' });
        }

        res.json({ setting });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT /api/settings/:key - Update setting
router.put('/:key', auth, adminAuth, async (req, res) => {
    try {
        const key = req.params.key;
        const { value, category = 'general' } = req.body;

        const fullKey = `${category}.${key}`;

        if (!settings[fullKey]) {
            return res.status(404).json({ message: 'Setting not found' });
        }

        // Update setting value
        settings[fullKey].value = value;
        settings[fullKey].updatedAt = new Date().toISOString();

        res.json({
            message: 'Setting updated successfully',
            setting: settings[fullKey]
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/settings - Create new setting
router.post('/', auth, adminAuth, async (req, res) => {
    try {
        const { key, value, type, category, description } = req.body;

        // Validate required fields
        if (!key || !category) {
            return res.status(400).json({ message: 'Key and category are required' });
        }

        const fullKey = `${category}.${key}`;

        // Check if setting already exists
        if (settings[fullKey]) {
            return res.status(400).json({ message: 'Setting already exists' });
        }

        // Create new setting
        settings[fullKey] = {
            key: fullKey,
            value,
            type: type || 'string',
            category,
            description: description || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        res.status(201).json({
            message: 'Setting created successfully',
            setting: settings[fullKey]
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/settings/:key - Delete setting
router.delete('/:key', auth, adminAuth, async (req, res) => {
    try {
        const key = req.params.key;
        const { category = 'general' } = req.query;

        const fullKey = `${category}.${key}`;

        if (!settings[fullKey]) {
            return res.status(404).json({ message: 'Setting not found' });
        }

        // Delete setting
        delete settings[fullKey];

        res.json({ message: 'Setting deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;