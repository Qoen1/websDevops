const CompetitionService = require('../services/CompetitionService');
const MessageService = require('../services/MessageService');
const Competition = require('../models/Competition');
const Submission = require('../models/Submission');

jest.mock('../services/MessageService');

describe('CompetitionService', () => {
    let competitionService;

    beforeEach(() => {
        const messageService = new MessageService();
        competitionService = new CompetitionService(messageService);
    });

    describe('SaveCompetition', () => {
        it('should save a competition with valid userId and title', async () => {
            const userId = 'user123';
            const title = 'Test Competition';
            const competitionData = { _id: 'competition123', userId, title };
            jest.spyOn(Competition.prototype, 'save').mockResolvedValueOnce(competitionData);

            const competition = await competitionService.SaveCompetition(userId, title);

            expect(competition).toEqual(competitionData);
        });

        it('should call NotifyCompetitionCreated method of MessageService', async () => {
            const userId = 'user123';
            const title = 'Test Competition';
            const competitionData = { _id: 'competition123', userId, title };
            jest.spyOn(Competition.prototype, 'save').mockResolvedValueOnce(competitionData);
            const notifyMock = jest.spyOn(MessageService.prototype, 'NotifyCompetitionCreated');

            await competitionService.SaveCompetition(userId, title);

            expect(notifyMock).toHaveBeenCalledWith(competitionData);
        });
    });

    describe('GetCompetition', () => {
        it('should retrieve a competition with valid id', async () => {
            const competitionData = { _id: 'competition123', userId: 'user123', title: 'Test Competition' };
            jest.spyOn(Competition, 'findOne').mockResolvedValueOnce(competitionData);

            const result = await competitionService.GetCompetition('competition123');

            expect(result).toEqual({ status: 200, competition: competitionData });
        });

        it('should return 404 and appropriate message when competition is not found', async () => {
            jest.spyOn(Competition, 'findOne').mockResolvedValueOnce(null);

            const result = await competitionService.GetCompetition('nonexistentId');

            expect(result).toEqual({ status: 404, message: 'Competition not found.' });
        });
    });

    describe('RegisterSubmissionImage', () => {
        it('should return 500 and appropriate message when userId is not provided', async () => {
            const result = await competitionService.RegisterSubmissionImage('image123', null, 'competition123');

            expect(result).toEqual({ status: 500, message: 'User id not provided.' });
        });

        it('should return 404 and appropriate message when competition is not found', async () => {
            jest.spyOn(Competition, 'findOne').mockResolvedValueOnce(null);

            const result = await competitionService.RegisterSubmissionImage('image123', 'user123', 'nonexistentId');

            expect(result).toEqual({ status: 404, message: 'Competition not found.' });
        });
    });
});
