const express = require('express')
const app = express()
const mongoose = require("mongoose")
const promBundle = require('express-prom-bundle')
const metrics_middleware = promBundle({
  includePath: true,
  includeStatusCode: true,
  normalizePath: true,
  promClient: {
    collectDefaultMetrics: {}
  }
})

mongoose.connect('mongodb://mongo/TargetImage')

//middleware
app.use(metrics_middleware)

//routes
app.use('/', require('./routes/routes'));

//end routes

//error handler
app.get('/', function(req, res){
  res.send('feckin\' works!')
});


app.listen(6000)
