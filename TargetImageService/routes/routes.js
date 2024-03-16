const express = require('express')
const TargetImageController = require('../controllers/TargetImageController')
const router = new express.Router()

const multer = require('multer')
const upload = multer()

router.get('/:id', (request, result, next)=>{
  let targetImageController = new TargetImageController()
  targetImageController.GetImage(request.params.id).then(image => {
    result.contentType(image.imageType)
    result.send(image.imageBuffer)
  })
})

router.post('/', upload.single('image'), (request, result, next)=>{
  let targetImageController = new TargetImageController()

  targetImageController.SaveImage(request.file.buffer, request.file.mimetype, request.body.userId).then(value => {
    result.send({imageId: value })
  })
})

module.exports = router
