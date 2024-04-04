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

  
  module.exports = router;

