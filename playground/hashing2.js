const jwt = require('jsonwebtoken');

var data = {
  id: 4
};

// jwt.sign = to hash - take the Object, and the secret
var token = jwt.sign(data, 'somesecret');
console.log(token);


// to check if the toekn correct
// it will return the id, and iat (which is a timestamp)
var decoded = jwt.verify(token, 'somesecret' )
console.log(decoded);

// It will got the error, which is invalid signature
var decoded = jwt.verify(token, '1somesecret' )
console.log(decoded);
