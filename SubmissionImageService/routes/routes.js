const express = require('express')
const SubmissionImageService = require('../services/SubmissionImageService')
const router = new express.Router()

const multer = require('multer')
const upload = multer()

const submissionImageService = new SubmissionImageService()
router.get('/:id', (request, result, next)=>{

  submissionImageService.GetImage(request.params.id).then(image => {
    result.contentType(image.imageType)
    result.send(image.imageBuffer)
  })
})

router.post('/', upload.single('image'), (request, result, next)=>{
  submissionImageService.SaveImage(request.file.buffer, request.file.mimetype, request.body.userId, request.body.competitionId).then(value => {
    result.send({imageId: value })
  })
})

module.exports = router
