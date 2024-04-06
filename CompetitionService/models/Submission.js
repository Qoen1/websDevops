const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    targetImageId: { type: mongoose.Types.ObjectId },
    imageId: { type: mongoose.Types.ObjectId, required: true },
    userId: { type: String, required: true },
    submittedAt: { type: Date, required: true },
    score: { type: Number }
});

module.exports = mongoose.model('Submission', submissionSchema);
