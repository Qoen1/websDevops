const amqp = require('amqplib')
const uri = 'amqp://localhost:5672'
const exchange = 'my_exchange'
const exchangeType = 'topic'
const queue = 'targetImageQueue'
const routingKeys = require('../../routingKeys')

let connection
let channel

class messageService{
  constructor () {
    return this.init()
  }

  async init(){
    connection = await amqp.connect(uri, { resubscribe: true })
    channel = await connection.createChannel()
    await channel.assertExchange(exchange, exchangeType, { durable: false })
    await channel.assertQueue(queue, { exclusive: true })
  }

  NotifyTargetImageCreated(imageId){
      channel.publish(exchange, routingKeys.targetImageAddKey, Buffer.from(JSON.stringify({
        imageId: imageId
      })))
  }
}

module.exports = new messageService()
