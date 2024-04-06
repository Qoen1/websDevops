const express = require('express')
const router = new express.Router()
const MessageService = require('../services/MessageService')
const CompetitionService = require('../services/CompetitionService')

const messageService = new MessageService()
const competitionService = messageService.competitionService

router.get('/:id', (request, result, next)=>{

  competitionService.GetCompetition(request.params.id).then(competition => {
    result.send(competition)
  }).catch(error => {
    result.status(error.statusCode)
    result.send(error.message)
  })
})

router.post('/', (request, result, next)=>{
  const userId = request.body.userId
  const title = request.body.title
  console.log(title)

  competitionService.SaveCompetition(userId, title).then(x => {
    result.send(x)
  }).catch(error => {
    result.status(error.statusCode)
    result.send(error.message)
  })
})

module.exports = router
