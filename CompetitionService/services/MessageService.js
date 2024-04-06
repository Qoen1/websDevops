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

class MessageService{
  competitionService
  constructor(competitionService) {
    this.competitionService = new CompetitionService(this)

    amqp.connect(rabbitMQUrl, { resubscribe: true }).then(x => {
      connection = x
      connection.createChannel().then(y => {
        channel = y
        channel.assertExchange(exchange, exchangeType, {durable: true})
        this.SubscribeToTargetImageCreated();
        this.SubscribeToSubmissionImageCreated();
        this.SubscribeToScoreAdded();
      });
    });
  }

  SubscribeToTargetImageCreated() {
    channel.assertQueue('TargetImageQueue').then(() => {
        channel.bindQueue('TargetImageQueue', exchange, routingKeys.targetImageAddKey).then(() => {
            channel.consume('TargetImageQueue', message => {
                this.HandleTargetImageCreated(JSON.parse(message.content));
            });
        });
    });
}

SubscribeToSubmissionImageCreated() {
    channel.assertQueue('SubmissionImageQueue').then(() => {
        channel.bindQueue('SubmissionImageQueue', exchange, routingKeys.submissionImageAddKey).then(() => {
            channel.consume('SubmissionImageQueue', message => {
                this.HandleSubmissionImageCreated(JSON.parse(message.content));
            });
        });
    });
}

SubscribeToScoreAdded() {
    channel.assertQueue('ScoreAddedQueue').then(() => {
        channel.bindQueue('ScoreAddedQueue', exchange, routingKeys.scoreAddedKey).then(() => {
            channel.consume('ScoreAddedQueue', message => {
                this.HandleScoreAdded(JSON.parse(message.content));
            });
        });
    });
}

  HandleTargetImageCreated(message){
    this.competitionService.RegisterTargetImage(message.competitionId, message.imageId);
  }

  HandleSubmissionImageCreated(message){
    console.log("submission image created!");
    this.competitionService.RegisterSubmissionImage(message.imageId, message.userId, message.competitionId);
    this.NotifySubmissionRegistered(message.imageId, message.competitionId, message.image);
  }

  HandleScoreAdded(message) {
    console.log('Submission image scored!');
    this.competitionService.AddScoreToSubmission(message.imageId, message.score);
  }

  NotifyCompetitionCreated(competition){
    channel.publish(exchange, routingKeys.competitionAddKey, Buffer.from(JSON.stringify({
      competitionId: competition._id,
      createdAt: competition.createdAt
    })));
  }

  NotifySubmissionRegistered(imageId, competitionId, image) {    
    channel.publish(exchange, routingKeys.submissionRegisteredKey, Buffer.from(JSON.stringify({
      imageId: imageId,
      competitionId: competitionId,
      image: image
    })));
  }
}

module.exports = MessageService
