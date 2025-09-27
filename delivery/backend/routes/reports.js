const express = require('express');
const db = require('../utils/inMemoryDB');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/reports/sales - Get sales report
router.get('/sales', auth, adminAuth, async (req, res) => {
    try {
        const {
            period = 'monthly',
            startDate,
            endDate
        } = req.query;

        // Get orders within date range
        let orders = [...db.data.orders];

        if (startDate) {
            const start = new Date(startDate);
            orders = orders.filter(order => new Date(order.createdAt) >= start);
        }

        if (endDate) {
            const end = new Date(endDate);
            orders = orders.filter(order => new Date(order.createdAt) <= end);
        }

        // Generate sales data based on period
        let salesData = [];
        let totalRevenue = 0;
        let totalOrders = orders.length;

        if (period === 'daily') {
            // Group by day
            const dailySales = {};
            orders.forEach(order => {
                const date = new Date(order.createdAt).toISOString().split('T')[0];
                if (!dailySales[date]) {
                    dailySales[date] = { date, orders: 0, revenue: 0 };
                }
                dailySales[date].orders += 1;
                dailySales[date].revenue += order.total;
                totalRevenue += order.total;
            });
            salesData = Object.values(dailySales);
        } else if (period === 'weekly') {
            // Group by week
            const weeklySales = {};
            orders.forEach(order => {
                const orderDate = new Date(order.createdAt);
                const weekStart = new Date(orderDate);
                weekStart.setDate(orderDate.getDate() - orderDate.getDay());
                const weekKey = weekStart.toISOString().split('T')[0];

                if (!weeklySales[weekKey]) {
                    weeklySales[weekKey] = { week: weekKey, orders: 0, revenue: 0 };
                }
                weeklySales[weekKey].orders += 1;
                weeklySales[weekKey].revenue += order.total;
                totalRevenue += order.total;
            });
            salesData = Object.values(weeklySales);
        } else {
            // Group by month (default)
            const monthlySales = {};
            orders.forEach(order => {
                const date = new Date(order.createdAt);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                if (!monthlySales[monthKey]) {
                    monthlySales[monthKey] = { month: monthKey, orders: 0, revenue: 0 };
                }
                monthlySales[monthKey].orders += 1;
                monthlySales[monthKey].revenue += order.total;
                totalRevenue += order.total;
            });
            salesData = Object.values(monthlySales);
        }

        res.json({
            report: {
                type: 'sales',
                period,
                startDate,
                endDate,
                totalRevenue,
                totalOrders,
                averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
                data: salesData
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/reports/restaurants - Get restaurant performance report
router.get('/restaurants', auth, adminAuth, async (req, res) => {
    try {
        const {
            sort = 'revenue',
            limit = 10
        } = req.query;

        // Calculate restaurant performance
        const restaurantPerformance = {};

        // Get all restaurants
        const restaurants = db.findAllRestaurants();

        // Initialize performance data for each restaurant
        restaurants.forEach(restaurant => {
            restaurantPerformance[restaurant.id] = {
                restaurantId: restaurant.id,
                name: restaurant.name,
                orders: 0,
                revenue: 0,
                averageRating: restaurant.rating || 0
            };
        });

        // Calculate orders and revenue for each restaurant
        db.data.orders.forEach(order => {
            if (restaurantPerformance[order.restaurantId]) {
                restaurantPerformance[order.restaurantId].orders += 1;
                restaurantPerformance[order.restaurantId].revenue += order.total;
            }
        });

        // Convert to array and sort
        let performanceData = Object.values(restaurantPerformance);

        if (sort === 'orders') {
            performanceData.sort((a, b) => b.orders - a.orders);
        } else if (sort === 'rating') {
            performanceData.sort((a, b) => b.averageRating - a.averageRating);
        } else {
            performanceData.sort((a, b) => b.revenue - a.revenue);
        }

        // Apply limit
        performanceData = performanceData.slice(0, parseInt(limit));

        res.json({
            report: {
                type: 'restaurants',
                sortBy: sort,
                data: performanceData
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/reports/customers - Get customer insights report
router.get('/customers', auth, adminAuth, async (req, res) => {
    try {
        const {
            sort = 'orders',
            limit = 10
        } = req.query;

        // Calculate customer insights
        const customerInsights = {};

        // Get all customers (users with role 'user')
        const customers = db.data.users.filter(user => user.role === 'user');

        // Initialize insights data for each customer
        customers.forEach(customer => {
            customerInsights[customer.id] = {
                customerId: customer.id,
                name: customer.name,
                email: customer.email,
                totalOrders: 0,
                totalSpent: 0,
                averageOrderValue: 0,
                favoriteCuisine: 'Unknown'
            };
        });

        // Calculate orders and spending for each customer
        db.data.orders.forEach(order => {
            if (customerInsights[order.userId]) {
                customerInsights[order.userId].totalOrders += 1;
                customerInsights[order.userId].totalSpent += order.total;
            }
        });

        // Calculate average order value
        Object.values(customerInsights).forEach(customer => {
            if (customer.totalOrders > 0) {
                customer.averageOrderValue = customer.totalSpent / customer.totalOrders;
            }
        });

        // Convert to array and sort
        let insightsData = Object.values(customerInsights);

        if (sort === 'spent') {
            insightsData.sort((a, b) => b.totalSpent - a.totalSpent);
        } else if (sort === 'value') {
            insightsData.sort((a, b) => b.averageOrderValue - a.averageOrderValue);
        } else {
            insightsData.sort((a, b) => b.totalOrders - a.totalOrders);
        }

        // Apply limit
        insightsData = insightsData.slice(0, parseInt(limit));

        res.json({
            report: {
                type: 'customers',
                sortBy: sort,
                data: insightsData
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/reports/delivery - Get delivery performance report
router.get('/delivery', auth, adminAuth, async (req, res) => {
    try {
        // Calculate delivery performance
        const deliveryPerformance = {};

        // Get all delivery partners (users with role 'delivery')
        const deliveryPartners = db.data.users.filter(user => user.role === 'delivery');

        // Initialize performance data for each delivery partner
        deliveryPartners.forEach(partner => {
            deliveryPerformance[partner.id] = {
                partnerId: partner.id,
                name: partner.name,
                totalDeliveries: 0,
                onTimeDeliveries: 0,
                lateDeliveries: 0,
                averageRating: partner.rating || 0,
                totalEarnings: 0
            };
        });

        // Calculate deliveries for each partner
        db.data.orders.forEach(order => {
            if (order.deliveryPartnerId && deliveryPerformance[order.deliveryPartnerId]) {
                deliveryPerformance[order.deliveryPartnerId].totalDeliveries += 1;

                // Simulate on-time delivery (80% chance)
                if (Math.random() > 0.2) {
                    deliveryPerformance[order.deliveryPartnerId].onTimeDeliveries += 1;
                } else {
                    deliveryPerformance[order.deliveryPartnerId].lateDeliveries += 1;
                }

                // Simulate earnings (10% of order value)
                deliveryPerformance[order.deliveryPartnerId].totalEarnings += order.total * 0.1;
            }
        });

        // Calculate on-time delivery percentage
        Object.values(deliveryPerformance).forEach(partner => {
            if (partner.totalDeliveries > 0) {
                partner.onTimePercentage = (partner.onTimeDeliveries / partner.totalDeliveries) * 100;
            } else {
                partner.onTimePercentage = 0;
            }
        });

        // Convert to array and sort by total deliveries
        const performanceData = Object.values(deliveryPerformance)
            .sort((a, b) => b.totalDeliveries - a.totalDeliveries);

        res.json({
            report: {
                type: 'delivery',
                data: performanceData
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;