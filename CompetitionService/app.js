const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const promBundle = require('express-prom-bundle')
require('dotenv').config();
const PORT = process.env.PORT || 3002;
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl);
const metrics_middleware = promBundle({
  includePath: true,
  includeStatusCode: true,
  normalizePath: true,
  promClient: {
    collectDefaultMetrics: {}
  }
})

const jsonParser = bodyParser.json();
app.use(metrics_middleware);

//routes
app.use('/', jsonParser, require('./routes/routes'));


//end routes


//error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


app.listen(PORT);
