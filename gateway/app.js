const express = require('express');
var bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const specs = require('./docs/swagger');
const app = express();
const jsonParser = bodyParser.json()
const promBundle = require('express-prom-bundle');

const metrics_middleware = promBundle({
  includePath: true,
  includeStatusCode: true,
  normalizePath: true,
  promClient: {
    collectDefaultMetrics: {}
  }
})

app.use(metrics_middleware)

//public routes
app.use('/', jsonParser, require('./routes/auth'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

//auth middleware
app.use(require('./middleware/AuthenticatedMiddleware'))
//private routes
app.use('/competitions', jsonParser, require('./routes/competition'))

//error handler
app.get('/', function(req, res){
  res.send('feckin\' works!');
});


app.listen(5000);
