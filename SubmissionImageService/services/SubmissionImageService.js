const SubmissionImage = require('../models/SubmissionImage')
const MessageService = require('./MessageService')


class SubmissionImageService {
  messageService = new MessageService()

  SaveImage(file, fileType, userId, CompetitionId){
    return new Promise((resolve, reject) => {
        let newFile = new SubmissionImage({
          imageBuffer: file,
          imageType: fileType,
          userId: userId,
          CompetitionId: CompetitionId
        });
        newFile.save().then(data => {
          const base64image = data.imageBuffer.toString('base64');
          this.messageService.NotifySubmissionImageCreated(data._id, CompetitionId, userId, base64image);
          resolve(data._id)
        })
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
