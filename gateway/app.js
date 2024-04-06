const express = require('express');
var bodyParser = require('body-parser')
const app = express();
const promBundle = require('express-prom-bundle')
const metrics_middleware = promBundle({
  includePath: true,
  includeStatusCode: true,
  normalizePath: true,
  promClient: {
    collectDefaultMetrics: {}
  }
})

app.use(metrics_middleware)
var jsonParser = bodyParser.json()

//routes
app.use('/', require('./routes/myRoutes'))
//end routes

//error handler
app.get('/', function(req, res){
  res.send('feckin\' works!');
});


app.listen(5000);
