const mongoose = require('mongoose');

const PostSchema = mongoose.Shema({
  title: {
    type: String,
    required: true
  }

});

module.exports = mongoose.model('Posts', PostSchema); 