const mongoose = require('mongoose');

const productShema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    price: Number,
    images: Object

});

module.exports = mongoose.model('Product', productShema); 
