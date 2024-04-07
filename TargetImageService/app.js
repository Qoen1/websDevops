const express = require('express');
const app = express();
const mongoose = require("mongoose");
const promBundle = require('express-prom-bundle');
require('dotenv').config();
const port = process.env.PORT || 3005;
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

//middleware
app.use(metrics_middleware)

//routes
app.use('/', require('./routes/routes'));

//end routes

//error handler
app.get('/', function(req, res){
  res.send('feckin\' works!')
});


app.listen(process.env.PORT, () => console.log(`listening on port: ${process.env.PORT}`))
