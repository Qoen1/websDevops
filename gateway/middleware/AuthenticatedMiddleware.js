const {response} = require("express");
const authService = require('../services/AuthService')
const CircuitBreaker = require("opossum");
const options = {
    timeout: 5000,
    errorThresholdPercentage: 50
}

const checkBreaker = new CircuitBreaker((token) => authService.checkToken(token), options);
function authenticateToken(req, res, next) {
    checkBreaker.fire(req.headers.authorization).then(result => {
        if(result){
            next()
        }else{
            return res.status(401).json({ error: 'Unauthorized - No valid token provided' });
        }
    }).catch(e => {
        return res.status(500).json({ error: 'Authorization service is down' });
    })
}

module.exports = authenticateToken;
