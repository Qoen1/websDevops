const axios = require('axios')
require('dotenv').config();
const targetimageurl = process.env.TARGET_IMAGE_URL
class TargetImageService{
    find(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await axios.get(targetimageurl + '/' + id)
                resolve(response.data)
            } catch (e) {
                reject(e)
            }
        })
    }

    create(image, userId, competitionId){
        return new Promise(async (resolve, reject) => {
            try {
                let response = await axios.post(targetimageurl, {
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

module.exports = new TargetImageService()
