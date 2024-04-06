const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
require('./messageBus/consumer');
const app = express();
const mongoURI = 'mongodb://localhost:27017/FotoAnalyse';

require('dotenv').config();


const PORT = process.env.PORT || 3002;
mongoose.connect(mongoURI);



//middleware
app.use(bodyParser.json());
app.use(express.json());

//routes




//end routes

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
