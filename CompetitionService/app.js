const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const promBundle = require('express-prom-bundle')
const mongoURI = 'mongodb://localhost:27017/Competition';

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
mongoose.connect(mongoURI);

//routes
app.use('/', jsonParser, require('./routes/routes'));


//end routes


//error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


app.listen(3005);
