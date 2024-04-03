const mongoose = require('mongoose');
const {Schema} = mongoose;

var competitionSchema = new mongoose.Schema({
  TargetImageId: {type: mongoose.Types.ObjectId, required: true},
  userId: {type: Number, required:true },
  createdAt: {type: Date, required: true}
});

module.exports = mongoose.model('Competition', competitionSchema);
