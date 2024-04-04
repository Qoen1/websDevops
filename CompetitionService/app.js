const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()

const jsonParser = bodyParser.json()

mongoose.connect('mongodb://localhost:27017/expressJSTest',{ useNewUrlParser: true });

//routes
app.use('/', jsonParser, require('./routes/routes'));


//end routes


//error handler
app.get('/', function(req, res){
  res.send('feckin\' works!');
});


app.listen(3000);
