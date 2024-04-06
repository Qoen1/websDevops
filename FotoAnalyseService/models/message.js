const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    handled: {
      type: Boolean,
      required: true,
      default: false
    }    
  });
  
  const Message = mongoose.model('Message', messageSchema);
  
  module.exports = Message;