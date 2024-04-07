const express = require('express')
const router = new express.Router()
const CircuitBreaker = require('opossum')
const authService = require('../services/AuthService')
const options = {
    timeout: 5000,
    errorThresholdPercentage: 50
}

const loginBreaker = new CircuitBreaker(authService.login, options);
router.post('/login', async (req, res) => {
    try {
        const result = await loginBreaker.fire(req.body.username, req.body.password)
        
        res.send(result)
    }catch (_) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
})

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
})


module.exports = router