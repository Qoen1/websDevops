const amqp = require('amqplib')
const uri = 'amqp://localhost:5672'
const exchange = 'my_exchange'
const exchangeType = 'topic'
const queue = 'TargetImageQueue'
const routingKeys = {
  competitionAddKey: '#.Competition.#.Add.#',
  targetImageAddKey: '#.TargetImage.#.Add.#',
  targetImageRemoveKey: '#.TargetImage.#.Remove.#',
}

let connection
let channel

class MessageService{
  constructor () {
    this.init();
  }

  init(){
    amqp.connect(uri, { resubscribe: true }).then( x => {
      connection = x
      connection.createChannel().then(y => {
        channel = y
        channel.assertExchange(exchange, exchangeType, { durable: true })
        channel.assertQueue(queue, { exclusive: false })
      })
    })
  }

  NotifyTargetImageCreated(imageId, competitionId, image){
      channel.publish(exchange, routingKeys.targetImageAddKey, Buffer.from(JSON.stringify({
        imageId: imageId,
        competitionId: competitionId,
        image: image
      })));
  }
}

module.exports = MessageService;
