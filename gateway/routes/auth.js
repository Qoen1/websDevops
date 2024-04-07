const express = require('express')
const router = new express.Router()
const CircuitBreaker = require('opossum')
const authService = require('../services/AuthService')
const options = {
    timeout: 5000,
    errorThresholdPercentage: 50
}

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate user
 *     tags:
 *       - Authentication
 *     description: Authenticate user with username and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful authentication
 *       '500':
 *         description: Internal server error
 */
const loginBreaker = new CircuitBreaker(authService.login, options);
router.post('/login', async (req, res) => {
    try {
        const result = await loginBreaker.fire(req.body.username, req.body.password)
        
        res.send(result)
    }catch (_) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
})

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 * /register:
 *   post:
 *     summary: Register user
 *     tags:
 *       - Authentication
 *     description: Register user with username, password, and role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User registration successful
 *       '500':
 *         description: Internal server error
 */
const registerBreaker = new CircuitBreaker(authService.register, options);
router.post('/register', async (req, res) => {
    try {
        let result = await registerBreaker.fire(req.body.username, req.body.password, req.body.role)
        
        res.send(result)
    }catch (_) {
        console.log(_)
        res.status(500).json({ error: 'Failed to fetch data' });
    }
})

const checkBreaker = new CircuitBreaker(authService.checkToken, options);
router.post('/checkToken', async (req, res) => {
    try {
        console.log(req.headers.authorization)
        let result = await checkBreaker.fire(req.headers.authorization)

        res.send(result)
    }catch (_) {
        console.log(_)
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

module.exports = router;