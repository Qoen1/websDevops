const amqp = require('amqplib');
const rabbitMQUrl = 'amqp://localhost:5672';
const exchange = 'my_exchange'
const exchangeType = 'topic'
const queue = 'CompetitionServiceQueue'
const routingKeys = {
  competitionAddKey: '#.Competition.#.Add.#',
  targetImageAddKey: '#.TargetImage.#.Add.#',
  targetImageRemoveKey: '#.TargetImage.#.Remove.#',
  submissionImageAddKey: '#.SubmissionImage.#.Add.#',
  scoreAddedKey: '#.Score.#.Add.#',
  submissionRegisteredKey: '#.Competition.#.SubmissionRegistered.*'
}
const CompetitionService = require('../services/CompetitionService')

let connection
let channel

class MessageService {
  constructor(competitionService) {
      this.competitionService = competitionService;
  }

  async connectToRabbitMQ() {
      try {
          const connection = await amqp.connect(rabbitMQUrl, { resubscribe: true });
          const channel = await connection.createChannel();
          await channel.assertExchange(exchange, exchangeType, { durable: true });
          return channel;
      } catch (error) {
          console.error("Error connecting to RabbitMQ:", error);
          throw error;
      }
  }

  async startConsumers() {
      channel = await this.connectToRabbitMQ();
      this.SubscribeToTargetImageCreated();
      this.SubscribeToSubmissionImageCreated();
      this.SubscribeToScoreAdded();
  }

  async subscribeToQueue(queue, routingKey, handleMessage) {
      try {
          await channel.assertQueue(queue);
          await channel.bindQueue(queue, exchange, routingKey);
          await channel.consume(queue, message => {
              handleMessage(JSON.parse(message.content));
          });
      } catch (error) {
          console.error(`Error subscribing to queue '${queue}':`, error);
          throw error;
      }
  }

  async SubscribeToTargetImageCreated() {
      await this.subscribeToQueue(queue, routingKeys.targetImageAddKey, this.HandleTargetImageCreated.bind(this));
  }

  async SubscribeToSubmissionImageCreated() {
      await this.subscribeToQueue(queue, routingKeys.submissionImageAddKey, this.HandleSubmissionImageCreated.bind(this));
  }

  async SubscribeToScoreAdded() {
      await this.subscribeToQueue(queue, routingKeys.scoreAddedKey, this.HandleScoreAdded.bind(this));
  }

  async HandleTargetImageCreated(message) {
      await this.competitionService.RegisterTargetImage(message.competitionId, message.imageId);
  }

  async HandleSubmissionImageCreated(message) {
      console.log("Submission image created!");
      console.log(message.imageId, message.userId, message.competitionId);
      await this.competitionService.RegisterSubmissionImage(message.imageId, message.userId, message.competitionId);
      await this.NotifySubmissionRegistered(message.imageId, message.competitionId, message.image);
  }

  async HandleScoreAdded(message) {
      console.log('Submission image scored!');
      await this.competitionService.AddScoreToSubmission(message.imageId, message.score);
  }

  async NotifyCompetitionCreated(competition) {
      await channel.publish(exchange, routingKeys.competitionAddKey, Buffer.from(JSON.stringify({
          competitionId: competition._id,
          createdAt: competition.createdAt
      })));
  }

  async NotifySubmissionRegistered(imageId, competitionId, image) {
      await channel.publish(exchange, routingKeys.submissionRegisteredKey, Buffer.from(JSON.stringify({
          imageId: imageId,
          competitionId: competitionId,
          image: image
      })));
  }
}

module.exports = MessageService
