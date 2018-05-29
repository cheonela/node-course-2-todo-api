// create the middleware to make other site private
// the next is the actual route is not going to run until next gets called inside of the middleware

var {User} = require('./../models/user');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  // this is a model method.
  User.findByToken(token).then((user) => {
    if (!user) {
      // it is valid token, but no info found
      // suppose we can use res.status(401).send(, however, it is duplicate as below, so we can do this
      // then it will not run the code, and just to the catch
      return Promise.reject();
    }

    // we will modified the request object inside of the route down below
    req.user = user;
    req.token = token;

    // in this case, it will run the below route, there will no next() for the error, as we don't want to running
    // other codes when having error
    next();
  }).catch((e) => {
    res.status(401).send();
  });

};

module.exports = {authenticate};
