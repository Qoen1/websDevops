const express = require('express')
const app = express()
const mongoose = require("mongoose")

mongoose.connect('mongodb://localhost:27017/TargetImage')

//routes
app.use('/', require('./routes/routes'));

//end routes

//error handler
app.get('/', function(req, res){
  res.send('feckin\' works!')
});


app.listen(4000)
