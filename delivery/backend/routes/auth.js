const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../utils/inMemoryDB');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'zomato-secret-key', {
        expiresIn: '7d'
    });
};

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user already exists
        const existingUser = db.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create new user
        const user = db.createUser({
            name,
            email,
            passwordHash,
            phone,
            role: 'user'
        });

        // Generate token
        const token = generateToken(user.id);

        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = db.findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user.id);

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get current user
router.get('/me', auth, async (req, res) => {
    res.json({
        user: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    });
});

module.exports = router;