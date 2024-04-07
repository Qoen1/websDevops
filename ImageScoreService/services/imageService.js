const TargetImage = require('../models/targetImage');
const SubmissionImage = require('../models/submissionImage');
const Producer = require('../messageBus/producer');

class ImageService {
    producer = new Producer();

    async saveTargetImage(imageId, competitionId, imageBase64) {
        const existingImage = await TargetImage.findOne({ imageId: imageId, competitionId: competitionId });
        if (existingImage) {
            return { status: 409, message: "Target image already exists." };
        }
        const targetImage = new TargetImage({
            imageId: imageId,
            competitionId: competitionId,
            imageBase64: imageBase64,
        });
        await targetImage.save();
        return { status: 201, message: "Target image saved successfully." };
    }
    
    async saveSubmissionImage(imageId, competitionId, imageBase64) {
        const existingImage = await SubmissionImage.findOne({ imageId: imageId, competitionId: competitionId });
        if (existingImage) {
            return { status: 409, message: "Submission image already exists." };
        }
        const submissionImage = new SubmissionImage({
            imageId: imageId,
            competitionId: competitionId,
            imageBase64: imageBase64,
        });
        await submissionImage.save();
        return { status: 201, message: "Submission image saved successfully." };
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