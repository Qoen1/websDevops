const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
require('./messageBus/consumer');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3003;
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl);



//middleware
app.use(bodyParser.json());
app.use(express.json());

//routes




//end routes

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
