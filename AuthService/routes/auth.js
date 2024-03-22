const express = require('express');
const router = express.Router();
const AuthService = require('../services/authService');
//KeyCloak is an alternative

const authService = new AuthService();

router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const result = await authService.register(username, password, role);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await authService.login(username, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

module.exports = router;
