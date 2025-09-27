const express = require('express');
const db = require('../utils/inMemoryDB');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/orders - Get all orders for admin
router.get('/orders', auth, adminAuth, async (req, res) => {
    try {
        // Get all orders
        const orders = [...db.data.orders]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Add user and restaurant details to orders
        const ordersWithDetails = orders.map(order => {
            const user = db.findUserById(order.userId);
            const restaurant = db.findRestaurantById(order.restaurantId);

            return {
                ...order,
                user: user ? { id: user.id, name: user.name } : null,
                restaurant: restaurant ? { id: restaurant.id, name: restaurant.name } : null
            };
        });

        res.json(ordersWithDetails);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/admin/stats - Get admin dashboard stats
router.get('/stats', auth, adminAuth, async (req, res) => {
    try {
        const userCount = db.data.users.length;
        const restaurantCount = db.data.restaurants.length;
        const orderCount = db.data.orders.length;

        // Get recent orders (last 10)
        const recentOrders = [...db.data.orders]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10);

        // Add user and restaurant names to orders
        const recentOrdersWithDetails = recentOrders.map(order => {
            const user = db.findUserById(order.userId);
            const restaurant = db.findRestaurantById(order.restaurantId);

            return {
                id: order.id,
                userId: order.userId,
                restaurantId: order.restaurantId,
                items: order.items,
                total: order.total,
                status: order.status,
                currentStatus: order.currentStatus,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                user: user ? { id: user.id, name: user.name } : null,
                restaurant: restaurant ? { id: restaurant.id, name: restaurant.name } : null
            };
        });

        res.json({
            stats: {
                users: userCount,
                restaurants: restaurantCount,
                orders: orderCount
            },
            recentOrders: recentOrdersWithDetails
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/admin/users - Get all users
router.get('/users', auth, adminAuth, async (req, res) => {
    try {
        // Remove passwordHash from users
        const users = db.data.users.map(user => {
            const { passwordHash, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT /api/admin/users/:id/role - Update user role
router.put('/users/:id/role', auth, adminAuth, async (req, res) => {
    try {
        const { role } = req.body;

        const user = db.findUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;

        // Remove passwordHash before returning
        const { passwordHash, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;