const mongoose = require('mongoose');
const {Schema} = mongoose;

var submissionImageSchema = new mongoose.Schema({
  imageBuffer: {type: Buffer, required: true},
  imageType: {type: String, required: true},
  userId: {type: Number, required:true },
  CompetitionImageId: {type: mongoose.Types.ObjectId, required: false}
});

module.exports = mongoose.model('Submissionimage', submissionImageSchema);
