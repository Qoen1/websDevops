const express = require('express');
const mongoose = require('mongoose');
const AuthService = require('./services/authService');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
require('dotenv').config();
const PORT = process.env.PORT || 3001;
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl);

const app = express();


var jsonParser = bodyParser.json()
app.use(jsonParser)

//routes
app.use(require('./middleware/ApiMiddleware'))
app.use('/auth', authRoutes)

//end routes

//error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
