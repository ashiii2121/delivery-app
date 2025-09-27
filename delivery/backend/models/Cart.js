const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
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

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [cartItemSchema],
    subtotal: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);