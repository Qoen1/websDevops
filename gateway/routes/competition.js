const express = require('express')
const router = new express.Router()
const CircuitBreaker = require('opossum')
const competitionService = require('../services/CompetitionService')
const {response} = require("express");
const options = {
    timeout: 5000,
    errorThresholdPercentage: 50
}

/**
 * @swagger
 * tags:
 *   name: Competitions
 *   description: API endpoints for competitions
 */

/**
 * @swagger
 * /competitions/{id}:
 *   get:
 *     summary: Get competition by ID
 *     description: Retrieve competition details by its ID
 *     tags: [Competitions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the competition
 *     responses:
 *       '200':
 *         description: Successful response with competition details
 *       '500':
 *         description: Internal server error
 */
const findBreaker = new CircuitBreaker(competitionService.find, options);
router.get('/:id', async (req, res) => {
    try {
        const result = await findBreaker.fire(req.params.id)

        res.send(result)
    }catch (_) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
})

/**
 * @swagger
 * /competitions/{id}/scores:
 *   get:
 *     summary: Get scores for a competition
 *     description: Retrieve scores for a competition by its ID
 *     tags: [Competitions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the competition
 *     responses:
 *       '200':
 *         description: Successful response with scores
 *       '500':
 *         description: Internal server error
 */
const scoresBreaker = new CircuitBreaker(competitionService.getScores, options);
router.get('/:id/scores', async (request, response) => {
    try {
        const result = await scoresBreaker.fire(request.params.id)

        response.send(result)
    }catch (_) {
        response.status(500).json({ error: 'Failed to fetch data' });
    }
})

/**
 * @swagger
 * /competitions:
 *   post:
 *     summary: Create a new competition
 *     description: Create a new competition with the provided user ID and title
 *     tags: [Competitions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               title:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful response with competition details
 *       '500':
 *         description: Internal server error
 */
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