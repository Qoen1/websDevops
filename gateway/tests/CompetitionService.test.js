const authService = require('../services/AuthService');
const CompetitionService = require('../services/CompetitionService');

jest.mock('../services/AuthService');

describe('CompetitionService', () => {
  describe('createCompetition', () => {
    it('should return 403 if user is not admin', async () => {
      authService.getUserRole.mockResolvedValueOnce({ role: 'user' });

      const userId = 'user123';
      const title = 'Test Competition';
      const expectedResponse = { status: 403, message: 'User is not authorized to create a competition.' };
      const result = await CompetitionService.createCompetition(userId, title);

      expect(authService.getUserRole).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedResponse);
    });    
  });
});
