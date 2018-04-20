
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

  //  deleteMany
    db.collection('Todos').deleteMany({text: "Cleaning the house"}).then((result) => {

      // In the result, it will show "result: n:3, ok: 1" - it tells you the command run sucessfully, and
      // remove 3 records.
      console.log(result);
    });


  //  deleteMany - this is just not use the promise to handle the error
  db.collection('Users').deleteMany({name: "Paul", age: 25});

  // deleteOne
      // It works like deleteMany, however, it only delete the first record that meet the criteria
      db.collection('Todos').deleteOne({text: "Swimming"}).then((result) => {

        // In the result, it will show "result: n:3, ok: 1" - it tells you the command run sucessfully, and
        // remove 3 records.
        console.log(result);
    });

  // deleteOne
  // It works like deleteMany, however, it only delete the first record that meet the criteria
  db.collection('Users').deleteOne({name: "Paul"}).then((result) => {

    // In the result, it will show "result: n:3, ok: 1" - it tells you the command run sucessfully, and
    // remove 3 records.
    console.log(result);
  });

  //findOneAndDelete - it deletes the item, and also returns those values
  // so, we can get the object, and try the user which one has been deleted
  // incase if the program has undo logic, then we can undo the delete
  db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    console.log(result);
  });

  //findOneAndDelete - it deletes the item, and also returns those values
  // so, we can get the object, and try the user which one has been deleted
  // incase if the program has undo logic, then we can undo the delete
  //
  db.collection('Users').findOneAndDelete({
    _id: new ObjectID('5ada4308fb2b332fc0d88a83')
  }).then((result) => {

    console.log(JSON.stringify(result, undefined, 2));
  });




  client.close();
});
