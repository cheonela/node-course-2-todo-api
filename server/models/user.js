const validator = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


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
// this is a instance method so will be used by the each user object
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

// this is a model object (by adding statics) - will be used by User
UserSchema.statics.findByToken = function (token) {

  var User = this;
  var decoded;

  // as the jwt.verify will fire exception if token not match, so we need to use try
  try {
    decoded = jwt.verify(token, 'secret');
  } catch (e) {
    // if fail, it return a promise to reject
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject(); // this is doing the same thing as above, but in simple way.

  }

  // if successfully decoded the token, then we return the user
  return User.findOne({
    _id: decoded._id,
    // we need to find a user whoses tokens array has an this token
    // to query nested document, we need to wrap it with quotes
    'tokens.token': token,
    'tokens.access': 'auth'
  });

};

// Mongoose has the pre middleware, for example, before an update, we can run some code before we update the model
// like this case, we want to run the code to make sure the hashed password in place
// this is for before 'save' event - before save to database
//the 2nd is the function, as we need access to "this", we need to have the "next" arguments, and have to
// call in somewhre inside this function, otherwise, program will crash
UserSchema.pre('save', function(next) {
  var user = this;

  // we check if password was modified - there is a case that the user only changed the email address, but not
  // the password, then in this case the hashed password get hashed again.
  // This is not what we want, we only want to hash the plain text password
  if (user.isModified('password')) {
    //to hash the password
    // generate the "salt", take 2 argruments, 1st: # of rounds, higher number, take longer time to generate
    // 2nd: callback function
    bcrypt.genSalt(10, (err, salt) => {
      // takes 3 arguments: 1st, the string wants to hash, 2nd: salt, 3rd: call back function
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });


  } else {        // if password not change, then just skip
    next();
  }
})


var User = mongoose.model('User', UserSchema);

module.exports = {User};
