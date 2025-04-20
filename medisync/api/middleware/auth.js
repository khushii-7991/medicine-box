// middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            console.log('No Authorization header found');
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // Extract token from Bearer format
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7) 
            : authHeader;

        if (!token) {
            console.log('No token found in Authorization header');
            return res.status(401).json({ message: 'Invalid token format' });
        }

        console.log('Processing token:', token.substring(0, 20) + '...');
        const decoded = jwt.verify(token, 'your_jwt_secret');
        console.log('Decoded token:', JSON.stringify(decoded));

        // Make sure user object has the expected structure
        if (!decoded.id) {
            console.log('Token missing id field:', decoded);
            return res.status(401).json({ message: 'Invalid token structure' });
        }

        req.user = decoded;
        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = auth;
