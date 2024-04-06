const amqp = require('amqplib');
const uri = 'amqp://localhost:5672';
const exchange = 'my_exchange';
const exchangeType = 'topic';
const routingKeys = {
  scoreAddedKey: '#.Score.#.Add.#' 
}

let connection
let channel

class Producer {
  constructor () {
    this.init();
  }

  init(){
    amqp.connect(uri, { resubscribe: true }).then( x => {
      connection = x
      connection.createChannel().then(y => {
        channel = y
        channel.assertExchange(exchange, exchangeType, { durable: true })
      })
    });
    console.log('channel initialilzed');
  }

  NotifyScoreAdded(imageId, competitionId, score){
    const publishedMessage = Buffer.from(JSON.stringify({
      imageId: imageId,
      competitionId: competitionId,
      score: score
    }));
    channel.publish(exchange, routingKeys.scoreAddedKey, publishedMessage);
  }
}

module.exports = Producer;