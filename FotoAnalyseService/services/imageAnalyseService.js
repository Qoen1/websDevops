const fs = require('fs');
const FormData = require('form-data');
const got = require('got');
const { response } = require('express');


const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

class ImageAnalyseService {
    async getTagsFromImage(imageBase64) {   
        const postURL = 'https://api.imagga.com/v2/tags';     
        const confidenceThreshold = 30.0;
        const maxTags = 10;

        const formData = new FormData();
        formData.append('image_base64', imageBase64);
        formData.append('threshold', confidenceThreshold);
        formData.append('limit', maxTags);
        
        
        try {
            const response = await got.post(postURL, {body: formData, username: apiKey, password: apiSecret});
            return this.extractTagsFromResponse(response, maxTags);
        } catch (error) {
            console.log('an error occured: ', error);
            return error;
        }

    }

    extractTagsFromResponse(response, maxTags) {
        return JSON.parse(response.body).result.tags.slice(0, maxTags);
    }

    async compareImages(image1Base64, image2Base64) {
        const categorizer = "general_v3";
        const postURL = 'https://api.imagga.com/v2/images-similarity/categories/' + categorizer;

        const formData = new FormData();
        formData.append('image_base64', image1Base64);
        formData.append('image2_base64', image2Base64);

        try {
            const response = await got.post(postURL, {
                body: formData,
                username: apiKey,
                password: apiSecret
            });
            return this.extractDistanceFromResponse(response);
        } catch (error) {
            console.log('an error occured: ', error);
            return response.body;
        }
    }

    extractDistanceFromResponse(response) {
        return JSON.parse(response.body).result;
    }
}

module.exports = ImageAnalyseService;