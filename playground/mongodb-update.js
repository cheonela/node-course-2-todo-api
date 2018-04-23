
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

  // it takes 4 arguments, 1st: filter, 2nd: update (need to use the update operator), 3rd: options, in this options setting,
  // it will set the returnOrginial default to true, ie, it will return the origianl document (Not the updated one)
  // so we need to set this to false, so it can return the updated one
  // 4th: is the callback, if no callback, then it will be promises
  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID('5ada22cef596062d2470863d')
  }, {
    // We need to use the update operator ($set) to update the field
    $set: {
      completed: true
    }
  }, {
    returnOrginial: false
  }).then ((result) => {
    console.log(result);

  });



  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5ada3ec31939d1c79bb66678')
  }, {
    // We need to use the update operator ($set) to update the field
    $set: {
      location: 'NY'
    },
    $inc: { // increment 1
      age: 1
    }
  }, {
    returnNewDocument:  true
  }).then ((result) => {
    console.log(result);

  });


  client.close();
});
