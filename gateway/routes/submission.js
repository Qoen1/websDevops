const express = require('express')
const router = new express.Router()
const CircuitBreaker = require('opossum')
const submissionImageService = require('../services/SubmissionImageService')
const options = {
    timeout: 5000,
    errorThresholdPercentage: 50
}

const findBreaker = new CircuitBreaker(submissionImageService.find, options);
router.get('/:id', async (req, res) => {
    try {
        const result = await findBreaker.fire(req.params.id)

        res.send(result)
    }catch (_) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
})

const postBreaker = new CircuitBreaker(submissionImageService.create, options);
router.post('/', async (request, response) => {
    try {
        const result = await postBreaker.fire(request.body.userId, request.body.title)

        response.send(result)
    }catch (_) {
        response.status(500).json({ error: 'Failed to fetch data' });
    }
})


module.exports = router