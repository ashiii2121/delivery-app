const jwt = require('jsonwebtoken');
const db = require('../utils/inMemoryDB');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No authentication token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'zomato-secret-key');
        const user = db.findUserById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'Token is invalid' });
        }

        // Remove passwordHash before attaching to req
        const { passwordHash, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};

const adminAuth = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};

const ownerAuth = (req, res, next) => {
    if (req.user.role !== 'owner' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Restaurant owners only.' });
    }
    next();
};

module.exports = { auth, adminAuth, ownerAuth };