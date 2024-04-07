const SubmissionImageService = require('../services/SubmissionImageService');
const SubmissionImage = require('../models/SubmissionImage');
const MessageService = require('../services/MessageService');

jest.mock('../models/SubmissionImage');
jest.mock('../services/MessageService');

describe('SubmissionImageService', () => {
    let submissionImageService;

    beforeEach(() => {
        submissionImageService = new SubmissionImageService();
    });

    describe('SaveImage', () => {
        it('should save an image with valid data', async () => {
            const file = Buffer.from('test file content');
            const fileType = 'image/png';
            const userId = 'user123';
            const competitionId = 'competition123';
            const submissionImageData = { _id: 'image123', imageBuffer: file, imageType: fileType, userId, CompetitionId: competitionId };
            SubmissionImage.prototype.save.mockResolvedValueOnce(submissionImageData);
            const base64Image = file.toString('base64');
            const notifyMock = jest.spyOn(MessageService.prototype, 'NotifySubmissionImageCreated');

            const result = await submissionImageService.SaveImage(file, fileType, userId, competitionId);

            expect(result).toBe(submissionImageData._id);
            expect(notifyMock).toHaveBeenCalledWith(submissionImageData._id, competitionId, userId, base64Image);
        });
    });

    describe('GetImage', () => {
        it('should retrieve an image with valid id', async () => {
            const imageId = 'image123';
            const imageData = { _id: imageId, imageBuffer: Buffer.from('test file content'), imageType: 'image/png', userId: 'user123', CompetitionId: 'competition123' };
            SubmissionImage.findOne.mockResolvedValueOnce(imageData);

            const result = await submissionImageService.GetImage(imageId);

            expect(result).toEqual(imageData);
        });

        it('should reject with 404 status code if image is not found', async () => {
            const imageId = 'nonexistentImageId';
            SubmissionImage.findOne.mockResolvedValueOnce(null);

            await expect(submissionImageService.GetImage(imageId)).rejects.toMatchObject({
                statusCode: 404,
                message: 'no target image exists with id ' + imageId
            });
        });
    });
});
