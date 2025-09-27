const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    vehicleType: {
        type: String,
        enum: ['bike', 'scooter', 'car', 'van'],
        required: true
    },
    vehicleNumber: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    licenseNumber: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    aadhaarNumber: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    geoLocation: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'blocked'],
        default: 'pending'
    },
    isAvailable: {
        type: Boolean,
        default: false
    },
    currentOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    totalDeliveries: {
        type: Number,
        default: 0
    },
    successfulDeliveries: {
        type: Number,
        default: 0
    },
    failedDeliveries: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    earnings: {
        type: Number,
        default: 0
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

// Hash password before saving
deliveryPartnerSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
deliveryPartnerSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Update timestamp on save
deliveryPartnerSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('DeliveryPartner', deliveryPartnerSchema);