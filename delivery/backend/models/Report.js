const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['sales', 'customer', 'delivery', 'restaurant'],
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    data: {
        type: Object // Store report data as JSON
    },
    filters: {
        type: Object // Store filters used to generate report
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    format: {
        type: String,
        enum: ['pdf', 'csv', 'json', 'xlsx'],
        default: 'json'
    },
    filePath: {
        type: String, // Path to stored report file
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

// Update timestamp on save
reportSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Report', reportSchema);