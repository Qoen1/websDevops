const mongoose = require('mongoose');
const {Schema} = mongoose;

var competitionSchema = new mongoose.Schema({
  id: {type: mongoose.Types.ObjectId, required: true},
  TargetImageId: {type: mongoose.Types.ObjectId, required: true},
  createdAt: {type: Date, required: true}
});

module.exports = mongoose.model('Competition', competitionSchema);
