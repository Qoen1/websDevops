const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()

const jsonParser = bodyParser.json()

mongoose.connect('mongodb://mongo/expressJSTest',{ useNewUrlParser: true });

//routes
app.use('/', jsonParser, require('./routes/routes'));


//end routes


//error handler
app.get('/', function(req, res){
  res.status(404)
  res.send()
});


app.listen(3000);
