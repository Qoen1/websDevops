const axios = require('axios')
require('dotenv').config();
const submissionImageServiceUrl = process.env.SUBMISSION_IMAGE_URL
class CompetitionService{
    find(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await axios.get(submissionImageServiceUrl + '/' + id)
                resolve(response.data)
            } catch (e) {
                reject(e)
            }
        })
    }

    create(image, userId, competitionId){
        return new Promise(async (resolve, reject) => {
            try {
                let response = await axios.post(submissionImageServiceUrl, {
                    image: image, 
                    userId: userId,
                    competitionId: competitionId
                })
                resolve(response.data)
            } catch (e) {
                reject(e)
            }
        })
    }
}

module.exports = new CompetitionService()
