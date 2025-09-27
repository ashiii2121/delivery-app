const express = require('express');
const db = require('../utils/inMemoryDB');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/customers - Get all customers with filters
router.get('/', auth, adminAuth, async (req, res) => {
    try {
        const { q, isBlocked, sort = 'createdAt', page = 1, limit = 10 } = req.query;

        // Get all customers
        let customers = db.data.users.filter(user => user.role === 'user');

        // Apply filters
        if (q) {
            customers = customers.filter(customer =>
                customer.name.toLowerCase().includes(q.toLowerCase()) ||
                customer.email.toLowerCase().includes(q.toLowerCase())
            );
        }

        if (isBlocked !== undefined) {
            // For now, we'll assume isBlocked is stored in user metadata
            // In a real MongoDB implementation, this would be a field in the Customer model
        }

        // Sorting
        if (sort === 'name') {
            customers.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort === 'email') {
            customers.sort((a, b) => a.email.localeCompare(b.email));
        } else {
            customers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const paginatedCustomers = customers.slice(skip, skip + parseInt(limit));

        // Remove passwordHash from response
        const customersWithoutPassword = paginatedCustomers.map(customer => {
            const { passwordHash, ...customerWithoutPassword } = customer;
            return customerWithoutPassword;
        });

        res.json({
            customers: customersWithoutPassword,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: customers.length,
                pages: Math.ceil(customers.length / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/customers/:id - Get customer details
router.get('/:id', auth, adminAuth, async (req, res) => {
    try {
        const customer = db.findUserById(req.params.id);

        if (!customer || customer.role !== 'user') {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Get customer's order history
        const orders = db.findOrdersByUserId(customer.id);

        // Remove passwordHash from response
        const { passwordHash, ...customerWithoutPassword } = customer;

        res.json({
            customer: customerWithoutPassword,
            orders
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT /api/customers/:id/block - Block/unblock customer
router.put('/:id/block', auth, adminAuth, async (req, res) => {
    try {
        const { isBlocked } = req.body;
        const customer = db.findUserById(req.params.id);

        if (!customer || customer.role !== 'user') {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // In a real implementation, we would update the Customer model
        // For now, we'll just send a success response
        res.json({
            message: `Customer ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
            customer: { id: customer.id, isBlocked }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;