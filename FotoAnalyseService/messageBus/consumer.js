const amqp = require('amqplib/callback_api');
const ImageService = require('../services/imageService');
const ImageAnalyseService = require('../services/imageAnalyseService');

const rabbitMQUrl = 'amqp://localhost';

amqp.connect(rabbitMQUrl, function (error0, connection) {
  if (error0) {
    throw error0;
  }

  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    const exchanges = ['TargetImage', 'SubmissionImage'];
    exchanges.forEach(exchange => {
      channel.assertExchange(exchange, 'topic', { durable: false });
    });

    const queues = ['TargetImageQueue', 'SubmissionImageQueue'];
    queues.forEach(queue => {
      channel.assertQueue(queue, { durable: false });
    });

    channel.bindQueue('TargetImageQueue', 'TargetImage', '*.TargetImage.#.Add.#');
    channel.bindQueue('SubmissionImageQueue', 'SubmissionImage', '*.SubmissionImage.#.Add.#');

    async function handleMessage(msg) {
      const message = JSON.parse(msg.content.toString());
      const imageData = extractImageData(message);
      
      if (msg.fields.routingKey.startsWith('TargetImage')) {
        const imageService = new ImageService();
        imageService.saveTargetImage(imageData)
          .then(() => console.log('TargetImage saved to database'))
          .catch(err => console.log('Error saving TargetImage:', err));
      } else if (msg.fields.routingKey.startsWith('SubmissionImage')) {
        const imageService = new ImageService();
        const imageAnalyseService = new ImageAnalyseService();
        const targetImageBase64 = await imageService.getTargetImageBase64(imageData.competitionId);
        const submissionImageBase64 = imageData.imageBase64;
        const score = imageAnalyseService.compareImages(targetImageBase64, submissionImageBase64);

        imageService.saveSubmissionImage(imageData, score)
          .then(() => console.log('SubmissionImage saved to database'))
          .catch(err => console.log('Error saving SubmissionImage:', err));
      }
    }  

    channel.consume('TargetImageQueue', handleMessage, { noAck: true });
    channel.consume('SubmissionImageQueue', handleMessage, { noAck: true });
  });
});

function extractImageData(message) {
  const { imageId, competitionId, image } = message;
  return { imageId, competitionId, imageBase64: image };
}