const express = require('express')
const router = new express.Router()
const MessageService = require('../services/MessageService')
const CompetitionService = require('../services/CompetitionService')

const messageService = new MessageService();
const competitionService = messageService.competitionService;

router.get('/:id', async (request, response, next) => {
  const competitionId = request.params.id;
  try {
    const result = await competitionService.GetScores(competitionId);
    if (result.status === 200) {
      response.status(200).json(result.submissions);
    } else {
      response.status(result.status).json({ error: result.message });
    }
  } catch (error) {
    console.error("Error in route:", error);
    response.status(500).json({ error: "Internal server error." });
  }
});

router.post('/', (request, result, next)=>{
  const userId = request.body.userId
  const title = request.body.title

  competitionService.SaveCompetition(userId, title).then(x => {
    result.send(x)
  }).catch(error => {
    result.status(error.statusCode)
    result.send(error.message)
  })
})



module.exports = router;
