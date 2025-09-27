const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Seed database on startup if needed
const seedDatabase = require('./seed');

const authRoutes = require('./routes/auth');
const restaurantRoutes = require('./routes/restaurants');
const menuRoutes = require('./routes/menu');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const customerRoutes = require('./routes/customers');
const deliveryPartnerRoutes = require('./routes/deliveryPartners');
const paymentRoutes = require('./routes/payments');
const reviewRoutes = require('./routes/reviews');
const promotionRoutes = require('./routes/promotions');
const reportRoutes = require('./routes/reports');
const settingsRoutes = require('./routes/settings');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Zomato backend is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/delivery-partners', deliveryPartnerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);

const PORT = process.env.PORT || 5000;

// Seed database on startup
seedDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Error seeding database:', error);
    process.exit(1);
});