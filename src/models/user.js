const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  },
  name: { type: String, required: true },
  firstName: { type: String, required: true },
  city: { type: String },
  address: { type: String },
  cellphone: {
    type: String, required: true
  },
  userStatus: { type: String ,  default:'USER'  },
  password: { type: String, required: true },

});

module.exports = mongoose.model('User', userSchema);
