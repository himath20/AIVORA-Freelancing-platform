const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: 'Access denied. No token provided.'
        });
    }

    try {
        const actualToken = token.startsWith('Bearer ')
            ? token.split(' ')[1]
            : token;

        const verified = jwt.verify(
            actualToken,
            process.env.JWT_SECRET
        );

        req.user = verified;
        next();

    } catch (error) {
        res.status(401).json({
            message: 'Invalid or expired token.'
        });
    }
};

module.exports = { verifyToken };