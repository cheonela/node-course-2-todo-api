//library imports
var express = require('express');
var bodyParser = require('body-parser');  // send the json to the server
const {ObjectID} = require('mongodb');


//local imports - get the variable
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {Users} = require('./models/users');

var app = express();
const port = process.env.PORT || 3000;

// need to have the middleware
app.use(bodyParser.json());


// configuring the routes (post route), when we doing the db update, we will use the post HTTP method, and send the Json
// object to the server, then create the new model, and send the complete model with ID, and back to client
// app.post passing 2 arguments, 1st URL, 2nd: call back function, and the callback has 2 arguments, request, response
app.post('/todos', (req, res) => {
  console.log(req.body);  // the body store in the bodyParser

  // create the instance mongoose model
  var todo = new Todo({
    text: req.body.text

  });

  // it is save to the db
  todo.save().then((doc) => {
    // then we will send the doc callback
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);    // also can send back the status
  });

});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

// Get /todos passing the ID from URL
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;   // this is get the parameters from the URL, it has the field name, and value


  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo}); // send back the todo object
  }).catch((e) => {
    res.status(400).send();
  })
});

// It is used to bind the applicatiion to the port
app.listen(port, () => {
  console.log(`Started on port ${port}`);
});


module.exports = {app};
