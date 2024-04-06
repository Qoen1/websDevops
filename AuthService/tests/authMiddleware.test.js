const authenticateToken = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');

describe('authenticateToken', () => {
    let req, res, next;

    beforeEach(() => {
        req = { headers: { authorization: 'Bearer validToken' } };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
    });

    it('should pass if a valid token is provided', () => {
        jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
            callback(null, { userId: 'validUserId' });
        });

        authenticateToken(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should return 401 if no token is provided', () => {
        req.headers.authorization = undefined;

        authenticateToken(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized - No token provided' });
    });

    it('should return 401 if an invalid token is provided', () => {
        jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
            callback(new Error('Invalid token'));
        });

        authenticateToken(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized - Invalid token' });
    });
});
