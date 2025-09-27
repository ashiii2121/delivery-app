const express = require('express');
const db = require('../utils/inMemoryDB');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/payments - Get all payments with filters
router.get('/', auth, adminAuth, async (req, res) => {
    try {
        const {
            q,
            status,
            paymentMethod,
            startDate,
            endDate,
            sort = 'createdAt',
            page = 1,
            limit = 10
        } = req.query;

        // Get all payments
        // Note: In a real implementation with MongoDB, we would query the Payment collection
        let payments = [...db.data.orders].map(order => ({
            id: order.id,
            orderId: order.id,
            userId: order.userId,
            restaurantId: order.restaurantId,
            amount: order.total,
            currency: 'INR',
            paymentMethod: order.payment.method,
            paymentStatus: order.payment.status,
            transactionId: order.payment.transactionId,
            createdAt: order.createdAt
        }));

        // Apply filters
        if (q) {
            payments = payments.filter(payment =>
                payment.transactionId && payment.transactionId.includes(q)
            );
        }

        if (status) {
            payments = payments.filter(payment => payment.paymentStatus === status);
        }

        if (paymentMethod) {
            payments = payments.filter(payment => payment.paymentMethod === paymentMethod);
        }

        if (startDate) {
            const start = new Date(startDate);
            payments = payments.filter(payment => new Date(payment.createdAt) >= start);
        }

        if (endDate) {
            const end = new Date(endDate);
            payments = payments.filter(payment => new Date(payment.createdAt) <= end);
        }

        // Sorting
        if (sort === 'amount') {
            payments.sort((a, b) => b.amount - a.amount);
        } else {
            payments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const paginatedPayments = payments.slice(skip, skip + parseInt(limit));

        res.json({
            payments: paginatedPayments,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: payments.length,
                pages: Math.ceil(payments.length / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/payments/:id - Get payment details
router.get('/:id', auth, adminAuth, async (req, res) => {
    try {
        const order = db.findOrderById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Transform order to payment object
        const payment = {
            id: order.id,
            orderId: order.id,
            userId: order.userId,
            restaurantId: order.restaurantId,
            amount: order.total,
            currency: 'INR',
            paymentMethod: order.payment.method,
            paymentStatus: order.payment.status,
            transactionId: order.payment.transactionId,
            gatewayResponse: null, // Not available in in-memory DB
            commissionRate: 0.15, // 15% commission
            commissionAmount: order.total * 0.15,
            restaurantPayout: order.total * 0.85,
            deliveryPartnerPayout: 0, // Would be calculated based on delivery partner
            platformEarnings: order.total * 0.15,
            refundAmount: 0,
            refundReason: null,
            refundTransactionId: null,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        };

        // Get related entities
        const user = db.findUserById(order.userId);
        const restaurant = db.findRestaurantById(order.restaurantId);

        res.json({
            payment,
            user: user ? { id: user.id, name: user.name, email: user.email } : null,
            restaurant: restaurant ? { id: restaurant.id, name: restaurant.name } : null
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT /api/payments/:id/refund - Process refund
router.put('/:id/refund', auth, adminAuth, async (req, res) => {
    try {
        const { refundAmount, refundReason } = req.body;
        const order = db.findOrderById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update payment status to refunded
        order.payment.status = 'refunded';

        // In a real implementation, we would update the Payment model
        // For now, we'll just send a success response
        res.json({
            message: 'Refund processed successfully',
            payment: {
                id: order.id,
                refundAmount,
                refundReason,
                paymentStatus: 'refunded'
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;