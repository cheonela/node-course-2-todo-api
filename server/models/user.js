const validator = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');


// store the schema for the user, all the properties
// It is used to tack on the custom methods. We can't add methods to the user, so we have to switch to use schema
// Schema contructor takes an object, and the object will all the attributes.
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,      // Must need to value to this field
    minlength: 1,
    trim: true,
    unique: true,        // email is a unique record
    // Validate object can do the validation to the value
    validate: {
      // this validator is an npm package, so we need to install that
      validator: validator.isEmail,
      message: `{VALUE} is not valid email`
    }
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },
  // tokens is an array object, each object is a login token, if login through phone or website, the login will
  // be different, this is only for Mongoose DB
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});


// when we send back, it will send back all the properties, even the token and password, which we should NOT send callback
// so we override toJSON method, and only send back some properties.
UserSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};



// As we need to use "This", so we create the function (not arrow fnction - as it is not allow to use "this")
UserSchema.methods.generateAuthToken =  function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'secret').toString();

  // This is how we add the value to the tokens array
  user.tokens = user.tokens.concat([{access, token}]);

  // Now we save it to the db
  // .save is a promise, then return the token, in this case, in the server file, we can grab the token tack to
  // another call back getting access to the token, then responding inside of the callback function
  // this is a special way, it is the way the server.js promise chain to this promise.
  return user.save().then(() => {
    return token;
  });
};



var User = mongoose.model('User', UserSchema);

module.exports = {User};
