const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    jwt.verify(token, 'secret', (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized - Invalid token' });
        }
        req.decodedToken = decodedToken;
        next();
    });
}

module.exports = authenticateToken;