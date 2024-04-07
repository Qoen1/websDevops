const axios = require('axios');
const authService = require('./AuthService');
require('dotenv').config();
const competitionServiceUrl = process.env.COMPETITION_SERVICE_URL
class CompetitionService{

    find(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await axios.get(competitionServiceUrl + '/' + id)
                resolve(response.data)
            } catch (e) {
                reject(e)
            }
        })
    }

    getScores(competitionId) {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await axios.get(competitionServiceUrl + '/' + competitionId + '/scores')
                resolve(response.data)
            } catch (e) {
                reject(e)
            }
        })
    }
    
    async createCompetition(userId, title) {
        try {
            const userRole = await authService.getUserRole(userId);
            console.log('role: ', userRole.role);
            if (userRole.role != 'admin') {
                return { status: 403, message: 'User is not authorized to create a competition.' };
            }

            const response = await axios.post(competitionServiceUrl, {
                userId: userId,
                title: title
            });

            return { status: response.status, data: response.data };
        } catch (error) {
            return { status: error.response.status || 500, message: `Error creating competition: ${error.message}` };
        }
    }
}

module.exports = new CompetitionService()
