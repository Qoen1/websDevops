const Competition = require('../models/Competition')
const MessageService = require('./MessageService')
const messageService = new MessageService()
class CompetitionService{
  SaveCompetition(userId, title){
    return new Promise((resolve, reject) => {
      let today = Date()
      let newCompetition = Competition({
        createdAt: today,
        userId: userId,
        title: title
      })
      newCompetition.save().then(data => {
        messageService.NotifyCompetitionCreated(data)
        resolve(data)
      })
    })
  }

  async RegisterTargetImage(targetImageId, competitionId){
    let targetImage = await Competition.findOne({_id: competitionId})
    targetImage.TargetImageId = targetImageId
    targetImage.save()
  }
}

module.exports = CompetitionService
