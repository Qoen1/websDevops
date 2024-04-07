const express = require('express');
const router = express.Router();
const AuthService = require('../services/authService');
const jwt = require("jsonwebtoken");
//KeyCloak is an alternative

router.post('/register', async (req, res) => {
    const authService = new AuthService();
    const { username, password, role } = req.body;
    try {
        const result = await authService.register(username, password, role);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const authService = new AuthService();
    const { username, password } = req.body;
    try {
        const result = await authService.login(username, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

router.post('/check', async (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(200).json({ authenticated: false });
    }

    jwt.verify(token, 'secret', (err, decodedToken) => {
        if (err) {
            return res.status(200).json({ authenticated: false });
        }
        req.decodedToken = decodedToken;
        res.send({authenticated: true})
    })
})

router.get('/user/:userId/role', async (req, res) => {
    const authService = new AuthService();
    try {
        const userId = req.params.userId;
        const result = await authService.getUserRole(userId);
        if (result.status === 200) {
            res.status(200).json({ role: result.role });
        } else {
            res.status(result.status).json({ error: result.message });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;
