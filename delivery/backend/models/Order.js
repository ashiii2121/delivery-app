const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['placed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const orderItemSchema = new mongoose.Schema({
    menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    },
    addons: [{
        name: String,
        price: Number
    }]
});

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    items: [orderItemSchema],
    total: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    payment: {
        method: {
            type: String,
            enum: ['card', 'cash'],
            required: true
        },
        transactionId: String,
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending'
        }
    },
    statusHistory: [statusHistorySchema],
    currentStatus: {
        type: String,
        enum: ['placed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
        default: 'placed'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);