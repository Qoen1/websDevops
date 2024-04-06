const express = require('express')
var bodyParser = require('body-parser')
const app = express();
const jsonParser = bodyParser.json()
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

//routes
app.use('/', jsonParser, require('./routes/auth'))
//end routes

//error handler
app.get('/', function(req, res){
  res.send('feckin\' works!');
});


app.listen(5000);
