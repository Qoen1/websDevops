const express = require('express');
const bodyParser = require('body-parser');
const imageRoutes = require('./routes/imageRoutes');
const app = express();
const PORT = process.env.PORT || 3002;
// mongoose.connect('mongodb://localhost:27017/expressJSTest',{ useNewUrlParser: true });


//middleware
app.use(bodyParser.json());
app.use(express.json());

//routes
app.use('/', imageRoutes);



//end routes

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
