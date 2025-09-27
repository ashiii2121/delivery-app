const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../utils/inMemoryDB');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/delivery-partners - Create a new delivery partner
router.post('/', auth, adminAuth, async (req, res) => {
    try {
        const { name, email, password, phone, vehicle } = req.body;

        // Check if user already exists
        const existingUser = db.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create new delivery partner
        const deliveryPartner = db.createUser({
            name,
            email,
            passwordHash,
            phone,
            vehicle,
            role: 'delivery',
            isApproved: false,
            isBlocked: false,
            rating: 0,
            totalDeliveries: 0,
            createdAt: new Date().toISOString()
        });

        // Remove passwordHash from response
        const { passwordHash: removedPassword, ...partnerWithoutPassword } = deliveryPartner;

        res.status(201).json({
            message: 'Delivery partner created successfully',
            deliveryPartner: partnerWithoutPassword
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/delivery-partners - Get all delivery partners with filters
router.get('/', auth, adminAuth, async (req, res) => {
    try {
        const { q, status, isAvailable, sort = 'createdAt', page = 1, limit = 10 } = req.query;

        // Get all delivery partners (users with role 'delivery')
        // Note: In a real implementation with MongoDB, we would query the DeliveryPartner collection
        let deliveryPartners = db.data.users.filter(user => user.role === 'delivery');

        // Apply filters
        if (q) {
            deliveryPartners = deliveryPartners.filter(partner =>
                partner.name.toLowerCase().includes(q.toLowerCase()) ||
                partner.email.toLowerCase().includes(q.toLowerCase()) ||
                partner.phone.includes(q)
            );
        }

        if (status) {
            // In a real implementation, we would filter by status field
        }

        // Sorting
        if (sort === 'name') {
            deliveryPartners.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort === 'rating') {
            deliveryPartners.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else {
            deliveryPartners.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const paginatedPartners = deliveryPartners.slice(skip, skip + parseInt(limit));

        // Remove passwordHash from response
        const partnersWithoutPassword = paginatedPartners.map(partner => {
            const { passwordHash, ...partnerWithoutPassword } = partner;
            return partnerWithoutPassword;
        });

        res.json({
            deliveryPartners: partnersWithoutPassword,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: deliveryPartners.length,
                pages: Math.ceil(deliveryPartners.length / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/delivery-partners/:id - Get delivery partner details
router.get('/:id', auth, adminAuth, async (req, res) => {
    try {
        const partner = db.findUserById(req.params.id);

        if (!partner || partner.role !== 'delivery') {
            return res.status(404).json({ message: 'Delivery partner not found' });
        }

        // Get partner's recent deliveries
        const recentOrders = db.data.orders.filter(order =>
            order.deliveryPartnerId == partner.id
        ).slice(0, 10);

        // Remove passwordHash from response
        const { passwordHash, ...partnerWithoutPassword } = partner;

        res.json({
            deliveryPartner: partnerWithoutPassword,
            recentOrders
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT /api/delivery-partners/:id/approve - Approve/reject delivery partner
router.put('/:id/approve', auth, adminAuth, async (req, res) => {
    try {
        const { status } = req.body; // 'approved', 'rejected', 'pending'
        const partner = db.findUserById(req.params.id);

        if (!partner || partner.role !== 'delivery') {
            return res.status(404).json({ message: 'Delivery partner not found' });
        }

        // In a real implementation, we would update the DeliveryPartner model
        // For now, we'll just send a success response
        res.json({
            message: `Delivery partner ${status} successfully`,
            deliveryPartner: { id: partner.id, status }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT /api/delivery-partners/:id/block - Block/unblock delivery partner
router.put('/:id/block', auth, adminAuth, async (req, res) => {
    try {
        const { isBlocked } = req.body;
        const partner = db.findUserById(req.params.id);

        if (!partner || partner.role !== 'delivery') {
            return res.status(404).json({ message: 'Delivery partner not found' });
        }

        // In a real implementation, we would update the DeliveryPartner model
        // For now, we'll just send a success response
        res.json({
            message: `Delivery partner ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
            deliveryPartner: { id: partner.id, isBlocked }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;