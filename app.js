const express = require('express'); 
var bodyParser = require('body-parser')
require('dotenv/config');
const app = express(); 
const mongoose = require('mongoose'); 
// const router = require('./routes/posts'); 
const userRoutes = require('./routes/user'); 
const morgan = require('morgan'); 

require('dotenv/config');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(morgan('dev')); 

// db connect
mongoose.connect(
    'mongodb+srv://' + process.env.DB_CONNECTION + '@spyro.jxmxs.gcp.mongodb.net/delivery??retryWrites=true&w=majority',
    {   useNewUrlParser: true,
        useUnifiedTopology: true 
    }
); 
//routes
// app.use('/posts', router);
app.use('/user', userRoutes);

app.use((req,res,next) => {
    const error = new Error('Not found')
    error.status =404; 
    next(error); 
})
app.use('/', (req, res) => {
    console.log(' do some stuff in middleware '); 
    res.send(' ROOT IS START')
});
app.use((error, req, res, next ) => {
    res.status(error.status || 500 ); 
    res.json({
        error: {
            message: error.message
        }
    }); 
}); 




app.listen(3000);