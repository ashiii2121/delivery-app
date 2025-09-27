const mongoose = require('mongoose');

const menuCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MenuCategory', menuCategorySchema);