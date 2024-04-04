const amqp = require('amqplib')
const uri = 'amqp://localhost:5672'
const exchange = 'my_exchange'
const exchangeType = 'topic'
const queue = 'targetImageQueue'
const routingKeys = require('../../routingKeys')

let connection
let channel

class MessageService{
  constructor () {
    this.init()
  }

  init(){
    amqp.connect(uri, { resubscribe: true }).then( x => {
      connection = x
      connection.createChannel().then(y => {
        channel = y
        channel.assertExchange(exchange, exchangeType, { durable: false })
        channel.assertQueue(queue, { exclusive: true })
      })
    })
  }

  NotifyTargetImageCreated(imageId, competitionId){
      channel.publish(exchange, routingKeys.targetImageAddKey, Buffer.from(JSON.stringify({
        imageId: imageId,
        competitionId: competitionId
      })))
  }
}

module.exports = MessageService
