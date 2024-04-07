const express = require('express')
const router = new express.Router()
const CircuitBreaker = require('opossum')
const submissionImageService = require('../services/SubmissionImageService')
const options = {
    timeout: 5000,
    errorThresholdPercentage: 50
}

const multer = require('multer')
const upload = multer()

const findBreaker = new CircuitBreaker(submissionImageService.find, options);
router.get('/:id', async (req, res) => {
    findBreaker.fire(req.params.id)
        .then(response => {
            res.type(response.headers['content-type']).send(response.data)
        }).catch(e => {
        res.status(500).json({error: 'Failed to fetch data'});
    })
})

const postBreaker = new CircuitBreaker(submissionImageService.create, options);
router.post('/', upload.single('image'), async (request, response) => {
    postBreaker.fire(request.file, request.body.userId, request.body.competitionId)
        .then(result => {
            response.send(result)
        }).catch(e => {
        response.status(500).json({error: 'Failed to fetch data'});
    })
})


module.exports = router
