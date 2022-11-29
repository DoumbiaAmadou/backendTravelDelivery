
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;



const Reservation = new Schema({
  _id: mongoose.Types.ObjectId,
  name: String,
  kilosReserved: Number,
  kiloReservedPrice: Number,
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  priceTotal: Number,
  date_Res: Date,
});

const tripsSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: { type: String },
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  description: { type: String },
  cityFrom: { type: String, required: true },
  cityTo: { type: String, required: true },
  departureDate: { type: Date, required: true },
  arrivaldate: { type: Date, required: true },
  kiloPrice: Number,
  avalaiblekilos: Number,
  tripsStatus: String,
  reservations: { type: [{ type: Schema.Types.ObjectId, ref: 'Reservation' }], default: [] },
  images: Object
});
module.exports = {
  Reservation: mongoose.model('Reservation', Reservation), Trips: mongoose.model('Trips', tripsSchema)
}

