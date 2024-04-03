const Competition = require('../models/Competition')
const MessageService = require('MessageService')
const messageService = MessageService()
class CompetitionService{
  SaveCompetition(userId, targetImageId){
    return new Promise((resolve, reject) => {
      let today = Date()
      let newCompetition = Competition({
        createdAt: today,
        userId: userId,
        TargetImageId: targetImageId
      })
      newCompetition.save().then(data => {
        messageService.NotifyCompetitionCreated(data)
      })

    })
  }
}

module.exports = CompetitionService
