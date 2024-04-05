const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const promBundle = require('express-prom-bundle')
const metrics_middleware = promBundle({
  includePath: true,
  includeStatusCode: true,
  normalizePath: true,
  promClient: {
    collectDefaultMetrics: {}
  }
})

const jsonParser = bodyParser.json()
app.use(metrics_middleware)
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
