const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

// we create 2 users, one with valid authenticate, and one without in order to test both cases.
const users = [{
  _id: userOneId,
  email: 'abc@hotmail.com',
  password: '123456',
  tokens: [{
    access: 'auth',
    // the token require us to call jwt.sign
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'secret').toString()
  }]
}, {
  _id: userTwoId,
  email: 'xyz@hotmail.com',
  password: '123456'

}];


const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}];


const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    // in order to test the get, we insert some dummy records
    // insert many is used to insert the records to the database
   return Todo.insertMany(todos, (error, docs) => {
       if(error){
           return done(error);
       }
   });
   }).then(() => done());
};

// This function is slightly different from the populateTodos, however, the insertMany is not going to work for
// the middleware, when we insert these records, the password is going to store as a text to the db, it will be
// having problem later when we try to test the program, because we expect the password is hashed
// in order to save the user and hashed password, then we need to tweak
const populateUsers = (done) => {
  User.remove({}).then (() => {
    // pass the 1st object from the array
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    // We can combine both in the promise, so the call back will be called after both promises done
    return Promise.all([userOne, userTwo])

  }).then (() => done());

};


module.exports = {todos, populateTodos, users, populateUsers};
