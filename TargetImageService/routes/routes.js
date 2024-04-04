const express = require('express')
const TargetImageController = require('../services/TargetImageService')
const router = new express.Router()

const multer = require('multer')
const upload = multer()

const targetImageController = new TargetImageController()
router.get('/:id', (request, result, next)=>{

  targetImageController.GetImage(request.params.id).then(image => {
    result.contentType(image.imageType)
    result.send(image.imageBuffer)
  })
})

router.post('/', upload.single('image'), (request, result, next)=>{
  targetImageController.SaveImage(request.file.buffer, request.file.mimetype, request.body.userId, request.body.competitionId).then(value => {
    result.send({imageId: value })
  })
})

module.exports = router
