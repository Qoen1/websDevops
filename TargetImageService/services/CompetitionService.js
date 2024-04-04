const Competition = require('../models/Competition')


class CompetitionService {
  SaveCompetition(competitionId){
    return new Promise((resolve, reject) => {
      let today = Date()
      let newCompetition = Competition({
        _id: id
      })
      newCompetition.save().then(data => {
        messageService.NotifyCompetitionCreated(data)
        resolve(data)
      })
    })
  }
}

module.exports = CompetitionService
