const express = require('express');
const db = require('../utils/inMemoryDB');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/promotions - Get all promotions with filters
router.get('/', auth, adminAuth, async (req, res) => {
    try {
        const {
            q,
            isActive,
            type,
            startDate,
            endDate,
            sort = 'createdAt',
            page = 1,
            limit = 10
        } = req.query;

        // Get all promotions
        // Note: In a real implementation with MongoDB, we would query the Promotion collection
        // For now, we'll simulate some promotions
        const now = new Date();
        let promotions = [
            {
                id: 'promo1',
                code: 'WELCOME10',
                name: 'Welcome 10% Off',
                description: '10% off on first order',
                type: 'percentage',
                value: 10,
                maxDiscount: 100,
                minOrderValue: 200,
                usageLimit: 1000,
                usedCount: 150,
                applicableTo: 'all',
                isActive: true,
                startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
                endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
                createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'promo2',
                code: 'FREESHIP',
                name: 'Free Delivery',
                description: 'Free delivery on orders above ₹300',
                type: 'free-delivery',
                value: 0,
                maxDiscount: 0,
                minOrderValue: 300,
                usageLimit: 500,
                usedCount: 75,
                applicableTo: 'all',
                isActive: true,
                startDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
                endDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
                createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'promo3',
                code: 'FESTIVE50',
                name: 'Festive ₹50 Off',
                description: '₹50 off on orders above ₹500',
                type: 'fixed',
                value: 50,
                maxDiscount: 50,
                minOrderValue: 500,
                usageLimit: 200,
                usedCount: 200,
                applicableTo: 'all',
                isActive: false, // Expired
                startDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
                endDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
                createdAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];

        // Apply filters
        if (q) {
            promotions = promotions.filter(promo =>
                promo.code.toLowerCase().includes(q.toLowerCase()) ||
                promo.name.toLowerCase().includes(q.toLowerCase()) ||
                (promo.description && promo.description.toLowerCase().includes(q.toLowerCase()))
            );
        }

        if (isActive !== undefined) {
            const active = isActive === 'true';
            promotions = promotions.filter(promo => promo.isActive === active);
        }

        if (type) {
            promotions = promotions.filter(promo => promo.type === type);
        }

        if (startDate) {
            const start = new Date(startDate);
            promotions = promotions.filter(promo => new Date(promo.startDate) >= start);
        }

        if (endDate) {
            const end = new Date(endDate);
            promotions = promotions.filter(promo => new Date(promo.endDate) <= end);
        }

        // Sorting
        if (sort === 'value') {
            promotions.sort((a, b) => b.value - a.value);
        } else if (sort === 'usage') {
            promotions.sort((a, b) => b.usedCount - a.usedCount);
        } else {
            promotions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const paginatedPromotions = promotions.slice(skip, skip + parseInt(limit));

        res.json({
            promotions: paginatedPromotions,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: promotions.length,
                pages: Math.ceil(promotions.length / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/promotions - Create new promotion
router.post('/', auth, adminAuth, async (req, res) => {
    try {
        const {
            code,
            name,
            description,
            type,
            value,
            maxDiscount,
            minOrderValue,
            usageLimit,
            applicableTo,
            restaurants,
            users,
            startDate,
            endDate
        } = req.body;

        // Validate required fields
        if (!code || !name || !type || !value || !startDate || !endDate) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start >= end) {
            return res.status(400).json({ message: 'End date must be after start date' });
        }

        // In a real implementation, we would create a new Promotion document
        // For now, we'll just send a success response
        const newPromotion = {
            id: `promo${Date.now()}`,
            code: code.toUpperCase(),
            name,
            description,
            type,
            value,
            maxDiscount,
            minOrderValue: minOrderValue || 0,
            usageLimit,
            usedCount: 0,
            applicableTo: applicableTo || 'all',
            restaurants: restaurants || [],
            users: users || [],
            isActive: true,
            startDate,
            endDate,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        res.status(201).json({
            message: 'Promotion created successfully',
            promotion: newPromotion
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/promotions/:id - Get promotion details
router.get('/:id', auth, adminAuth, async (req, res) => {
    try {
        // In a real implementation, we would find the Promotion by ID
        // For now, we'll just send a simulated response
        const promotion = {
            id: req.params.id,
            code: 'WELCOME10',
            name: 'Welcome 10% Off',
            description: '10% off on first order',
            type: 'percentage',
            value: 10,
            maxDiscount: 100,
            minOrderValue: 200,
            usageLimit: 1000,
            usedCount: 150,
            applicableTo: 'all',
            isActive: true,
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        };

        res.json({ promotion });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT /api/promotions/:id - Update promotion
router.put('/:id', auth, adminAuth, async (req, res) => {
    try {
        const {
            name,
            description,
            type,
            value,
            maxDiscount,
            minOrderValue,
            usageLimit,
            applicableTo,
            restaurants,
            users,
            startDate,
            endDate,
            isActive
        } = req.body;

        // In a real implementation, we would update the Promotion document
        // For now, we'll just send a success response
        const updatedPromotion = {
            id: req.params.id,
            code: 'WELCOME10', // Code cannot be changed
            name: name || 'Welcome 10% Off',
            description: description || '10% off on first order',
            type: type || 'percentage',
            value: value !== undefined ? value : 10,
            maxDiscount: maxDiscount !== undefined ? maxDiscount : 100,
            minOrderValue: minOrderValue !== undefined ? minOrderValue : 200,
            usageLimit: usageLimit,
            usedCount: 150, // This would normally be preserved
            applicableTo: applicableTo || 'all',
            restaurants: restaurants || [],
            users: users || [],
            isActive: isActive !== undefined ? isActive : true,
            startDate: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // This would normally be preserved
            updatedAt: new Date().toISOString()
        };

        res.json({
            message: 'Promotion updated successfully',
            promotion: updatedPromotion
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/promotions/:id - Delete promotion
router.delete('/:id', auth, adminAuth, async (req, res) => {
    try {
        // In a real implementation, we would delete the Promotion document
        // For now, we'll just send a success response
        res.json({ message: 'Promotion deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;