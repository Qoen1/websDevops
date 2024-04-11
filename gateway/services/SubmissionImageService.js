const axios = require('axios')
require('dotenv').config();
const submissionImageServiceUrl = process.env.SUBMISSION_IMAGE_URL
class CompetitionService{
    find(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await axios.get(submissionImageServiceUrl + '/' + id, {
                    headers: {ApiKey: process.env.TOKEN},
                    responseType: 'arraybuffer'
                })
                resolve(response)
            } catch (e) {
                reject(e)
            }
        })
    }

    create(image, userId, competitionId){
        return new Promise(async (resolve, reject) => {
            const formData = new FormData();
            const blob = new Blob([image.buffer], {type: image.mimetype});
            formData.append('userId', userId)
            formData.append('competitionId', competitionId)
            formData.append('image', blob, image.name);
            axios.post(submissionImageServiceUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ApiKey: process.env.TOKEN
                },
            }).then(response => resolve(response.data))
        })
    }
}

module.exports = new CompetitionService()
