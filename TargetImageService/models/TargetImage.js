const mongoose = require('mongoose');
const {Schema} = mongoose;

var targetImageSchema = new mongoose.Schema({
  imageBuffer: {type: Buffer, required: true},
  imageType: {type: String, required: true},
  userId: {type: mongoose.Types.ObjectId, required:true },
  CompetitionImageId: {type: mongoose.Types.ObjectId, required: false}
});

module.exports = mongoose.model('TargetImage', targetImageSchema);
