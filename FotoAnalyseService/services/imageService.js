const TargetImage = require('../models/targetImage');
const SubmissionImage = require('../models/submissionImage');
const Producer = require('../messageBus/producer');

class ImageService {
    producer = new Producer();

    saveTargetImage(imageId, competitionId, imageBase64) {
        const targetImage = new TargetImage({
        imageId: imageId,
        competitionId: competitionId,
        imageBase64: imageBase64,
        });
        return targetImage.save();
    }
    
    saveSubmissionImage(imageId, competitionId, imageBase64) {
        const submissionImage = new SubmissionImage({
            imageId: imageId,
            competitionId: competitionId,
            imageBase64: imageBase64,
        });
        return submissionImage.save();
    }

    async getTargetImageBase64(competitionId) {
        try {
            const targetImage = await TargetImage.findOne({ competitionId });
            if (targetImage) {
                return targetImage.imageBase64;
            } else {
                throw new Error('Target image not found for the given competitionId');
            }
        } catch (error) {
            throw new Error('Error fetching target image:', error);
        }
    }

    async addScoreToImage(imageId, score) {
        try {
            const submissionImage = await SubmissionImage.findOneAndUpdate(
                { imageId },
                { $set: { score } },
                { new: true }
            );
            if (submissionImage) {
                this.producer.NotifyScoreAdded(submissionImage.imageId, submissionImage.competitionId, score);
            } else {
                throw new Error('Submission image not found for the given imageId');
            }
        } catch (error) {
            console.log('Error adding score to SubmissionImage:', error);
        }
    }
}

module.exports = ImageService;