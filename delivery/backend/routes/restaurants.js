const express = require('express');
const db = require('../utils/inMemoryDB');
const { auth, adminAuth, ownerAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/restaurants - Get restaurants with filters
router.get('/', async (req, res) => {
    try {
        const {
            q, // search query
            cuisine,
            minRating,
            sort = 'rating',
            page = 1,
            limit = 10
        } = req.query;

        // Get all restaurants
        let restaurants = db.findAllRestaurants();

        // Apply filters
        if (q) {
            restaurants = restaurants.filter(restaurant =>
                restaurant.name.toLowerCase().includes(q.toLowerCase()) ||
                (restaurant.description && restaurant.description.toLowerCase().includes(q.toLowerCase()))
            );
        }

        if (cuisine) {
            restaurants = restaurants.filter(restaurant =>
                restaurant.cuisine && restaurant.cuisine.includes(cuisine)
            );
        }

        if (minRating) {
            restaurants = restaurants.filter(restaurant =>
                restaurant.rating >= parseFloat(minRating)
            );
        }

        // Sorting
        if (sort === 'rating') {
            restaurants.sort((a, b) => b.rating - a.rating);
        } else if (sort === 'deliveryTime') {
            restaurants.sort((a, b) => a.avgDeliveryTime - b.avgDeliveryTime);
        } else {
            restaurants.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const paginatedRestaurants = restaurants.slice(skip, skip + parseInt(limit));

        res.json({
            restaurants: paginatedRestaurants,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: restaurants.length,
                pages: Math.ceil(restaurants.length / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/restaurants/:id - Get restaurant details
router.get('/:id', async (req, res) => {
    try {
        const restaurant = db.findRestaurantById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Get menu categories for this restaurant
        const categories = db.findCategoriesByRestaurantId(restaurant.id);

        // Get menu items for this restaurant
        const menuItems = db.findItemsByRestaurantId(restaurant.id);

        // Group menu items by category
        const menu = categories.map(category => ({
            category: category.name,
            items: menuItems.filter(item => item.categoryId == category.id)
        }));

        res.json({
            restaurant,
            menu
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/restaurants - Create restaurant (admin/owner only)
router.post('/', auth, adminAuth, async (req, res) => {
    try {
        const restaurantData = {
            ...req.body,
            ownerId: req.user.id,
            createdAt: new Date().toISOString()
        };

        const restaurant = db.createRestaurant(restaurantData);
        res.status(201).json(restaurant);
    } catch (error) {
        res.status(400).json({ message: 'Bad request', error: error.message });
    }
});

// PUT /api/restaurants/:id - Update restaurant (admin/owner only)
router.put('/:id', auth, ownerAuth, async (req, res) => {
    try {
        const restaurant = db.findRestaurantById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Check if user is owner or admin
        if (req.user.role !== 'admin' && restaurant.ownerId != req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Update restaurant
        Object.assign(restaurant, req.body);
        res.json(restaurant);
    } catch (error) {
        res.status(400).json({ message: 'Bad request', error: error.message });
    }
});

// DELETE /api/restaurants/:id - Delete restaurant (admin/owner only)
router.delete('/:id', auth, ownerAuth, async (req, res) => {
    try {
        const restaurant = db.findRestaurantById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Check if user is owner or admin
        if (req.user.role !== 'admin' && restaurant.ownerId != req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Remove restaurant from database
        db.data.restaurants = db.data.restaurants.filter(r => r.id != req.params.id);
        res.json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;