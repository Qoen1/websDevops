const {response} = require("express");
const authService = require('../services/AuthService')

function authenticateToken(req, res, next) {
    authService.checkToken(req.headers.authorization).then(response  => {
        if (response){
            next()
        }else{
            return res.status(401).json({ error: 'Unauthorized - No valid token provided' });
        }
    })
}

module.exports = authenticateToken;