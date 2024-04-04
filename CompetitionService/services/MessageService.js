const amqp = require('amqplib')
const uri = 'amqp://localhost:5672'
const exchange = 'my_exchange'
const exchangeType = 'topic'
const queue = 'CompetitionServiceQueue'
const routingKeys = require('../../routingKeys')
const CompetitionService = require('../services/CompetitionService')

let connection
let channel

class MessageService{
  competitionService
  constructor(competitionService) {
    this.competitionService = new CompetitionService(this)

    amqp.connect(uri, { resubscribe: true }).then(x => {
      connection = x
      connection.createChannel().then(y => {
        channel = y
        channel.assertExchange(exchange, exchangeType, {durable: false})
        channel.assertQueue(queue)
        this.SubscribeToTargetImageCreated()
      })
    })
  }

  SubscribeToTargetImageCreated(){
    channel.bindQueue(queue, exchange, routingKeys.targetImageAddKey).then(x => {
      channel.consume(queue, message => {
        this.HandleTargetImageCreated(JSON.parse(message.content))
      })
    })
  }

  HandleTargetImageCreated(message){
    console.log("target image created!")
    this.competitionService.RegisterTargetImage(message.imageId, message.competitionId)
  }

  NotifyCompetitionCreated(competition){
    channel.publish(exchange, routingKeys.competitionAddKey, Buffer.from(JSON.stringify({
      competitionId: competition._id,
      createdAt: competition.createdAt
    })))
  }
}

module.exports = MessageService
