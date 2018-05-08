const {ObjectID} = require('mongodb');


const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {Users} = require('./../server/models/users');

// Todo.remove - remove all records in the table - it is not returning the doc that we have removed
// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// Only delete the 1st match, and it will return the doc that we have removed
Todo.findOneAndRemove({text: "Swimming"}).then((todo) => {
  console.log(todo);
})


Todo.findByIdAndRemove('5af1c8c27f470f2ba477f575').then((todo) => {
  console.log(todo);
})
