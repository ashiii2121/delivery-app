const express = require('express');
const db = require('../utils/inMemoryDB');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/reviews - Get all reviews with filters
router.get('/', auth, adminAuth, async (req, res) => {
    try {
        const {
            q,
            rating,
            isApproved,
            isFake,
            startDate,
            endDate,
            sort = 'createdAt',
            page = 1,
            limit = 10
        } = req.query;

        // Get all reviews
        // Note: In a real implementation with MongoDB, we would query the Review collection
        // For now, we'll simulate reviews from orders
        let reviews = db.data.orders
            .filter(order => order.currentStatus === 'delivered')
            .map(order => {
                // Get user and restaurant details
                const user = db.findUserById(order.userId);
                const restaurant = db.findRestaurantById(order.restaurantId);

                return {
                    id: order.id,
                    userId: order.userId,
                    restaurantId: order.restaurantId,
                    orderId: order.id,
                    rating: Math.floor(Math.random() * 5) + 1, // Random rating 1-5
                    comment: `Great service and delicious food at ${restaurant ? restaurant.name : 'this restaurant'}.`,
                    isApproved: Math.random() > 0.2, // 80% chance of being approved
                    isFake: Math.random() > 0.95, // 5% chance of being fake
                    helpfulCount: Math.floor(Math.random() * 50),
                    reportedCount: Math.floor(Math.random() * 5),
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt,
                    user: user ? { id: user.id, name: user.name } : null,
                    restaurant: restaurant ? { id: restaurant.id, name: restaurant.name } : null
                };
            });

        // Apply filters
        if (q) {
            reviews = reviews.filter(review =>
                (review.comment && review.comment.toLowerCase().includes(q.toLowerCase())) ||
                (review.user && review.user.name.toLowerCase().includes(q.toLowerCase())) ||
                (review.restaurant && review.restaurant.name.toLowerCase().includes(q.toLowerCase()))
            );
        }

        if (rating) {
            reviews = reviews.filter(review => review.rating == rating);
        }

        if (isApproved !== undefined) {
            const approved = isApproved === 'true';
            reviews = reviews.filter(review => review.isApproved === approved);
        }

        if (isFake !== undefined) {
            const fake = isFake === 'true';
            reviews = reviews.filter(review => review.isFake === fake);
        }

        if (startDate) {
            const start = new Date(startDate);
            reviews = reviews.filter(review => new Date(review.createdAt) >= start);
        }

        if (endDate) {
            const end = new Date(endDate);
            reviews = reviews.filter(review => new Date(review.createdAt) <= end);
        }

        // Sorting
        if (sort === 'rating') {
            reviews.sort((a, b) => b.rating - a.rating);
        } else if (sort === 'helpful') {
            reviews.sort((a, b) => b.helpfulCount - a.helpfulCount);
        } else {
            reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const paginatedReviews = reviews.slice(skip, skip + parseInt(limit));

        res.json({
            reviews: paginatedReviews,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: reviews.length,
                pages: Math.ceil(reviews.length / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/reviews/:id - Get review details
router.get('/:id', auth, adminAuth, async (req, res) => {
    try {
        const order = db.findOrderById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Transform order to review object
        const user = db.findUserById(order.userId);
        const restaurant = db.findRestaurantById(order.restaurantId);

        const review = {
            id: order.id,
            userId: order.userId,
            restaurantId: order.restaurantId,
            orderId: order.id,
            rating: Math.floor(Math.random() * 5) + 1, // Random rating 1-5
            comment: `Great service and delicious food at ${restaurant ? restaurant.name : 'this restaurant'}.`,
            isApproved: Math.random() > 0.2, // 80% chance of being approved
            isFake: Math.random() > 0.95, // 5% chance of being fake
            helpfulCount: Math.floor(Math.random() * 50),
            reportedCount: Math.floor(Math.random() * 5),
            images: [], // No images in simulation
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            user: user ? { id: user.id, name: user.name, email: user.email } : null,
            restaurant: restaurant ? { id: restaurant.id, name: restaurant.name } : null
        };

        res.json({ review });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT /api/reviews/:id/approve - Approve/reject review
router.put('/:id/approve', auth, adminAuth, async (req, res) => {
    try {
        const { isApproved } = req.body;

        // In a real implementation, we would update the Review model
        // For now, we'll just send a success response
        res.json({
            message: `Review ${isApproved ? 'approved' : 'rejected'} successfully`,
            review: { id: req.params.id, isApproved }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT /api/reviews/:id/fake - Mark review as fake/real
router.put('/:id/fake', auth, adminAuth, async (req, res) => {
    try {
        const { isFake } = req.body;

        // In a real implementation, we would update the Review model
        // For now, we'll just send a success response
        res.json({
            message: `Review marked as ${isFake ? 'fake' : 'real'} successfully`,
            review: { id: req.params.id, isFake }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;