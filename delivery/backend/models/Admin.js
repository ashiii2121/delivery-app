const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['super-admin', 'admin', 'staff', 'finance', 'support'],
        default: 'admin'
    },
    permissions: [{
        type: String,
        enum: [
            'dashboard:view',
            'restaurants:manage',
            'meals:manage',
            'customers:manage',
            'delivery-partners:manage',
            'orders:manage',
            'payments:manage',
            'reviews:manage',
            'promotions:manage',
            'reports:view',
            'settings:manage'
        ]
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
adminSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Admin', adminSchema);