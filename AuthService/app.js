const express = require('express');
const mongoose = require('mongoose');
const AuthService = require('./services/AuthService');
const bodyParser = require('body-parser');

const app = express();
mongoose.connect('mongodb://localhost:27017/authServiceTest');

var jsonParser = bodyParser.json()

async function test() {
  const auth = new AuthService();
  await auth.register('test', 'pwd');
  const token = await auth.login('test', 'pwd');
  console.log(token);
}

test()

//routes

// app.use('/rooms/:id/lines', jsonParser, require('./routes/Lines'));

//end routes

//error handler
app.get('/', function(req, res){
  res.send('feckin\' works!');
});


app.listen(3000);
