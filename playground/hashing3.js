const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

//to hash the password
// generate the "salt", take 2 argruments, 1st: # of rounds, higher number, take longer time to generate
// 2nd: callback function
bcrypt.genSalt(10, (err, salt) => {
  // takes 3 arguments: 1st, the string wants to hash, 2nd: salt, 3rd: call back function
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash)
  });
});

var hashedpassword = '$2a$10$rV7rLPVhk5H/dqZ7GocSXOkKsk7pdmlHzNbTFbq65huQEqzInxvji';
// res return T or F, if matched password
bcrypt.compare('123', hashedpassword, (err, res) => {
  console.log(res);

});
