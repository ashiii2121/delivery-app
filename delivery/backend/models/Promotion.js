const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['percentage', 'fixed', 'free-delivery'],
        required: true
    },
    value: {
        type: Number,
        required: true,
        min: 0
    },
    maxDiscount: {
        type: Number,
        min: 0
    },
    minOrderValue: {
        type: Number,
        default: 0,
        min: 0
    },
    usageLimit: {
        type: Number,
        min: 0
    },
    usedCount: {
        type: Number,
        default: 0
    },
    applicableTo: {
        type: String,
        enum: ['all', 'specific-restaurants', 'specific-users'],
        default: 'all'
    },
    restaurants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    }],
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
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
promotionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Check if promotion is currently active
promotionSchema.methods.isActive = function () {
    const now = new Date();
    return this.isActive && now >= this.startDate && now <= this.endDate;
};

module.exports = mongoose.model('Promotion', promotionSchema);