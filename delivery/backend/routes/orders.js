const express = require('express');
const db = require('../utils/inMemoryDB');
const { auth, adminAuth, ownerAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/orders - Get user's orders
router.get('/', auth, async (req, res) => {
    try {
        const orders = db.findOrdersByUserId(req.user.id);
        // Sort by createdAt descending
        orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/orders/:id - Get order details
router.get('/:id', auth, async (req, res) => {
    try {
        const order = db.findOrderById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if order belongs to user
        if (order.userId != req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/orders - Create order (checkout)
router.post('/', auth, async (req, res) => {
    try {
        const { address, paymentMethod } = req.body;

        // Get user's cart
        let cart = db.findCartByUserId(req.user.id);
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Get restaurant from first item
        const firstItem = cart.items[0];
        const menuItem = db.findItemById(firstItem.menuItemId);
        if (!menuItem) {
            return res.status(400).json({ message: 'Menu item not found' });
        }

        const restaurant = db.findRestaurantById(menuItem.restaurantId);
        if (!restaurant) {
            return res.status(400).json({ message: 'Restaurant not found' });
        }

        // Create order items from cart items
        const orderItems = cart.items.map(item => {
            const menuItem = db.findItemById(item.menuItemId);
            return {
                id: db.generateId(),
                menuItemId: item.menuItemId,
                name: menuItem.name,
                qty: item.qty,
                price: item.price,
                addons: item.addons || []
            };
        });

        // Calculate total
        const total = cart.subtotal; // In a real app, you would add delivery fees, taxes, etc.

        // Create order
        const order = db.createOrder({
            userId: req.user.id,
            restaurantId: restaurant.id,
            items: orderItems,
            total,
            address,
            payment: {
                method: paymentMethod,
                status: paymentMethod === 'cash' ? 'completed' : 'pending'
            },
            statusHistory: [{ status: 'placed', timestamp: new Date().toISOString() }],
            currentStatus: 'placed',
            createdAt: new Date().toISOString()
        });

        // Clear cart
        cart.items = [];
        cart.subtotal = 0;
        db.updateCart(cart.id, cart);

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT /api/orders/:id/status - Update order status (admin/restaurant owner)
router.put('/:id/status', auth, ownerAuth, async (req, res) => {
    try {
        const { status } = req.body;

        const order = db.findOrderById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is owner of restaurant or admin
        const restaurant = db.findRestaurantById(order.restaurantId);
        if (req.user.role !== 'admin' && restaurant.ownerId != req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Add to status history
        order.statusHistory.push({ status, timestamp: new Date().toISOString() });
        order.currentStatus = status;

        // Update order in database
        db.updateOrder(order.id, order);

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;