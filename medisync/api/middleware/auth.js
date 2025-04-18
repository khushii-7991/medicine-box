// middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // Extract token from Bearer format
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7) 
            : authHeader;

        if (!token) {
            return res.status(401).json({ message: 'Invalid token format' });
        }

        console.log('Processing token:', token);
        const decoded = jwt.verify(token, 'your_jwt_secret');
        console.log('Decoded token:', decoded);

        req.user = decoded;
        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = auth;
