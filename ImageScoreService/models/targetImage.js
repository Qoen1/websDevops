const mongoose = require('mongoose');

const targetImageSchema = new mongoose.Schema({
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
  }
});

const TargetImage = mongoose.model('TargetImage', targetImageSchema);

module.exports = TargetImage;