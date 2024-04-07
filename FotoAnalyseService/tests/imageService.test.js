const ImageService = require('../services/imageService');
const TargetImage = require('../models/targetImage');
const SubmissionImage = require('../models/submissionImage');
const Producer = require('../messageBus/producer');

jest.mock('../models/TargetImage');
jest.mock('../models/SubmissionImage');
jest.mock('../messageBus/Producer');

describe('ImageService', () => {
    let imageService;

    beforeEach(() => {
        imageService = new ImageService();
    });

    describe('saveTargetImage', () => {
        it('should save a target image with valid data', async () => {
            const imageId = 'image123';
            const competitionId = 'competition123';
            const imageBase64 = 'base64encodedstring';
            TargetImage.findOne.mockResolvedValueOnce(null);
            const saveMock = jest.spyOn(TargetImage.prototype, 'save').mockResolvedValueOnce();

            const result = await imageService.saveTargetImage(imageId, competitionId, imageBase64);

            expect(saveMock).toHaveBeenCalled();
            expect(result.status).toBe(201);
            expect(result.message).toBe('Target image saved successfully.');
        });

        it('should return 409 and appropriate message if target image already exists', async () => {
            const imageId = 'image123';
            const competitionId = 'competition123';
            const imageBase64 = 'base64encodedstring';
            TargetImage.findOne.mockResolvedValueOnce({});

            const result = await imageService.saveTargetImage(imageId, competitionId, imageBase64);

            expect(result.status).toBe(409);
            expect(result.message).toBe('Target image already exists.');
        });
    });

    describe('saveSubmissionImage', () => {
        it('should save a submission image with valid data', async () => {
            const imageId = 'image123';
            const competitionId = 'competition123';
            const imageBase64 = 'base64encodedstring';
            SubmissionImage.findOne.mockResolvedValueOnce(null);
            const saveMock = jest.spyOn(SubmissionImage.prototype, 'save').mockResolvedValueOnce();

            const result = await imageService.saveSubmissionImage(imageId, competitionId, imageBase64);

            expect(saveMock).toHaveBeenCalled();
            expect(result.status).toBe(201);
            expect(result.message).toBe('Submission image saved successfully.');
        });

        it('should return 409 and appropriate message if submission image already exists', async () => {
            const imageId = 'image123';
            const competitionId = 'competition123';
            const imageBase64 = 'base64encodedstring';
            SubmissionImage.findOne.mockResolvedValueOnce({});

            const result = await imageService.saveSubmissionImage(imageId, competitionId, imageBase64);

            expect(result.status).toBe(409);
            expect(result.message).toBe('Submission image already exists.');
        });
    });    
});
