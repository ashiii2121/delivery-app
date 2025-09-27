const express = require('express');
const db = require('../utils/inMemoryDB');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET /api/cart - Get user's cart
router.get('/', auth, async (req, res) => {
    try {
        let cart = db.findCartByUserId(req.user.id);

        if (!cart) {
            cart = db.createCart({ userId: req.user.id, items: [], subtotal: 0 });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/cart - Add item to cart
router.post('/', auth, async (req, res) => {
    try {
        const { menuItemId, qty = 1, addons = [] } = req.body;

        // Validate menu item exists
        const menuItem = db.findItemById(menuItemId);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        // Find or create cart
        let cart = db.findCartByUserId(req.user.id);
        if (!cart) {
            cart = db.createCart({ userId: req.user.id, items: [], subtotal: 0 });
        }

        // Check if item already in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.menuItemId == menuItemId
        );

        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].qty += qty;
        } else {
            // Add new item
            cart.items.push({
                id: db.generateId(),
                menuItemId,
                qty,
                price: menuItem.price,
                addons
            });
        }

        // Calculate subtotal
        cart.subtotal = cart.items.reduce(
            (sum, item) => sum + (item.price * item.qty), 0
        );

        // Update cart in database
        db.updateCart(cart.id, cart);

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT /api/cart/items/:id - Update item quantity
router.put('/items/:id', auth, async (req, res) => {
    try {
        const { qty } = req.body;

        const cart = db.findCartByUserId(req.user.id);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(
            item => item.id == req.params.id
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        if (qty <= 0) {
            // Remove item if qty is 0 or less
            cart.items.splice(itemIndex, 1);
        } else {
            // Update quantity
            cart.items[itemIndex].qty = qty;
        }

        // Recalculate subtotal
        cart.subtotal = cart.items.reduce(
            (sum, item) => sum + (item.price * item.qty), 0
        );

        // Update cart in database
        db.updateCart(cart.id, cart);

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/cart/items/:id - Remove item from cart
router.delete('/items/:id', auth, async (req, res) => {
    try {
        const cart = db.findCartByUserId(req.user.id);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(
            item => item.id == req.params.id
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cart.items.splice(itemIndex, 1);

        // Recalculate subtotal
        cart.subtotal = cart.items.reduce(
            (sum, item) => sum + (item.price * item.qty), 0
        );

        // Update cart in database
        db.updateCart(cart.id, cart);

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/cart - Clear cart
router.delete('/', auth, async (req, res) => {
    try {
        const cart = db.findCartByUserId(req.user.id);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        cart.subtotal = 0;

        // Update cart in database
        db.updateCart(cart.id, cart);

        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;