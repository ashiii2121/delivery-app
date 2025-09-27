const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    addresses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    }],
    isBlocked: {
        type: Boolean,
        default: false
    },
    totalOrders: {
        type: Number,
        default: 0
    },
    totalSpent: {
        type: Number,
        default: 0
    },
    favoriteCuisines: [{
        type: String,
        trim: true
    }],
    favoriteRestaurants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
customerSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Customer', customerSchema);