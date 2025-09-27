const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
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
    deliveryPartnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryPartner'
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'INR'
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'upi', 'cash', 'wallet'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    transactionId: {
        type: String,
        trim: true
    },
    gatewayResponse: {
        type: Object
    },
    commissionRate: {
        type: Number,
        default: 0.15, // 15% commission
        min: 0,
        max: 1
    },
    commissionAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    restaurantPayout: {
        type: Number,
        default: 0,
        min: 0
    },
    deliveryPartnerPayout: {
        type: Number,
        default: 0,
        min: 0
    },
    platformEarnings: {
        type: Number,
        default: 0,
        min: 0
    },
    refundAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    refundReason: {
        type: String,
        trim: true
    },
    refundTransactionId: {
        type: String,
        trim: true
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

// Calculate payout amounts before saving
paymentSchema.pre('save', function (next) {
    this.commissionAmount = this.amount * this.commissionRate;
    this.restaurantPayout = this.amount - this.commissionAmount;
    this.deliveryPartnerPayout = this.amount * 0.1; // 10% of order amount
    this.platformEarnings = this.commissionAmount;

    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Payment', paymentSchema);