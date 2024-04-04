const Competition = require('../models/Competition')
const MessageService = require('./MessageService')
class CompetitionService{
  messageService

  constructor (messageService) {
    this.messageService = messageService
  }
  SaveCompetition(userId, title){
    return new Promise((resolve, reject) => {
      let today = Date()
      let newCompetition = Competition({
        createdAt: today,
        userId: userId,
        title: title
      })
      newCompetition.save().then(data => {
        this.messageService.NotifyCompetitionCreated(data)
        resolve(data)
      })
    })
  }

  GetCompetition(id){
    return new Promise((resolve, reject) => {
      Competition.findOne({_id: id}).then(x => {
        resolve(x)
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
