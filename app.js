const express = require('express');
var bodyParser = require('body-parser')
require('dotenv/config');
const app = express();
const mongoose = require('mongoose');

const morgan = require('morgan');

require('dotenv/config');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(morgan('dev'));

// corps issues 
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, PATCH, DELETE');
    return res.status(200).json({});
  }
  next();
})

// const router = require('./routes/posts'); 
const userRoutes = require('./routes/user');
const productsRoutes = require('./routes/products');
const tripsRoutes = require('./routes/trips');
const ordersRoutes = require('./routes/orders');



// db connect 
try {
  mongoose.connect(
    'mongodb+srv://' + process.env.DB_CONNECTION + '@spyro.jxmxs.gcp.mongodb.net/delivery?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  });
} catch (err) {

}
//routes
// app.use('/posts', router);
app.use('/user', userRoutes);
app.use('/product', productsRoutes);
app.use('/trips', tripsRoutes);
app.use('/order', ordersRoutes);
app.use('/uploads', express.static('uploads'));


app.use('/', (req, res) => {
  console.log(' do some stuff in middleware ');
  res.send(' ROOT IS START')
  // res.redirect('/root')

});

app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});
app.listen(3000);