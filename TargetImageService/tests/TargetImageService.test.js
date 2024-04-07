const TargetImageService = require('../services/TargetImageService');
const TargetImage = require('../models/TargetImage');
const MessageService = require('../services/MessageService');

jest.mock('../models/TargetImage');
jest.mock('../services/MessageService');

describe('TargetImageService', () => {
    let targetImageService;

    beforeEach(() => {
        targetImageService = new TargetImageService();
    });

    describe('SaveImage', () => {
        it('should save an image with valid data', async () => {
            const file = Buffer.from('test file content');
            const fileType = 'image/png';
            const userId = 'user123';
            const competitionId = 'competition123';
            const targetImageData = { _id: 'image123', imageBuffer: file, imageType: fileType, userId, CompetitionId: competitionId };
            TargetImage.prototype.save.mockResolvedValueOnce(targetImageData);
            const base64Image = file.toString('base64');
            const notifyMock = jest.spyOn(MessageService.prototype, 'NotifyTargetImageCreated');

            const result = await targetImageService.SaveImage(file, fileType, userId, competitionId);

            expect(result).toBe(targetImageData._id);
            expect(notifyMock).toHaveBeenCalledWith(targetImageData._id, competitionId, base64Image);
        });
    });

    describe('GetImage', () => {
        it('should retrieve an image with valid id', async () => {
            const imageId = 'image123';
            const imageData = { _id: imageId, imageBuffer: Buffer.from('test file content'), imageType: 'image/png', userId: 'user123', CompetitionId: 'competition123' };
            TargetImage.findOne.mockResolvedValueOnce(imageData);

            const result = await targetImageService.GetImage(imageId);

            expect(result).toEqual(imageData);
        });

        it('should reject with 404 status code if image is not found', async () => {
            const imageId = 'nonexistentImageId';
            TargetImage.findOne.mockResolvedValueOnce(null);

            await expect(targetImageService.GetImage(imageId)).rejects.toMatchObject({
                statusCode: 404,
                message: 'no target image exists with id ' + imageId
            });
        });
    });
});
