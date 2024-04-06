const express = require('express')
const router = new express.Router()
const CircuitBreaker = require('opossum')
const competitionService = require('../services/CompetitionService')
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


module.exports = router