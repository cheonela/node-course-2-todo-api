
// We need to get the mongo client, that lets you connect to a mongo server
const MongoClient = require('mongodb').MongoClient;

// Then ew can call mongo connect to connect to the database
// this method takes 2 argurments - 1st one is the string, the URL of the database located
// 2nd is a callback function, to indicate if the connection succeeded or failed.
// The callback function takes 2 arguments - 1st one is the error, 2nd is the client object,

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) =>{
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');

  // reference to the database, this is the object to read, write data
  const db = client.db('TodoApp')

  // insert the table (collection)
  // insertOne (insert a new document(records)) takes 2 arguments - 1st is an object, 2nd one is the callback function
  // which the action fail or not
  db.collection('Todos').insertOne( {
    text: 'Baking a cake',
    completed: false
  }, (err, result) => {
    if (err) {
      return console.log('Unable to insert todo', err);
    }
    // the ops attribute store all of the docs that were inserted
    console.log(JSON.stringify(result.ops, undefined, 2));
  });


  db.collection('Users').insertOne( {
    name: 'Elise',
    age: 35,
    location: 'Toronto'
  }, (err, result) => {
    if (err) {
      return console.log('Unable to insert User', err);
    }
    // the ops attribute store all of the docs that were inserted
    console.log(JSON.stringify(result.ops, undefined, 2));
    console.log(result.ops[0]._id.getTimestamp());

  });


  client.close();
});
