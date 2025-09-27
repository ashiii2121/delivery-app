const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    value: {
        type: Object // Store setting value as JSON
    },
    type: {
        type: String,
        enum: ['string', 'number', 'boolean', 'object', 'array'],
        default: 'string'
    },
    category: {
        type: String,
        enum: ['general', 'delivery', 'payment', 'notifications', 'taxes'],
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
settingsSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Settings', settingsSchema);