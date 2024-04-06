const TargetImage = require('../models/targetImage');
const SubmissionImage = require('../models/submissionImage');

class ImageService {
    saveTargetImage(imageData) {
        const targetImage = new TargetImage({
        imageId: imageData.imageId,
        competitionId: imageData.competitionId,
        imageBase64: imageData.image
        });
        return targetImage.save();
    }
    
    saveSubmissionImage(imageData, score) {
        const submissionImage = new SubmissionImage({
            imageId: imageData.imageId,
            competitionId: imageData.competitionId,
            imageBase64: imageData.image,
            score: score
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
}

module.exports = ImageService;