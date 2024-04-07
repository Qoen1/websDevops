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
    loginBreaker.fire(req.body.username, req.body.password)
        .catch((e) => {
            res.status(500).json({error: 'Failed to fetch data'});
        }).then(result => {
        res.send(result)
    })
})

const registerBreaker = new CircuitBreaker(authService.register, options);
router.post('/register', async (req, res) => {
    registerBreaker.fire(req.body.username, req.body.password, req.body.role)
        .catch((e) => {
            res.status(500).json({error: 'Failed to fetch data'});
        }).then(result => {
        res.send(result)
    })
})

const checkBreaker = new CircuitBreaker((token) => authService.checkToken(token), options);
router.post('/checkToken', async (req, res) => {
    checkBreaker.fire(req.headers.authorization)
        .catch((e) => {
            res.status(500).json({error: 'Failed to fetch data'});
        }).then(result => {
        res.send(result)
    })
})


module.exports = router
