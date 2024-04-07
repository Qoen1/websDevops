const axios = require('axios')
require('dotenv').config();
const competitionService = require('./CompetitionService')
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
            try {
                competitionService.find(competitionId).then((response) => {
                    const competition = response.data
                    if(competition.createdAt < new Date(new Date().getTime() - (24 * 60 * 60 * 1000))){
                        reject('Competition is closed')
                    }else{
                        const formData = new FormData();
                        const blob = new Blob([image.buffer], { type: image.mimetype });
                        formData.append('userId', userId)
                        formData.append('competitionId', competitionId)
                        formData.append('image', blob,  image.name);
                        axios.post(submissionImageServiceUrl, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                ApiKey: process.env.TOKEN
                            },
                        }).then(response => resolve(response.data))
                    }
                }).catch(e => {
                })


            } catch (e) {
                reject(e)
            }
        })
    }
}

module.exports = new CompetitionService()
