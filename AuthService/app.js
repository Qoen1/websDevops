const express = require('express');
const mongoose = require('mongoose');
const AuthService = require('./services/authService');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');


const app = express();
mongoose.connect('mongodb://localhost:27017/Auth');

var jsonParser = bodyParser.json()
app.use(jsonParser)

//routes

app.use('/auth', authRoutes);

//end routes

//error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
