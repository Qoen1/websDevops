const SubmissionImage = require('../models/SubmissionImage')
// const Competition = require('../models/Competition')
const MessageService = require('./MessageService')


class SubmissionImageService {
  messageService = new MessageService()

  SaveImage(file, fileType, userId, CompetitionId){
    return new Promise((resolve, reject) => {
      // let yesterday = new Date()
      // yesterday.setDate(yesterday - 1)
      // Competition.find({id: CompetitionId, createdAt: { $gte: yesterday}}).then(competitions => {
      //   if(competitions.length !== 1 ){
      //     reject(competitions.length)
      //   }

        let newFile = new SubmissionImage({
          imageBuffer: file,
          imageType: fileType,
          userId: userId,
          CompetitionId: CompetitionId
        })
        newFile.save().then(data => {
          console.log(this.messageService)
          this.messageService.NotifySubmissionImageCreated(data._id, CompetitionId, data.imageBuffer)
          resolve(data._id)
        })
      // })
    })
  }

  GetImage (id) {
    return new Promise((resolve, reject) => {
      SubmissionImage.findOne({_id: id}).then(result => {
        if(result === undefined || result === null){
          reject({
            statusCode: 404,
            message: 'no target image exists with id ' + id
          })
        }
        resolve(result)
      })
    })
  }
}

module.exports = SubmissionImageService
