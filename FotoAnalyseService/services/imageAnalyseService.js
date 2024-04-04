const fs = require('fs');
const FormData = require('form-data');
const got = require('got');

//TODO: use secret .env variables
const apiKey = '';
const apiSecret = '';
const postURL = 'https://api.imagga.com/v2/tags';

const maxTags = 10;

class ImageAnalyseService {
    async getTagsFromImage(imageBase64) {        
        const confidenceThreshold = 30.0;

        const formData = new FormData();
        formData.append('image_base64', imageBase64);
        formData.append('threshold', confidenceThreshold);
        formData.append('limit', maxTags);
        
        (async () => {
            try {
                const response = await got.post(postURL, {body: formData, username: apiKey, password: apiSecret});
                return this.parseResponse(response.body);
            } catch (error) {
                console.log('an error occured: ', error);
                return error;
            }
        })();
    }

    parseResponse(response) {
        const tags = JSON.parse(response).result.tags.slice(0, maxTags);
        console.log(tags);
        return tags;
    }
}

module.exports = ImageAnalyseService;