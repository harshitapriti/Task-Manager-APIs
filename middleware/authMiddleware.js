const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {JWT_SECRET} = require('../config');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if(!token) {
        return res.status(401).json({message: 'No token provided'});
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Token verification failed' });
    }
};

module.exports = authMiddleware;