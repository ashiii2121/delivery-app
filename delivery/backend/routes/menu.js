const express = require('express');
const db = require('../utils/inMemoryDB');
const { auth, adminAuth, ownerAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/menu/categories - Get all categories
router.get('/categories', async (req, res) => {
    try {
        const categories = db.data.menuCategories;
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/menu/categories - Create category (admin/owner only)
router.post('/categories', auth, ownerAuth, async (req, res) => {
    try {
        const category = db.createMenuCategory(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: 'Bad request', error: error.message });
    }
});

// GET /api/menu/items - Get all menu items with filters
router.get('/items', async (req, res) => {
    try {
        console.log('Menu items in database:', db.data.menuItems);
        const { categoryId, restaurantId } = req.query;

        let items = db.data.menuItems;

        if (categoryId) {
            items = items.filter(item => item.categoryId == categoryId);
        }

        if (restaurantId) {
            items = items.filter(item => item.restaurantId == restaurantId);
        }

        console.log('Returning menu items:', items);
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/menu/items - Create menu item (admin/owner only)
router.post('/items', auth, ownerAuth, async (req, res) => {
    try {
        const item = db.createMenuItem(req.body);
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: 'Bad request', error: error.message });
    }
});

// PUT /api/menu/items/:id - Update menu item (admin/owner only)
router.put('/items/:id', auth, ownerAuth, async (req, res) => {
    try {
        const item = db.findItemById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        Object.assign(item, req.body);
        res.json(item);
    } catch (error) {
        res.status(400).json({ message: 'Bad request', error: error.message });
    }
});

// DELETE /api/menu/items/:id - Delete menu item (admin/owner only)
router.delete('/items/:id', auth, ownerAuth, async (req, res) => {
    try {
        const item = db.findItemById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        // Remove item from database
        db.data.menuItems = db.data.menuItems.filter(i => i.id != req.params.id);
        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;