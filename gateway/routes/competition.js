const express = require('express')
const router = new express.Router()
const CircuitBreaker = require('opossum')
const competitionService = require('../services/CompetitionService')
const {response} = require("express");
const options = {
    timeout: 5000,
    errorThresholdPercentage: 50
}

const findBreaker = new CircuitBreaker(competitionService.find, options);
router.get('/:id', async (req, res) => {
    try {
        const result = await findBreaker.fire(req.params.id)

        res.send(result)
    }catch (_) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
})

const scoresBreaker = new CircuitBreaker(competitionService.getScores, options);
router.get('/:id/scores', async (request, response) => {
    try {
        const result = await scoresBreaker.fire(request.params.id)

        response.send(result)
    }catch (_) {
        response.status(500).json({ error: 'Failed to fetch data' });
    }
})

const postBreaker = new CircuitBreaker(competitionService.createCompetition, options);
router.post('/', async (request, response) => {
    try {
        const result = await postBreaker.fire(request.body.userId, request.body.title)

        response.send(result)
    }catch (_) {
        response.status(500).json({ error: 'Failed to fetch data' });
    }
})


module.exports = router