const amqp = require('amqplib')
const uri = 'amqp://rabbitmq'
const exchange = 'my_exchange'
const exchangeType = 'topic'
const queue = 'targetImageQueue'
const routingKeys = {
  competitionAddKey: '#.Competition.#.Add.#',
  targetImageAddKey: '#.TargetImage.#.Add.#',
  targetImageRemoveKey: '#.TargetImage.#.Remove.#',
}

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
