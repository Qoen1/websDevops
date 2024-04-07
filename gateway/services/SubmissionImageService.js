const axios = require('axios')
require('dotenv').config();
const submissionImageServiceUrl = process.env.SUBMISSION_IMAGE_URL
class CompetitionService{
    find(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await axios.get(submissionImageServiceUrl + '/' + id, { responseType: 'arraybuffer' })
                resolve(response)
            } catch (e) {
                console.log(e)
                reject(e)
            }
        })
    }

    create(image, userId, competitionId){
        return new Promise(async (resolve, reject) => {
            try {
                console.log(image)
                // console.log(new Blob(image.buffer))
                const formData = new FormData();
                const blob = new Blob([image.buffer], { type: image.mimetype });
                formData.append('userId', userId)
                formData.append('competitionId', competitionId)
                formData.append('image', blob,  image.name);
                let response = await axios.post(submissionImageServiceUrl, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                })
                resolve(response.data)
            } catch (e) {
                reject(e)
            }
        })
    }
}

module.exports = new CompetitionService()
