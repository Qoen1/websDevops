const mongoose = require('mongoose');

const submissionImageSchema = new mongoose.Schema({
  imageId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  competitionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  imageBase64: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  }
});

const SubmissionImage = mongoose.model('SubmissionImage', submissionImageSchema);

module.exports = SubmissionImage;
