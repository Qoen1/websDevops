const express = require('express')
const router = new express.Router()
const MessageService = require('../services/MessageService')
const CompetitionService = require('../services/CompetitionService')

const competitionService = new CompetitionService()
const messageService = new MessageService(competitionService)


// router.get('/:id', (request, result, next)=>{
//
//   targetImageController.GetImage(request.params.id).then(image => {
//     result.contentType(image.imageType)
//     result.send(image.imageBuffer)
//   })
// })

router.post('/', (request, result, next)=>{
  const userId = request.body.userId
  const title = request.body.title

  competitionService.SaveCompetition(userId, title).then(x => {
    result.send(x)
  })
})

module.exports = router
