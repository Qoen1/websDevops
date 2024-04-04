const express = require('express');
const ImageAnalyseService = require('../services/imageAnalyseService');
const router = express.Router();

router.post('/image/tags', async (req, res) => {
  const imageAnalyseService = new ImageAnalyseService();
  try {
    const { imageBase64 } = req.body;
    const tags = await imageAnalyseService.getTagsFromImage(imageBase64);
    res.json({ tags });
  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

router.post('/image/compare', async (req, res) => {
  const imageAnalyseService = new ImageAnalyseService();
  try {
    const {image1Base64, image2Base64} = req.body;
    const result = await imageAnalyseService.compareImages(image1Base64, image2Base64);
    res.json(result);
  } catch(error) {
    console.log(error);
  }
})
  
module.exports = router;

