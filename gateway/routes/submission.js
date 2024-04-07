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

/**
 * @swagger
 * tags:
 *   name: Submission Images
 *   description: API endpoints for submission images
 */

/**
 * @swagger
 * /submission-images/{id}:
 *   get:
 *     summary: Get submission image by ID
 *     description: Retrieve a submission image by its ID
 *     tags: [Submission Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the submission image
 *     responses:
 *       '200':
 *         description: Successful response with the submission image
 *       '500':
 *         description: Internal server error
 */
const findBreaker = new CircuitBreaker(submissionImageService.find, options);
router.get('/:id', async (req, res) => {
    findBreaker.fire(req.params.id)
        .then(response => {
            res.type(response.headers['content-type']).send(response.data)
        }).catch(e => {
        res.status(500).json({error: 'Failed to fetch data'});
    })
})

/**
 * @swagger
 * /submission-images:
 *   post:
 *     summary: Upload a new submission image
 *     description: Upload a new submission image with the provided image file and user ID
 *     tags: [Submission Images]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         required: true
 *         type: file
 *         description: The image file to upload
 *       - in: formData
 *         name: userId
 *         required: true
 *         type: string
 *         description: The ID of the user associated with the submission
 *       - in: formData
 *         name: competitionId
 *         required: true
 *         type: string
 *         description: The ID of the competition associated with the submission
 *     responses:
 *       '200':
 *         description: Successful response with details of the uploaded image
 *       '500':
 *         description: Internal server error
 */
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
