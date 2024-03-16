const TargetImage = require('../model/TargetImage')


class TargetImageController {
  SaveImage(file, fileType, userId,){
    return new Promise((resolve, reject) => {
      let newFile = new TargetImage({
        imageBuffer: file,
        imageType: fileType,
        userId: userId,
      })
      newFile.save().then(data => {
        resolve(data._id)
      })
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

module.exports = TargetImageController
