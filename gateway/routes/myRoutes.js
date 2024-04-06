const express = require('express')
const router = new express.Router()
const CircuitBreaker = require('opossum')
const authService = require('../services/AuthService')

const options = {
    timeout: 5000,
    errorThresholdPercentage: 50
}

const loginBreaker = new CircuitBreaker(authService.login, options);
router.get('/login', async (req, res) => {
    try {
        await loginBreaker.fire(req.body.username, req.body.password)
    }catch (_) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
})




module.exports = router