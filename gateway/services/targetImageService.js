const axios = require('axios')
require('dotenv').config();
const targetimageurl = process.env.TARGET_IMAGE_URL
class TargetImageService{
    find(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await axios.get(targetimageurl + '/' + id,
                {
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
                console.log(image)
                // console.log(new Blob(image.buffer))
                const formData = new FormData();
                const blob = new Blob([image.buffer], { type: image.mimetype });
                formData.append('userId', userId)
                formData.append('competitionId', competitionId)
                formData.append('image', blob,  image.name);
                let response = await axios.post(targetimageurl, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                         ApiKey: process.env.TOKEN
                    },
                })
                resolve(response.data)
            } catch (e) {
                reject(e)
            }
        })
    }
}

module.exports = new TargetImageService()
