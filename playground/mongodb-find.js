
// We need to get the mongo client, that lets you connect to a mongo server
//const MongoClient = require('mongodb').MongoClient;

// object destructuring let you pull out properties from an object creating variables
// in this case, we extract the attriute of an object, and make it as a variables
// syntax is having {variables}
// destructuring also can pull more things from MongoDB
// the ObjectID constuctor function let us make new object id on the fly
const {MongoClient, ObjectID} = require('mongodb');

//var obj = new ObjectID();
//console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) =>{
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');


  const db = client.db('TodoApp')

// the Find() is returning the cursor, toArray will having the array of document, instead of cursor
// to array is retuning a promise, so we can use then
  db.collection('Todos').find().toArray().then((docs) => {
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined, 2));

  }, (err) => {
    console.log('Unable to fetch todos', err);
  });


  // This is how to fetch a record that meet the criteria.
  db.collection('Todos').find({completed: false}).toArray().then((docs) => {
    console.log('Not completed Todos');
    console.log(JSON.stringify(docs, undefined, 2));

  }, (err) => {
    console.log('Unable to fetch todos', err);
  });


  // This is how to fetch a record use object id
  // Object ID is not a string, so can't use _ID:'5ada257ab676ac1a3488356c'
  // we need to use the constuctor function to create an object id object
  db.collection('Todos').find({
    _id: new ObjectID('5ada257ab676ac1a3488356c')
  }).toArray().then((docs) => {
    console.log('Todo Fetched by ID');
    console.log(JSON.stringify(docs, undefined, 2));

  }, (err) => {
    console.log('Unable to fetch todos', err);
  });


// Get the count
  db.collection('Todos').find({completed: false}).count().then((cnt) => {
    console.log(`Todo count: ${cnt}`);

  }, (err) => {
    console.log('Unable to fetch todos', err);
  });

  db.collection('Users').find({name: "John", age: 37}).count().then((cnt) => {
    console.log(`Total users: ${cnt}`);

  }, (err) => {
    console.log('Unable to fetch todos', err);
  });




  client.close();
});
