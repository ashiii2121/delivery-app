const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    veg: {
        type: Boolean,
        default: false
    },
    image: {
        type: String // URL to image
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuCategory',
        required: true
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    addons: [{
        name: String,
        price: Number
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema);