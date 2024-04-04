const express = require('express');
var bodyParser = require('body-parser')
const app = express();
// mongoose.connect('mongodb://localhost:27017/expressJSTest',{ useNewUrlParser: true });

var jsonParser = bodyParser.json()

//routes

// app.use('/rooms/:id/lines', jsonParser, require('./routes/Lines'));

//end routes

//error handler
app.get('/', function(req, res){
  res.send('feckin\' works!');
});


app.listen(5000);
