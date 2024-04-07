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

/**
 * @swagger
 * tags:
 *   name: Target Images
 *   description: API endpoints for target images
 */

/**
 * @swagger
 * /target-images/{id}:
 *   get:
 *     summary: Get target image by ID
 *     description: Retrieve a target image by its ID
 *     tags: [Target Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the target image
 *     responses:
 *       '200':
 *         description: Successful response with the target image
 *       '500':
 *         description: Internal server error
 */
const findBreaker = new CircuitBreaker(targetImageService.find, options);
router.get('/:id', async (req, res) => {
    try {
        const result = await findBreaker.fire(req.params.id)

        res.type(result.headers['content-type']).send(result.data)
    }catch (_) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
})

/**
 * @swagger
 * /target-images:
 *   post:
 *     summary: Upload a new target image
 *     description: Upload a new target image with the provided image file and user ID
 *     tags: [Target Images]
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
 *         description: The ID of the user associated with the target image
 *       - in: formData
 *         name: competitionId
 *         required: true
 *         type: string
 *         description: The ID of the competition associated with the target image
 *     responses:
 *       '200':
 *         description: Successful response with details of the uploaded image
 *       '500':
 *         description: Internal server error
 */
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
