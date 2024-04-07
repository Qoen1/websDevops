const express = require('express')
const router = new express.Router()
const CircuitBreaker = require('opossum')
const targetImageService = require('../services/targetImageService')
const options = {
    timeout: 5000,
    errorThresholdPercentage: 50
}

const multer = require('multer')
const upload = multer()

const findBreaker = new CircuitBreaker(targetImageService.find, options);
router.get('/:id', async (req, res) => {
    try {
        const result = await findBreaker.fire(req.params.id)

        res.type(result.headers['content-type']).send(result.data)
    }catch (_) {
        console.error(_)
        res.status(500).json({ error: 'Failed to fetch data' });
    }
})

const postBreaker = new CircuitBreaker(targetImageService.create, options);
router.post('/', upload.single('image'), async (request, response) => {
    try {
        const result = await postBreaker.fire(request.file, request.body.userId, request.body.competitionId)

        response.send(result)
    }catch (_) {
        response.status(500).json({ error: 'Failed to fetch data' });
    }
})


module.exports = router
