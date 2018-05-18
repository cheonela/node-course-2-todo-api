// It is the hashing, to encrypt the password.
// It is only one way Algorithm, we can't convert the result back to original message

// All these below code, actually can use the (JWT) json web token, in the real application using the JWT

const {SHA256} = require('crypto-js');

var message = 'I am user';

// SHA256 return an object
var hash = SHA256(message).toString();

console.log(hash);


// the data send back from server to client
// The id property is going to equal the user's ID inside of user's collection
// THis is going to let us know which user should be able to make that request
// for example, if I try to delete a to-do with an ID of 3 but the user who created that not matched to the tokens
// then it will not allow to delete
var data = {
  id: 4
}

// We create a variable token, in case to prevent the use to change the id = 5, and which delete all the records was created
// by 5.
// So we send back the token
// However, it is not safe enough, becuase the people can trick us, they hash the id 5, and put that hashvalue
// to the token, then it will be able to delete the record for id = 5
// So, we need to "salt the hash" - add something to the end, so noone can trick us
var token = {
  data,
  // the hash is the hash value of the data
  hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
}


// This is the test to check if the people change the id to something else, it will get the data not match
token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString()

var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

if (resultHash === token.hash) {
  console.log('Data matched');
} else {
  console.log('data not match, don\'t trust');
}
