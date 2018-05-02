
var mongoose = require('mongoose');

var Users = mongoose.model('Users', {
  email: {
    type: String,
    required: true,      // Must need to value to this field
    minlength: 1,
    trim: true
  }
});

module.exports = {Users};
