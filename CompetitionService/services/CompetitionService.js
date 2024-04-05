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
      Competition.findById(id).then(x => {
        if(x === undefined || x === null){
          reject({
            statusCode: 404,
            message: 'no competition exists with id ' + id
          })
        }
        resolve(x)
      })
    })
  }

  RegisterTargetImage(targetImageId, competitionId){
    return Competition.findOne({_id: competitionId}).then( competition => {
      if(competition === undefined || competition === null){
        return
      }
      competition.TargetImageId = targetImageId
      competition.save()
    })
  }
}

module.exports = CompetitionService
