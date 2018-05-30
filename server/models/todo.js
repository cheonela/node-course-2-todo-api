
var mongoose = require('mongoose');

// create a model - to know how to store the data
// 1st arguemnt will be a string which is matching to the variable name, 2nd will be the object
// we can use the validator to validate the database

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,      // Must need to value to this field
    minlength: 1,
    trim: true
  },

  completed: {
    type: Boolean,
    default: false
  },

  completedAt: {
    type: Number,
    default: null
  },
  // this field stores the user ID that create this record. So, only that user can maintain that records
  // the field name can be any, but the reason why we put the underscore, just want to represent This
  // field store the id.
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {Todo};
