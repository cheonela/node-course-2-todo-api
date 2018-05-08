const {ObjectID} = require('mongodb');


const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {Users} = require('./../server/models/users');

// It is using mongoose queries


var id = '5aeb0cd4cf6bbe2ad0620a2b';
var userID = '5ade187e37f8482eb865e21b';


// This is the function to validate the id, as if passing invalid id, the pogram will crash.
if (!ObjectID.isValid(id)) {
  console.log('ID not valid');
}

if (!ObjectID.isValid(userID)) {
  console.log('User ID not valid');
}


// Moogoose will convert the string to the ID object
// if not able to find a record, it is not an error, but return null
Todo.find({
  _id: id
}).then((todos) => {      //todos is an array of todo object
  console.log('Todos', todos);
});

// findOne, only return the 1st record that match the criteria, in this case, it will just return one todo
// object, not the todos array
Todo.findOne({
  _id: id
}).then((todo) => {
  console.log('Todo', todo);
});

// If using the id to search, if we sending an invalid ID (ie. missing some numbers), then the program will crash
// so we can use the mongodbfunction to validate the ID
Todo.findById(id).then((todo) => {
  if (!todo) {
    return console.log('Records not found');
  }
  console.log('Todo by ID', todo);
}).catch((e) => console.log(e));

Users.findById(userID).then((user) => {
  if (!user) {
    return console.log('Records not found');
  }
  console.log('User by ID', user);
}).catch((e) => console.log(e));
