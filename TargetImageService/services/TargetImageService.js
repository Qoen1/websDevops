const TargetImage = require('../models/TargetImage')
// const Competition = require('../models/Competition')
const MessageService = require('./MessageService')


class TargetImageService {
  messageService = new MessageService()

  SaveImage(file, fileType, userId, CompetitionId){
    return new Promise((resolve, reject) => {
      // let yesterday = new Date()
      // yesterday.setDate(yesterday - 1)
      // Competition.find({id: CompetitionId, createdAt: { $gte: yesterday}}).then(competitions => {
      //   if(competitions.length !== 1 ){
      //     reject(competitions.length)
      //   }

        let newFile = new TargetImage({
          imageBuffer: file,
          imageType: fileType,
          userId: userId,
          CompetitionId: CompetitionId
        })
        newFile.save().then(data => {
          console.log(this.messageService)
          this.messageService.NotifyTargetImageCreated(data._id, CompetitionId)
          resolve(data._id)
        })
      // })
    })
  }

  GetImage (id) {
    return new Promise((resolve, reject) => {
      TargetImage.findOne({_id: id}).then(result => {
        resolve(result)
      })
    })
  }
}

module.exports = TargetImageService
