const axios = require('axios')
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
    
    createCompetition(userId, title) {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await axios.post(competitionServiceUrl, {
                    userId: userId,
                    title: title
                })
                resolve(response.data)
            } catch (e) {
                reject(e)
            }
        })
    }
}

module.exports = new CompetitionService()
