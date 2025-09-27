const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        trim: true
    },
    cuisine: [{
        type: String,
        trim: true
    }],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    avgDeliveryTime: {
        type: Number, // in minutes
    },
    costForTwo: {
        type: Number // in cents or smallest currency unit
    },
    address: {
        type: String,
        required: true
    },
    geo: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    images: [{
        type: String // URLs to images
    }],
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);