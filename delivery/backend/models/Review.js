const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 500
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    isFake: {
        type: Boolean,
        default: false
    },
    helpfulCount: {
        type: Number,
        default: 0
    },
    reportedCount: {
        type: Number,
        default: 0
    },
    images: [{
        type: String // URLs to review images
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
reviewSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Ensure a user can only review an order once
reviewSchema.index({ userId: 1, orderId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);