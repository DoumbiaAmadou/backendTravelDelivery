const mongoose = require('mongoose'),
  Schema = mongoose.Schema


const Reservation = new Schema({
  _id: mongoose.Types.ObjectId,

});

const tripsSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: { type: String},
  description: { type: String},
  cityFrom: { type: String, required: true },
  cityTo: { type: String, required: true },
  departureDate: { type: Date, required: true },
  arrivaldate: { type: Date, required: true },
  kiloPrice: Number,
  avalaiblekilos: Number,
  tripsStatus: String,
  reservations:{type : [{ type: Schema.Types.ObjectId, ref: 'Reservations'}]  ,default: [] } ,
  images: Object
});
module.exports = mongoose.model('Trips', tripsSchema); 
