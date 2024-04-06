const amqp = require('amqplib/callback_api');
const ImageService = require('../services/imageService');
const ImageAnalyseService = require('../services/imageAnalyseService');
const exchange = 'my_exchange'

const rabbitMQUrl = 'amqp://localhost:5672';

amqp.connect(rabbitMQUrl, function (error0, connection) {
  console.log('consumer started!')
  if (error0) {
    throw error0;
  }  
  const queues = ['TargetImageQueue', 'SubmissionImageQueue'];
  
  connection.createChannel(function(error1, channel) {
    if(error1) {
      throw error1;
    }

    channel.assertExchange(exchange, 'topic');
    
    queues.forEach(queue => {
      channel.assertQueue(queue)
    });

    channel.bindQueue('TargetImageQueue', exchange, '#.TargetImage.#.Add.*');
    channel.bindQueue('SubmissionImageQueue', exchange, '#.SubmissionImage.#.Add.*');

    channel.consume('TargetImageQueue', function(msg) {
      handleTargetImageMessage(JSON.parse(msg.content.toString()));
    });

    channel.consume('SubmissionImageQueue', function(msg) {
      handleSubmissionImageMessage(JSON.parse(msg.content.toString()));
    });
  });  
});


function extractImageData(message) {
  const { imageId, competitionId, image } = message;
  return { imageId, competitionId, imageBase64: image };
}

function handleTargetImageMessage(msg) {
  console.log('HANDLING TARGET IMAGE');
  const imageData = extractImageData(msg);
  const imageService = new ImageService();
    imageService.saveTargetImage(imageData.imageId, imageData.competitionId, imageData.imageBase64)
      .then(() => console.log('TargetImage saved to database'))
      .catch(err => console.log('Error saving TargetImage:', err));
}

async function handleSubmissionImageMessage(msg) {
  const imageData = extractImageData(msg);
  const imageService = new ImageService();
  const imageAnalyseService = new ImageAnalyseService();
  const targetImageBase64 = await imageService.getTargetImageBase64(imageData.competitionId);
  const submissionImageBase64 = imageData.imageBase64;        

  imageService.saveSubmissionImage(imageData.imageId, imageData.competitionId, imageData.imageBase64)
    .then(() => console.log('SubmissionImage saved to database'))
    .catch(err => console.log('Error saving SubmissionImage:', err));    
    
  const score = await imageAnalyseService.compareImages(targetImageBase64, submissionImageBase64);
  imageService.addScoreToImage(imageData.imageId, score);
}