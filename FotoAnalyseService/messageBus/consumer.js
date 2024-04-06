const amqp = require('amqplib/callback_api');
const ImageService = require('../services/imageService');
const ImageAnalyseService = require('../services/imageAnalyseService');
const exchange = 'my_exchange'
const queue = 'FotoAnalyseQueue';

const rabbitMQUrl = 'amqp://localhost:5672';

amqp.connect(rabbitMQUrl, function (error0, connection) {
  if (error0) {
    throw error0;
  }  
  
  
  connection.createChannel(function(error1, channel) {
    if(error1) {
      throw error1;
    }

    channel.assertExchange(exchange, 'topic');
    channel.assertQueue(queue);

    channel.bindQueue(queue, exchange, '#.TargetImage.#.Add.*');
    channel.bindQueue(queue, exchange, '#.Competition.#.SubmissionRegistered.*');

    channel.consume(queue, function(msg) {
      handleTargetImageMessage(JSON.parse(msg.content.toString()));
    });

    channel.consume(queue, function(msg) {
      handleSubmissionImageMessage(JSON.parse(msg.content.toString()));
    });
  });  
});


function extractImageData(message) {
  const { imageId, competitionId, image } = message;
  return { imageId, competitionId, imageBase64: image };
}

async function handleTargetImageMessage(msg) {
  const imageData = extractImageData(msg);
  const imageService = new ImageService();
  try {
      await imageService.saveTargetImage(imageData.imageId, imageData.competitionId, imageData.imageBase64);
      console.log('TargetImage saved to database');
  } catch (err) {
      console.log('Error saving TargetImage:', err);
  }
}

async function handleSubmissionImageMessage(msg) {
  const imageData = extractImageData(msg);
  const imageService = new ImageService();
  const imageAnalyseService = new ImageAnalyseService();
  const targetImageBase64 = await imageService.getTargetImageBase64(imageData.competitionId);
  const submissionImageBase64 = imageData.imageBase64;

  try {
      await imageService.saveSubmissionImage(imageData.imageId, imageData.competitionId, imageData.imageBase64);
      console.log('SubmissionImage saved to database');
  } catch (err) {
      console.log('Error saving SubmissionImage:', err);
  }

  const score = await imageAnalyseService.compareImages(targetImageBase64, submissionImageBase64);
  imageService.addScoreToImage(imageData.imageId, score);
}