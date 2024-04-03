const amqp = require('amqplib')
const uri = 'amqp://localhost:5672'
const exchange = 'my_exchange'
const exchangeType = 'topic'
const queue = 'CompetitionServiceQueue'
const routingKeys = require('../../routingKeys')

let connection
let channel

class messageService{
  constructor () {
    amqp.connect(uri, { resubscribe: true }).then(x => {
      connection = x
      connection.createChannel().then(y => {
        channel = y
        channel.assertExchange(exchange, exchangeType, {durable: false})
        channel.assertQueue(queue, {exclusive: true})
        this.SubscribeToTargetImageCreated()
      })
    })
  }

  SubscribeToTargetImageCreated(){
    channel.bindQueue(queue, exchange, routingKeys.targetImageAddKey).then(x => {
      channel.consume(queue, message => this.HandleTargetImageCreated(message))
    })
  }

  HandleTargetImageCreated(message){
    resolve(JSON.parse(message.content))
  }

  NotifyCompetitionCreated(competition){
    channel.publish(exchange, routingKeys.competitionAddKey, Buffer.from(JSON.stringify({
      competitionId: competition._id,
      createdAt: competition.createdAt
    })))
  }
}

module.exports = messageService
